import CodingLanguage from '../models/CodingLanguage.js';
import DSAProblem from '../models/DSAProblem.js';
import CodingNote from '../models/CodingNote.js';
import CodeSnippet from '../models/CodeSnippet.js';
import CodingResource from '../models/CodingResource.js';
import Goal from '../models/Goal.js';
import { calculateGoalProgress } from '../services/goalProgressService.js';
import InterviewTopic from '../models/InterviewTopic.js';
import CodingSession from '../models/CodingSession.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// --- LANGUAGES ---
export const getLanguages = asyncHandler(async (req, res) => {
  const languages = await CodingLanguage.find({ userId: req.user._id });
  res.status(200).json({ success: true, data: { languages } });
});

export const createLanguage = asyncHandler(async (req, res) => {
  const { name, progress, status } = req.body;
  if (!name) throw new ApiError(400, 'Language name is required');
  const language = await CodingLanguage.create({
    userId: req.user._id,
    name,
    progress: progress || 0,
    status: status || 'active'
  });
  res.status(201).json({ success: true, data: { language } });
});

export const updateLanguage = asyncHandler(async (req, res) => {
  const language = await CodingLanguage.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!language) throw new ApiError(404, 'Language not found');
  res.status(200).json({ success: true, data: { language } });
});

export const deleteLanguage = asyncHandler(async (req, res) => {
  const language = await CodingLanguage.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!language) throw new ApiError(404, 'Language not found');
  res.status(200).json({ success: true, message: 'Language deleted successfully' });
});

// --- PROBLEMS ---
export const getProblems = asyncHandler(async (req, res) => {
  const problems = await DSAProblem.find({ userId: req.user._id }).sort({ dateLogged: -1 });
  res.status(200).json({ success: true, data: { problems } });
});

export const createProblem = asyncHandler(async (req, res) => {
  const { name, platform, difficulty, topic, status, timeTaken, revisionRequired, solutionCode, complexityAnalysis, dateLogged } = req.body;
  if (!name || !dateLogged) throw new ApiError(400, 'Problem name and dateLogged are required');
  const problem = await DSAProblem.create({
    userId: req.user._id,
    name,
    platform: platform || 'LeetCode',
    difficulty: difficulty || 'Medium',
    topic: topic || 'General',
    status: status || 'Solved',
    timeTaken: timeTaken || '15 mins',
    revisionRequired: !!revisionRequired,
    solutionCode: solutionCode || '',
    complexityAnalysis: complexityAnalysis || '',
    dateLogged
  });
  res.status(201).json({ success: true, data: { problem } });
});

export const updateProblem = asyncHandler(async (req, res) => {
  const problem = await DSAProblem.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!problem) throw new ApiError(404, 'Problem not found');
  res.status(200).json({ success: true, data: { problem } });
});

export const deleteProblem = asyncHandler(async (req, res) => {
  const problem = await DSAProblem.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!problem) throw new ApiError(404, 'Problem not found');
  res.status(200).json({ success: true, message: 'Problem deleted successfully' });
});

// --- SNIPPETS ---
export const getSnippets = asyncHandler(async (req, res) => {
  const snippets = await CodeSnippet.find({ userId: req.user._id }).sort({ favorite: -1, createdAt: -1 });
  res.status(200).json({ success: true, data: { snippets } });
});

export const createSnippet = asyncHandler(async (req, res) => {
  const { title, lang, description, code, tags, favorite } = req.body;
  if (!title || !lang || !code) throw new ApiError(400, 'Title, lang, and code are required');
  const snippet = await CodeSnippet.create({
    userId: req.user._id,
    title,
    lang,
    description: description || '',
    code,
    tags: tags || [],
    favorite: !!favorite
  });
  res.status(201).json({ success: true, data: { snippet } });
});

export const updateSnippet = asyncHandler(async (req, res) => {
  const snippet = await CodeSnippet.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!snippet) throw new ApiError(404, 'Snippet not found');
  res.status(200).json({ success: true, data: { snippet } });
});

export const deleteSnippet = asyncHandler(async (req, res) => {
  const snippet = await CodeSnippet.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!snippet) throw new ApiError(404, 'Snippet not found');
  res.status(200).json({ success: true, message: 'Snippet deleted successfully' });
});

// --- NOTES ---
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await CodingNote.find({ userId: req.user._id }).sort({ favorite: -1, createdAt: -1 });
  res.status(200).json({ success: true, data: { notes } });
});

