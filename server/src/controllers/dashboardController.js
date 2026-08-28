import User from '../models/User.js';
import Task from '../models/Task.js';
import PlannerEvent from '../models/PlannerEvent.js';
import StudySubject from '../models/StudySubject.js';
import StudySession from '../models/StudySession.js';
import StudyRevision from '../models/StudyRevision.js';
import DSAProblem from '../models/DSAProblem.js';
import CodingSession from '../models/CodingSession.js';
import Project from '../models/Project.js';
import SkillProfile from '../models/SkillProfile.js';
import HealthProfile from '../models/HealthProfile.js';
import WaterLog from '../models/WaterLog.js';
import SleepLog from '../models/SleepLog.js';
import Habit from '../models/Habit.js';
import Goal from '../models/Goal.js';
import Notification from '../models/Notification.js';
import { calculateGoalProgress } from '../services/goalProgressService.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get aggregated dashboard summary data
// @route   GET /api/v1/dashboard/summary
// @access  Private
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();

  // 1. User
  const user = {
    name: req.user.name,
    email: req.user.email
  };

  // 2. Tasks
  const allTasks = await Task.find({ userId }).sort({ createdAt: -1 });
  const pendingTasksCount = allTasks.filter(t => !t.completed).length;
  const completedTasksCount = allTasks.filter(t => t.completed).length;
  const highPriorityTasksCount = allTasks.filter(t => !t.completed && (t.priority === 'High' || t.priority === 'Critical')).length;
  const recentTasks = allTasks.slice(0, 3).map(t => ({
    id: t._id,
    title: t.title,
    completed: t.completed,
    priority: t.priority,
    deadline: t.deadline
  }));

  // 3. Calendar & Planner
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const todayEvents = await PlannerEvent.find({
    userId,
    date: { $gte: startOfDay, $lt: endOfDay }
  }).sort({ startTime: 1 });

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthEvents = await PlannerEvent.find({
    userId,
    date: { $gte: startOfMonth, $lt: endOfMonth }
  });
  const eventDays = [...new Set(monthEvents.map(e => new Date(e.date).getDate()))];

  const upcomingEvents = todayEvents.map(e => ({
    time: e.startTime,
    title: e.title,
    type: e.category
  }));

  // 4. Study Tracker
  const subjects = await StudySubject.find({ userId }).sort({ progress: -1 });
  const studySessions = await StudySession.find({ userId });
  const studyRevisions = await StudyRevision.find({ userId, status: 'upcoming' });

  let studyMinutesToday = 0;
  let totalStudyMinutes = 0;
  const todayStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

  studySessions.forEach(sess => {
    const mins = Math.round(sess.durationSeconds / 60);
    totalStudyMinutes += mins;
    if (sess.date.replace(/-/g, '/') === todayStr) {
      studyMinutesToday += mins;
    }
  });

  const studyDates = new Set(studySessions.map(s => s.date.replace(/-/g, '/')));
  let studyStreak = 0;
  if (studyDates.size > 0) {
    const parseDateStr = (d) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = parseDateStr(yesterday);
    const hasToday = studyDates.has(todayStr);
    const hasYesterday = studyDates.has(yesterdayStr);
    if (hasToday || hasYesterday) {
      studyStreak = 1;
      let checkDate = hasToday ? now : yesterday;
      while (true) {
        const prevDay = new Date(checkDate);
        prevDay.setDate(checkDate.getDate() - 1);
        const prevDayStr = parseDateStr(prevDay);
        if (studyDates.has(prevDayStr)) {
          studyStreak++;
          checkDate = prevDay;
        } else {
          break;
        }
      }
    }
  }

  const studyData = {
    todayMinutes: studyMinutesToday,
    totalHours: Math.round((totalStudyMinutes / 60) * 10) / 10,
    streak: studyStreak,
    activeSubject: subjects[0] ? subjects[0].name : 'None',
    subjects: subjects.slice(0, 3).map(s => ({
      name: s.name,
      progress: s.progress,
      color: s.color === 'blue' ? 'var(--color-primary)' : s.color === 'purple' ? 'var(--color-secondary)' : s.color === 'orange' ? 'var(--color-accent)' : s.color
    })),
    upcomingRevisionsCount: studyRevisions.length
  };

  // 5. Coding & DSA
  const problems = await DSAProblem.find({ userId });
  const codingSessions = await CodingSession.find({ userId });

  const totalProblems = problems.length;
  const solvedProblems = problems.filter(p => p.status === 'Solved').length;

  let codingMinutesToday = 0;
  let totalCodingMinutes = 0;
  codingSessions.forEach(sess => {
    totalCodingMinutes += sess.durationMinutes;
    const todayStrLocale = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    const todayStrDash = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`;
    const todayStrFull = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    if (sess.date === todayStrLocale || sess.date === todayStrDash || sess.date === todayStrFull) {
      codingMinutesToday += sess.durationMinutes;
    }
  });

  const codingDates = new Set();
  codingSessions.forEach(s => codingDates.add(s.date.replace(/-/g, '/')));
  problems.forEach(p => {
    if (p.status === 'Solved') {
      codingDates.add(p.dateLogged.replace(/-/g, '/'));
    }
  });

  let codingStreak = 0;
  if (codingDates.size > 0) {
    const parseDateStr = (d) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = parseDateStr(yesterday);
    const todayStrLocale = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    const hasToday = codingDates.has(todayStrLocale);
    const hasYesterday = codingDates.has(yesterdayStr);
    if (hasToday || hasYesterday) {
      codingStreak = 1;
      let checkDate = hasToday ? now : yesterday;
      while (true) {
        const prevDay = new Date(checkDate);
        prevDay.setDate(checkDate.getDate() - 1);
        const prevDayStr = parseDateStr(prevDay);
        if (codingDates.has(prevDayStr)) {
          codingStreak++;
          checkDate = prevDay;
        } else {
          break;
        }
      }
    }
  }

  const recentSolutions = problems
    .filter(p => p.status === 'Solved')
    .sort((a, b) => new Date(b.dateLogged) - new Date(a.dateLogged))
    .slice(0, 2)
    .map(p => ({
      title: p.name,
      difficulty: p.difficulty,
      time: p.dateLogged
    }));

  const codingData = {
    solvedProblems,
    totalProblems,
    minutesToday: codingMinutesToday,
    totalHours: Math.round((totalCodingMinutes / 60) * 10) / 10,
    streak: codingStreak,
    recentSolutions
  };

  // 6. Projects
  const projectsList = await Project.find({ userId }).sort({ createdAt: -1 });
  const projects = projectsList.slice(0, 3).map(p => ({
    id: p._id,
    name: p.name,
    progress: p.progress,
    status: p.status,
    category: p.category
  }));

  const projectsData = {
    total: projectsList.length,
    active: projectsList.filter(p => p.status === 'In Progress').length,
    list: projects
  };

  // 7. Skill Profile (Lazy create if missing)
  let skillProfile = await SkillProfile.findOne({ userId });
  if (!skillProfile) {
    skillProfile = await SkillProfile.create({ userId });
  }

  const skillData = {
    level: skillProfile.level,
    xp: skillProfile.xp,
    coins: skillProfile.coins,
    streak: skillProfile.streak
  };

  // 8. Health & Habit Logs
  let healthProfile = await HealthProfile.findOne({ userId });
  if (!healthProfile) {
    healthProfile = await HealthProfile.create({ userId });
  }

  const todayDateStr = now.toISOString().split('T')[0];
  const waterLog = await WaterLog.findOne({ userId, date: todayDateStr });
  const sleepLog = await SleepLog.findOne({ userId, date: todayDateStr });

  const habits = await Habit.find({ userId });
  const habitsTotal = habits.length;
  const habitsCompleted = habits.filter(h => h.history instanceof Map ? h.history.get(todayDateStr) === true : false).length;

  const healthData = {
    waterIntake: waterLog ? waterLog.intake : 0,
    waterGoal: healthProfile.waterGoal,
    sleepDuration: sleepLog ? sleepLog.hours || 0 : 0,
    sleepQuality: sleepLog ? Math.min(100, Math.round((sleepLog.hours / 8) * 100)) : 0,
    habitsCompleted,
    habitsTotal,
    reminders: healthProfile.reminders
  };

  // 9. Goals
  const allGoals = await Goal.find({ userId });
  const evaluatedGoals = await Promise.all(allGoals.map(async (g) => {
    const progress = await calculateGoalProgress(g);
    return { completed: progress.completed };
  }));
  const completedGoalsCount = evaluatedGoals.filter(g => g.completed).length;
  const overallCompletionRate = evaluatedGoals.length > 0
    ? Math.round((completedGoalsCount / evaluatedGoals.length) * 100)
    : 0;

  const goalsData = {
    goalsCount: allGoals.length,
    completedCount: completedGoalsCount,
    overallCompletionRate
  };

  const notificationsList = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(3);

  const recentNotifications = notificationsList.map(n => ({
    id: n._id,
    title: n.title,
    message: n.message,
    desc: n.desc,
    type: n.type,
    time: n.date || new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  res.status(200).json({
    success: true,
    data: {
      user,
      tasks: {
        pending: pendingTasksCount,
        completed: completedTasksCount,
        highPriority: highPriorityTasksCount,
        recent: recentTasks
      },
      calendar: {
        eventDays,
        upcomingEvents
      },
      study: studyData,
      coding: codingData,
      projects: projectsData,
      skills: skillData,
      health: healthData,
      goals: goalsData,
      notifications: recentNotifications
    }
  });
});
