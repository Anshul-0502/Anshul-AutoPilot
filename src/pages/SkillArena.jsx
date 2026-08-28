import React, { useState, useEffect } from 'react';
import XPSystem from './skill_arena/XPSystem';
import DailyChallenges from './skill_arena/DailyChallenges';
import Leaderboard from './skill_arena/Leaderboard';
import SkillSearch from './skill_arena/SkillSearch';
import CodeArena from './skill_arena/CodeArena';
import QuizArena from './skill_arena/QuizArena';
import LogicArena from './skill_arena/LogicArena';
import MissionArena from './skill_arena/MissionArena';
import BrainChallengeHub from './skill_arena/BrainChallengeHub';
import Achievements from './skill_arena/Achievements';
import SkillAnalytics from './skill_arena/SkillAnalytics';
import skillApi from '../services/api/skillApi';
import { useAuth } from '../contexts/AuthContext';

import { 
  Trophy, 
  Code, 
  HelpCircle, 
  Shuffle, 
  Compass, 
  Gamepad2, 
  Award, 
  BarChart3,
  Flame,
  Coins,
  Zap
} from 'lucide-react';

const getLevelInfo = (xp) => {
  if (xp < 200) return { level: 1, name: 'Novice' };
  if (xp < 500) return { level: 2, name: 'Code Initiate' };
  if (xp < 1000) return { level: 3, name: 'Algorithm Student' };
  if (xp < 2000) return { level: 4, name: 'Code Apprentice' };
  if (xp < 4000) return { level: 5, name: 'Logic Specialist' };
  return { level: 6, name: 'Master Developer' };
};

const defaultSkillData = {
  xp: 0,
  level: 1,
  coins: 0,
  streak: 0,
  completedChallenges: [],
  unlockedAchievements: [1],
  claimedAchievements: [],
  missionsProgress: {},
  stats: {
    totalGames: 0,
    accuracy: 100,
    codingCompleted: 0,
    quizzesCompleted: 0,
    logicScore: 0,
    reactionTime: 0,
  }
};

