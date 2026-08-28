import DSAProblem from '../models/DSAProblem.js';
import CodingSession from '../models/CodingSession.js';
import StudySession from '../models/StudySession.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import Workout from '../models/Workout.js';
import MeditationSession from '../models/MeditationSession.js';
import WaterLog from '../models/WaterLog.js';
import FocusSession from '../models/FocusSession.js';
import SkillProfile from '../models/SkillProfile.js';

// Helper to generate formatted string date lists for Mongoose queries
const getDatesInRange = (start, end, formatFn) => {
  const dates = [];
  const current = new Date(start);
  const last = new Date(end);
  current.setHours(0, 0, 0, 0);
  last.setHours(23, 59, 59, 999);

  const runner = new Date(current);
  while (runner <= last) {
    dates.push(formatFn(runner));
    runner.setDate(runner.getDate() + 1);
  }
  return dates;
};

const formatYMD = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatMDY = (d) => {
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

export const calculateGoalProgress = async (goal) => {
  const { userId, metric, startDate, endDate, manualCurrentValue, sourceFilter = {} } = goal;

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Generate date formats for query inputs
  const ymdDates = getDatesInRange(start, end, formatYMD);
  const mdyDates = getDatesInRange(start, end, formatMDY);

  let currentValue = 0;

  switch (metric) {
    case 'dsa_problems_solved': {
      const query = {
        userId,
        status: { $in: ['Solved', 'solved'] },
        dateLogged: { $in: ymdDates }
      };
      if (sourceFilter.topic) query.topic = sourceFilter.topic;
      if (sourceFilter.platform) query.platform = sourceFilter.platform;
      currentValue = await DSAProblem.countDocuments(query);
      break;
    }

    case 'coding_minutes': {
      const query = {
        userId,
        date: { $in: ymdDates }
      };
      const sessions = await CodingSession.find(query);
      currentValue = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
      break;
    }

    case 'study_minutes': {
      const query = {
        userId,
        date: { $in: mdyDates }
      };
      if (sourceFilter.subjectId) query.subject = sourceFilter.subjectId;
      const sessions = await StudySession.find(query);
      currentValue = sessions.reduce((sum, s) => sum + Math.round(s.durationSeconds / 60), 0);
      break;
    }

    case 'tasks_completed': {
      const query = {
        userId,
        completed: true,
        completedAt: { $gte: start, $lte: end }
      };
      currentValue = await Task.countDocuments(query);
      break;
    }

    case 'projects_completed': {
      const query = {
        userId,
        progress: 100
      };
      currentValue = await Project.countDocuments(query);
      break;
    }

    case 'workouts_completed': {
      const query = {
        userId,
        date: { $in: ymdDates }
      };
      if (sourceFilter.type) query.type = sourceFilter.type;
      currentValue = await Workout.countDocuments(query);
      break;
    }

    case 'meditation_minutes': {
      const query = {
        userId,
        date: { $in: ymdDates }
      };
      const sessions = await MeditationSession.find(query);
      currentValue = sessions.reduce((sum, s) => sum + s.duration, 0);
      break;
    }

    case 'water_goal_days': {
      const query = {
        userId,
        date: { $in: ymdDates },
        $expr: { $gte: ['$intake', '$goal'] }
      };
      currentValue = await WaterLog.countDocuments(query);
      break;
    }

    case 'focus_minutes': {
      const query = {
        userId,
        date: { $in: ymdDates }
      };
      if (sourceFilter.type) query.type = sourceFilter.type;
      const sessions = await FocusSession.find(query);
      currentValue = sessions.reduce((sum, s) => sum + s.duration, 0);
      break;
    }

    case 'xp_earned': {
      const profile = await SkillProfile.findOne({ userId });
      currentValue = profile ? profile.xp : 0;
      break;
    }

    case 'custom':
    default:
      currentValue = manualCurrentValue || 0;
      break;
  }

  // Calculate completion parameters
  const isCompleted = currentValue >= goal.targetValue;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentValue / goal.targetValue) * 100)));

  return {
    currentValue,
    progressPercent,
    completed: isCompleted
  };
};
