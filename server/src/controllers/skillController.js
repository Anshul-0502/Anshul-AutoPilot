import SkillProfile from '../models/SkillProfile.js';
import achievementList from '../config/achievements.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Level helper
export const getLevelInfo = (xp) => {
  if (xp < 200) return { level: 1, name: 'Novice' };
  if (xp < 500) return { level: 2, name: 'Code Initiate' };
  if (xp < 1000) return { level: 3, name: 'Algorithm Student' };
  if (xp < 2000) return { level: 4, name: 'Code Apprentice' };
  if (xp < 4000) return { level: 5, name: 'Logic Specialist' };
  return { level: 6, name: 'Master Developer' };
};

// Achievements evaluation
export const evaluateAchievements = (profile) => {
  const unlocked = new Set(profile.unlockedAchievements || []);
  
  // ID 1 is always unlocked
  unlocked.add(1);
  
  // ID 2: Reach Level 5
  if (profile.level >= 5) {
    unlocked.add(2);
  }
  
  // ID 3: Complete 10 total games
  const totalCompleted = (profile.stats.codingCompleted || 0) + (profile.stats.quizzesCompleted || 0);
  if ((profile.stats.totalGames || 0) >= 10 || totalCompleted >= 10) {
    unlocked.add(3);
  }
  
  // ID 4: Perfect Day (4 Daily Challenges completed)
  if (profile.completedChallenges.length === 4) {
    unlocked.add(4);
  }
  
  // ID 5: Streak Master (5 Day Streak)
  if (profile.streak >= 5) {
    unlocked.add(5);
  }
  
  // ID 6: Journey Begins (1 Mission node completed)
  let totalMissionsCompleted = 0;
  if (profile.missionsProgress) {
    for (const [key, value] of profile.missionsProgress.entries()) {
      if (Array.isArray(value)) {
        totalMissionsCompleted += value.length;
      }
    }
  }
  if (totalMissionsCompleted >= 1) {
    unlocked.add(6);
  }
  
  profile.unlockedAchievements = Array.from(unlocked);
};

// Daily reset check
export const checkDailyReset = (profile, clientTodayStr) => {
  const todayStr = clientTodayStr || new Date().toISOString().split('T')[0];
  if (profile.lastActiveDate !== todayStr) {
    if (profile.lastActiveDate) {
      const lastDate = new Date(profile.lastActiveDate);
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        profile.streak = 0; // Streak broken
      }
    }
    profile.completedChallenges = [];
    profile.lastActiveDate = todayStr;
  }
};

// @desc    Get user skill profile
// @route   GET /api/v1/skills/profile
// @access  Private
export const getSkillProfile = asyncHandler(async (req, res) => {
  const todayStr = req.query.today || new Date().toISOString().split('T')[0];
  
  let profile = await SkillProfile.findOne({ userId: req.user._id });
  if (!profile) {
    profile = await SkillProfile.create({
      userId: req.user._id,
      lastActiveDate: todayStr
    });
  } else {
    checkDailyReset(profile, todayStr);
    await profile.save();
  }

  res.status(200).json({ success: true, data: { profile } });
});

// @desc    Complete a daily challenge
// @route   POST /api/v1/skills/challenges/complete
// @access  Private
export const completeChallenge = asyncHandler(async (req, res) => {
  const { type, today } = req.body;
  if (!type) throw new ApiError(400, 'Challenge type is required');

  const todayStr = today || new Date().toISOString().split('T')[0];
  let profile = await SkillProfile.findOne({ userId: req.user._id });
  if (!profile) {
    profile = await SkillProfile.create({ userId: req.user._id, lastActiveDate: todayStr });
  } else {
    checkDailyReset(profile, todayStr);
  }

  // Idempotency check
  if (profile.completedChallenges.includes(type)) {
    return res.status(200).json({ success: true, data: { profile, reward: { xp: 0, coins: 0 } } });
  }

  // Determine rewards
  let baseXp = 50;
  let baseCoins = 15;
  if (type === 'code') { baseXp = 100; baseCoins = 20; }
  else if (type === 'quiz') { baseXp = 80; baseCoins = 15; }
  else if (type === 'logic') { baseXp = 90; baseCoins = 15; }
  else if (type === 'brain') { baseXp = 80; baseCoins = 15; }

  // Increment completed challenges list
  profile.completedChallenges.push(type);

  let bonusXp = 0;
  let bonusCoins = 0;
  // Perfect day bonus
  if (profile.completedChallenges.length === 4) {
    bonusXp = 100;
    bonusCoins = 50;
    // Unlock perfect day achievement (Badge ID 4)
    if (!profile.unlockedAchievements.includes(4)) {
      profile.unlockedAchievements.push(4);
    }
  }

  // Streak update on first challenge completed today
  if (profile.completedChallenges.length === 1) {
    profile.streak += 1;
    // Streak Master check (Badge ID 5)
    if (profile.streak >= 5 && !profile.unlockedAchievements.includes(5)) {
      profile.unlockedAchievements.push(5);
    }
  }

  const finalXpEarned = baseXp + bonusXp;
  const finalCoinsEarned = baseCoins + bonusCoins;

  profile.xp += finalXpEarned;
  profile.coins += finalCoinsEarned;
  profile.level = getLevelInfo(profile.xp).level;

  evaluateAchievements(profile);
  await profile.save();

  res.status(200).json({
    success: true,
    data: {
      profile,
      reward: { xp: finalXpEarned, coins: finalCoinsEarned }
    }
  });
});