export const createNote = asyncHandler(async (req, res) => {
  const { title, content, lang, tags, codeSnippet, favorite, date } = req.body;
  if (!title || !date) throw new ApiError(400, 'Title and date are required');
  const note = await CodingNote.create({
    userId: req.user._id,
    title,
    content: content || '',
    lang: lang || 'General',
    tags: tags || [],
    codeSnippet: codeSnippet || '',
    favorite: !!favorite,
    date
  });
  res.status(201).json({ success: true, data: { note } });
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await CodingNote.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!note) throw new ApiError(404, 'Note not found');
  res.status(200).json({ success: true, data: { note } });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await CodingNote.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!note) throw new ApiError(404, 'Note not found');
  res.status(200).json({ success: true, message: 'Note deleted successfully' });
});

// --- GOALS ---
export const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ userId: req.user._id, category: 'coding' }).sort({ createdAt: -1 });
  const mapped = await Promise.all(goals.map(async (g) => {
    const progress = await calculateGoalProgress(g);
    return {
      id: g.id,
      _id: g._id,
      title: g.title,
      targetCount: g.targetValue,
      currentCount: progress.currentValue,
      period: g.period.charAt(0).toUpperCase() + g.period.slice(1),
      completed: progress.completed,
      progress: progress.progressPercent
    };
  }));
  res.status(200).json({ success: true, data: { goals: mapped } });
});

export const createGoal = asyncHandler(async (req, res) => {
  const { title, targetCount, period } = req.body;
  if (!title || !targetCount) throw new ApiError(400, 'Title and targetCount are required');

  const gPeriod = (period || 'Weekly').toLowerCase();

  let startDate = new Date();
  let endDate = new Date();
  if (gPeriod === 'daily') {
    startDate.setHours(0,0,0,0);
    endDate.setHours(23,59,59,999);
  } else if (gPeriod === 'weekly') {
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
    startDate.setDate(diff);
    startDate.setHours(0,0,0,0);
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23,59,59,999);
  } else {
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1, 0,0,0,0);
    endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23,59,59,999);
  }

  const goal = await Goal.create({
    userId: req.user._id,
    title,
    category: 'coding',
    metric: 'custom',
    targetValue: parseInt(targetCount, 10),
    manualCurrentValue: 0,
    period: gPeriod,
    startDate,
    endDate,
    status: 'active'
  });

  const progress = await calculateGoalProgress(goal);

  res.status(201).json({
    success: true,
    data: {
      goal: {
        id: goal.id,
        _id: goal._id,
        title: goal.title,
        targetCount: goal.targetValue,
        currentCount: progress.currentValue,
        period: period || 'Weekly',
        completed: progress.completed,
        progress: progress.progressPercent
      }
    }
  });
});

export const updateGoal = asyncHandler(async (req, res) => {
  const { currentCount } = req.body;
  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
  if (!goal) throw new ApiError(404, 'Goal not found');

  if (currentCount !== undefined) {
    goal.manualCurrentValue = parseInt(currentCount, 10);
  }
  await goal.save();

  const progress = await calculateGoalProgress(goal);

  res.status(200).json({
    success: true,
    data: {
      goal: {
        id: goal.id,
        _id: goal._id,
        title: goal.title,
        targetCount: goal.targetValue,
        currentCount: progress.currentValue,
        period: goal.period.charAt(0).toUpperCase() + goal.period.slice(1),
        completed: progress.completed,
        progress: progress.progressPercent
      }
    }
  });
});

export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!goal) throw new ApiError(404, 'Goal not found');
  res.status(200).json({ success: true, message: 'Goal deleted successfully' });
});

// --- RESOURCES ---
export const getResources = asyncHandler(async (req, res) => {
  const resources = await CodingResource.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: { resources } });
});

export const createResource = asyncHandler(async (req, res) => {
  const { name, type, url, lang, notes } = req.body;
  if (!name || !url) throw new ApiError(400, 'Name and URL are required');
  const resource = await CodingResource.create({
    userId: req.user._id,
    name,
    type: type || 'Documentation',
    url,
    lang: lang || 'General',
    notes: notes || ''
  });
  res.status(201).json({ success: true, data: { resource } });
});

export const deleteResource = asyncHandler(async (req, res) => {
  const resource = await CodingResource.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!resource) throw new ApiError(404, 'Resource not found');
  res.status(200).json({ success: true, message: 'Resource deleted successfully' });
});

// --- INTERVIEW PREPARATION ---
export const getInterviewTopics = asyncHandler(async (req, res) => {
  const topics = await InterviewTopic.find({ userId: req.user._id });
  res.status(200).json({ success: true, data: { interviewTopics: topics } });
});