const SkillArena = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [skillData, setSkillData] = useState(defaultSkillData);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load live skill profile from backend
  useEffect(() => {
    const fetchSkillProfile = async () => {
      if (!isAuthenticated) return;
      setIsLoading(true);
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const res = await skillApi.getSkillProfile(todayStr);
        if (res.success && res.data?.profile) {
          setSkillData(res.data.profile);
        }
      } catch (err) {
        console.error('[Skill Arena Load Error] Failed to load skill profile:', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkillProfile();
  }, [isAuthenticated]);

  // Sync to local storage for legacy widgets
  useEffect(() => {
    if (skillData && skillData.xp !== undefined) {
      localStorage.setItem('anshul_autopilot_skill_data', JSON.stringify(skillData));
      window.dispatchEvent(new Event('storage'));
    }
  }, [skillData]);

  // Updater: Add XP
  const addXP = async (amount) => {
    try {
      const res = await skillApi.recordActivity({ category: 'brain', xpReward: amount });
      if (res.success && res.data?.profile) {
        setSkillData(res.data.profile);
      }
    } catch (err) {
      console.error('[Skill Arena Update Error] Failed to award XP:', err.message);
    }
  };

  // Updater: Add Coins
  const addCoins = async (amount) => {
    try {
      const res = await skillApi.recordActivity({ category: 'brain', coinReward: amount });
      if (res.success && res.data?.profile) {
        setSkillData(res.data.profile);
      }
    } catch (err) {
      console.error('[Skill Arena Update Error] Failed to award coins:', err.message);
    }
  };

  // Updater: Increment activity statistic
  const recordActivity = async (category, isCorrect, score, reactionTime) => {
    try {
      const res = await skillApi.recordActivity({ category, isCorrect, score, reactionTime });
      if (res.success && res.data?.profile) {
        setSkillData(res.data.profile);
      }
    } catch (err) {
      console.error('[Skill Arena Update Error] Failed to record activity:', err.message);
    }
  };

  // Updater: Complete daily challenge
  const completeChallenge = async (type) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await skillApi.completeChallenge(type, todayStr);
      if (res.success && res.data?.profile) {
        setSkillData(res.data.profile);
      }
    } catch (err) {
      console.error('[Skill Arena Update Error] Failed to complete challenge:', err.message);
    }
  };

  // Updater: Unlock mission node
  const completeMissionNode = async (pathKey, nodeKey) => {
    try {
      const res = await skillApi.completeMissionNode(pathKey, nodeKey);
      if (res.success && res.data?.profile) {
        setSkillData(res.data.profile);
      }
    } catch (err) {
      console.error('[Skill Arena Update Error] Failed to complete mission node:', err.message);
    }
  };

  // Updater: Claim Achievement Reward
  const claimAchievement = async (achievementId) => {
    try {
      const res = await skillApi.claimAchievement(achievementId);
      if (res.success && res.data?.profile) {
        setSkillData(res.data.profile);
      }
    } catch (err) {
      console.error('[Skill Arena Update Error] Failed to claim achievement:', err.message);
    }
  };

  const levelInfo = getLevelInfo(skillData.xp);

  // Tab definitions
  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: <Trophy size={18} /> },
    { id: 'code', label: 'Code Arena', icon: <Code size={18} /> },
    { id: 'quiz', label: 'Quiz Arena', icon: <HelpCircle size={18} /> },
    { id: 'logic', label: 'Logic Arena', icon: <Shuffle size={18} /> },
    { id: 'brain', label: 'Brain Hub', icon: <Gamepad2 size={18} /> },
    { id: 'missions', label: 'Missions', icon: <Compass size={18} /> },
    { id: 'achievements', label: 'Badges', icon: <Award size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
      minHeight: '80vh',
      boxSizing: 'border-box',
      textAlign: 'left'
    }}>
      {/* Top Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            🎮 Skill Arena
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Gamify your learning: level up coding, DSA, system logic, and mental computation speed!
          </p>
        </div>

        {/* User stats widget in header */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          background: 'var(--glass-card-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '8px 16px',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
            <Flame size={16} style={{ color: 'var(--color-accent)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{skillData.streak} Day Streak</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
            <Coins size={16} style={{ color: '#eab308' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{skillData.coins} Coins</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
            <Zap size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{skillData.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Main Glass Workspace Console */}
      {isLoading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 0',
          color: 'var(--text-secondary)'
        }}>
          Entering Arena...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '20px',
          alignItems: 'start'
        }} className="flex-col-mobile">
          
          {/* Navigation Sidebar */}
          <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ padding: '8px 12px' }}>
              <SkillSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
            <div style={{ height: '1px', background: 'var(--glass-border)', margin: '6px 0' }} />
            
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery(''); // Reset search on tab swap
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 14px',
                    border: 'none',
                    borderRadius: '8px',
                    background: isActive ? 'var(--color-primary-glow)' : 'transparent',
                    color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                  className="glass-btn-hover"
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Workspace Display Area */}
          <div style={{ minWidth: 0 }}>
            {activeTab === 'dashboard' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
                <div style={{ gridColumn: 'span 7' }} className="col-span-desktop-12">
                  <XPSystem xp={skillData.xp} streak={skillData.streak} levelInfo={levelInfo} />
                </div>
                <div style={{ gridColumn: 'span 5' }} className="col-span-desktop-12">
                  <DailyChallenges 
                    completed={skillData.completedChallenges} 
                    onTriggerTab={(tabId) => setActiveTab(tabId)} 
                  />
                </div>
                <div style={{ gridColumn: 'span 12' }}>
                  <Leaderboard userXp={skillData.xp} userLevel={levelInfo.level} />
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <CodeArena 
                onAwardXP={(xp) => addXP(xp)}
                onAwardCoins={(coins) => addCoins(coins)}
                onCompleteDaily={() => completeChallenge('code')}
                onRecordActivity={(isCorrect) => recordActivity('code', isCorrect)}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizArena 
                onAwardXP={(xp) => addXP(xp)}
                onAwardCoins={(coins) => addCoins(coins)}
                onCompleteDaily={() => completeChallenge('quiz')}
                onRecordActivity={(isCorrect) => recordActivity('quiz', isCorrect)}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'logic' && (
              <LogicArena 
                onAwardXP={(xp) => addXP(xp)}
                onAwardCoins={(coins) => addCoins(coins)}
                onCompleteDaily={() => completeChallenge('logic')}
                onRecordActivity={(isCorrect) => recordActivity('logic', isCorrect)}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'brain' && (
              <BrainChallengeHub 
                onAwardXP={(xp) => addXP(xp)}
                onAwardCoins={(coins) => addCoins(coins)}
                onCompleteDaily={() => completeChallenge('brain')}
                onRecordActivity={(isCorrect) => recordActivity('brain', isCorrect)}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'missions' && (
              <MissionArena 
                progress={skillData.missionsProgress || {}} 
                onCompleteNode={completeMissionNode} 
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'achievements' && (
              <Achievements 
                xp={skillData.xp}
                level={levelInfo.level}
                stats={skillData.stats}
                unlocked={skillData.unlockedAchievements}
                claimed={skillData.claimedAchievements}
                onClaimReward={claimAchievement}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'analytics' && (
              <SkillAnalytics 
                xp={skillData.xp} 
                stats={skillData.stats} 
                completedChallenges={skillData.completedChallenges} 
              />
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default SkillArena;