// @desc    Record activity stats
// @route   POST /api/v1/skills/activities
// @access  Private
export const recordActivity = asyncHandler(async (req, res) => {
  const { category, isCorrect, score, reactionTime, xpReward, coinReward } = req.body;
  if (!category) throw new ApiError(400, 'Activity category is required');

  let profile = await SkillProfile.findOne({ userId: req.user._id });
  if (!profile) {
    profile = await SkillProfile.create({ userId: req.user._id });
  }

  // Increment total stats counters
  profile.stats.totalGames += 1;
  if (category === 'code') profile.stats.codingCompleted += 1;
  if (category === 'quiz') profile.stats.quizzesCompleted += 1;

  if (isCorrect !== undefined) {
    profile.stats.totalAttempts += 1;
    if (isCorrect) profile.stats.correctAttempts += 1;
    profile.stats.accuracy = Math.min(100, Math.max(10, Math.round((profile.stats.correctAttempts / profile.stats.totalAttempts) * 100)));
  }

  if (score !== undefined) {
    profile.stats.logicScore = score;
  }
  if (reactionTime !== undefined) {
    profile.stats.reactionTime = reactionTime;
  }

  // Handle dynamic game awards (capped to prevent hacking)
  const xp = Math.min(500, Math.max(0, parseInt(xpReward, 10) || 0));
  const coins = Math.min(100, Math.max(0, parseInt(coinReward, 10) || 0));
  profile.xp += xp;
  profile.coins += coins;
  profile.level = getLevelInfo(profile.xp).level;

  evaluateAchievements(profile);
  await profile.save();

  res.status(200).json({ success: true, data: { profile } });
});

// @desc    Unlock a mission node
// @route   POST /api/v1/skills/missions/complete
// @access  Private
export const completeMissionNode = asyncHandler(async (req, res) => {
  const { pathKey, nodeKey } = req.body;
  if (!pathKey || !nodeKey) throw new ApiError(400, 'Mission pathKey and nodeKey are required');

  let profile = await SkillProfile.findOne({ userId: req.user._id });
  if (!profile) {
    profile = await SkillProfile.create({ userId: req.user._id });
  }

  const pathProgress = profile.missionsProgress.get(pathKey) || [];
  if (pathProgress.includes(nodeKey)) {
    return res.status(200).json({ success: true, data: { profile, reward: { xp: 0 } } });
  }

  profile.missionsProgress.set(pathKey, [...pathProgress, nodeKey]);
  const xpReward = 150;
  profile.xp += xpReward;
  profile.level = getLevelInfo(profile.xp).level;

  evaluateAchievements(profile);
  await profile.save();

  res.status(200).json({
    success: true,
    data: {
      profile,
      reward: { xp: xpReward }
    }
  });
});

// @desc    Claim an achievement reward
// @route   POST /api/v1/skills/achievements/:id/claim
// @access  Private
export const claimAchievement = asyncHandler(async (req, res) => {
  const achId = parseInt(req.params.id, 10);
  if (isNaN(achId)) throw new ApiError(400, 'Invalid achievement ID');

  let profile = await SkillProfile.findOne({ userId: req.user._id });
  if (!profile) throw new ApiError(404, 'Skill profile not found');

  // Verify eligibility
  if (!profile.unlockedAchievements.includes(achId)) {
    throw new ApiError(400, 'Achievement is not unlocked yet');
  }
  if (profile.claimedAchievements.includes(achId)) {
    throw new ApiError(400, 'Achievement reward already claimed');
  }

  // Find reward values
  const ach = achievementList.find(a => a.id === achId);
  const xpReward = ach ? ach.xpReward : 100;
  const coinReward = ach ? ach.coinReward : 20;

  profile.claimedAchievements.push(achId);
  profile.xp += xpReward;
  profile.coins += coinReward;
  profile.level = getLevelInfo(profile.xp).level;

  evaluateAchievements(profile);
  await profile.save();

  res.status(200).json({
    success: true,
    data: {
      profile,
      reward: { xp: xpReward, coins: coinReward }
    }
  });
});