export const createInterviewTopic = asyncHandler(async (req, res) => {
  const { category, title, completed } = req.body;
  if (!category || !title) throw new ApiError(400, 'Category and title are required');
  const topic = await InterviewTopic.create({
    userId: req.user._id,
    category,
    title,
    completed: !!completed
  });
  res.status(201).json({ success: true, data: { interviewTopic: topic } });
});

export const updateInterviewTopic = asyncHandler(async (req, res) => {
  const topic = await InterviewTopic.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!topic) throw new ApiError(404, 'Topic not found');
  res.status(200).json({ success: true, data: { interviewTopic: topic } });
});

export const deleteInterviewTopic = asyncHandler(async (req, res) => {
  const topic = await InterviewTopic.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!topic) throw new ApiError(404, 'Topic not found');
  res.status(200).json({ success: true, message: 'Topic deleted successfully' });
});

// --- SESSIONS ---
export const getSessions = asyncHandler(async (req, res) => {
  const sessions = await CodingSession.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: { timerLogs: sessions } });
});

export const createSession = asyncHandler(async (req, res) => {
  const { type, durationMinutes, date } = req.body;
  if (!type || !durationMinutes || !date) throw new ApiError(400, 'Type, durationMinutes and date are required');

  const session = await CodingSession.create({
    userId: req.user._id,
    type,
    durationMinutes: parseInt(durationMinutes, 10),
    date
  });
  res.status(201).json({ success: true, data: { session } });
});

// --- CODING SUMMARY ---
export const getCodingSummary = asyncHandler(async (req, res) => {
  const problems = await DSAProblem.find({ userId: req.user._id });
  const sessions = await CodingSession.find({ userId: req.user._id });
  const goals = await Goal.find({ userId: req.user._id, category: 'coding' });

  let totalProblems = problems.length;
  let solvedProblems = problems.filter(p => p.status === 'Solved').length;

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const todayStrLocale = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

  let solvedToday = problems.filter(p => {
    const norm = p.dateLogged.replace(/-/g, '/');
    const normTodayStr = todayStrLocale;
    const normTodayDashStr = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`;
    return (p.status === 'Solved' && (norm === normTodayStr || norm === normTodayDashStr || p.dateLogged === todayStr));
  }).length;

  let codingMinutesToday = 0;
  let codingMinutesWeek = 0;

  const getStartOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };
  const startOfWeek = getStartOfWeek(now);
  startOfWeek.setHours(0, 0, 0, 0);

  const uniqueDates = new Set();

  sessions.forEach(sess => {
    const normSessDate = sess.date.replace(/-/g, '/');
    const sessDate = new Date(normSessDate);
    if (!isNaN(sessDate.getTime())) {
      uniqueDates.add(normSessDate);

      const todaySlash = todayStrLocale;
      const todayDash = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`;
      if (sess.date === todaySlash || sess.date === todayDash || sess.date === todayStr) {
        codingMinutesToday += sess.durationMinutes;
      }

      sessDate.setHours(0, 0, 0, 0);
      if (sessDate >= startOfWeek && sessDate <= now) {
        codingMinutesWeek += sess.durationMinutes;
      }
    }
  });

  problems.forEach(p => {
    if (p.status === 'Solved') {
      const normDate = p.dateLogged.replace(/-/g, '/');
      uniqueDates.add(normDate);
    }
  });

  let currentStreak = 0;
  if (uniqueDates.size > 0) {
    const parseDateStr = (d) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    
    const yesterdayStr = parseDateStr(yesterday);

    const hasToday = uniqueDates.has(todayStrLocale) || uniqueDates.has(`${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`);
    const hasYesterday = uniqueDates.has(yesterdayStr);

    if (hasToday || hasYesterday) {
      currentStreak = 1;
      let checkDate = hasToday ? now : yesterday;
      
      while (true) {
        const prevDay = new Date(checkDate);
        prevDay.setDate(checkDate.getDate() - 1);
        const prevDayStr = parseDateStr(prevDay);

        if (uniqueDates.has(prevDayStr)) {
          currentStreak++;
          checkDate = prevDay;
        } else {
          break;
        }
      }
    }
  }

  const evaluatedGoals = await Promise.all(goals.map(async (g) => {
    const progress = await calculateGoalProgress(g);
    return { completed: progress.completed };
  }));
  const activeGoalCount = evaluatedGoals.filter(g => !g.completed).length;

  res.status(200).json({
    success: true,
    data: {
      totalProblems,
      solvedProblems,
      solvedToday,
      codingMinutesToday,
      codingMinutesWeek,
      currentStreak,
      activeGoalCount
    }
  });
});
