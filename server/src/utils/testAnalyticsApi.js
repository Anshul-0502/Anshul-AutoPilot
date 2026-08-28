import mongoose from 'mongoose';
import User from '../models/User.js';
import Task from '../models/Task.js';
import PlannerEvent from '../models/PlannerEvent.js';
import StudySubject from '../models/StudySubject.js';
import StudySession from '../models/StudySession.js';
import StudyNote from '../models/StudyNote.js';
import StudyPdf from '../models/StudyPdf.js';
import StudyRevision from '../models/StudyRevision.js';
import DSAProblem from '../models/DSAProblem.js';
import CodingSession from '../models/CodingSession.js';
import CodingLanguage from '../models/CodingLanguage.js';
import Project from '../models/Project.js';
import SkillProfile from '../models/SkillProfile.js';
import HealthProfile from '../models/HealthProfile.js';
import WaterLog from '../models/WaterLog.js';
import SleepLog from '../models/SleepLog.js';
import Habit from '../models/Habit.js';
import Goal from '../models/Goal.js';
import Workout from '../models/Workout.js';

// Controller handler simulator
import { getAnalyticsSummary } from '../controllers/analyticsController.js';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/anshul_autopilot';

async function runTests() {
  console.log('--- Starting Phase 17 Verification Tests ---');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Find or create test user
    let testUser = await User.findOne({ email: 'test_analytics@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test Analytics User',
        email: 'test_analytics@example.com',
        passwordHash: 'dummyhash123'
      });
      console.log('Created test user.');
    } else {
      console.log('Using existing test user.');
    }

    const userId = testUser._id;

    // Teardown old records
    await Task.deleteMany({ userId });
    await StudySession.deleteMany({ userId });
    await StudyNote.deleteMany({ userId });
    await StudyPdf.deleteMany({ userId });
    await StudyRevision.deleteMany({ userId });
    await DSAProblem.deleteMany({ userId });
    await CodingSession.deleteMany({ userId });
    await CodingLanguage.deleteMany({ userId });
    await Project.deleteMany({ userId });
    await SkillProfile.deleteMany({ userId });
    await HealthProfile.deleteMany({ userId });
    await WaterLog.deleteMany({ userId });
    await SleepLog.deleteMany({ userId });
    await Habit.deleteMany({ userId });
    await Goal.deleteMany({ userId });
    await Workout.deleteMany({ userId });

    // Seed mock data for verification
    await Task.create({ userId, title: 'Task Completed', completed: true, priority: 'High', deadline: new Date() });
    await Task.create({ userId, title: 'Task Pending', completed: false, priority: 'Medium', deadline: new Date(Date.now() - 3600000) }); // Overdue
    
    await StudySession.create({ userId, subject: 'DSA', durationSeconds: 7200, date: '08/28/2026' }); // 2 hours
    await StudyNote.create({ userId, title: 'Tries and Graph Notes', subject: 'DSA', content: 'Sample content' });
    await StudyPdf.create({ userId, title: 'CLRS Chapter 4', subject: 'DSA', currentPage: 50, totalPages: 50 }); // Completed PDF
    await StudyRevision.create({ userId, topic: 'Graph Traversals', subject: 'DSA', dueDate: '08/28/2026', status: 'completed' });

    await CodingSession.create({ userId, type: 'DSA', durationMinutes: 120, date: '08/28/2026' }); // 2 hours
    await DSAProblem.create({ userId, name: 'Lru Cache', difficulty: 'Hard', status: 'Solved', dateLogged: '2026-08-28' });
    await CodingLanguage.create({ userId, name: 'TypeScript', progress: 80 });

    await Project.create({ userId, name: 'Anshul AutoPilot Backend', progress: 60, status: 'In Progress', milestones: [{ id: 'm1', title: 'Phase 17 complete', status: 'completed' }] });
    await SkillProfile.create({ userId, level: 3, xp: 900, coins: 400 });
    
    await WaterLog.create({ userId, date: new Date().toISOString().split('T')[0], intake: 8 });
    await SleepLog.create({ userId, id: 's1', date: new Date().toISOString().split('T')[0], day: 'Friday', hours: 8 });
    await Workout.create({ userId, id: 'w1', type: 'Cardio', duration: 30, date: new Date().toISOString().split('T')[0] });
    const todayStrStr = new Date().toISOString().split('T')[0];
    const historyMap = new Map();
    historyMap.set(todayStrStr, true);
    await Habit.create({ userId, id: 'h1', title: 'Early Wakeup', category: 'health', history: historyMap });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await Goal.create({ userId, title: 'Finish Phase 17 Backend', targetValue: 1, period: 'weekly', category: 'coding', startDate: new Date(), endDate: tomorrow });

    // Test each filter: Daily, Weekly, Monthly, Yearly
    const filters = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

    for (const filter of filters) {
      console.log(`\nExecuting verification for filter: [${filter}]`);

      const req = {
        user: testUser,
        query: { filter }
      };

      const res = {
        statusCode: 200,
        jsonData: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.jsonData = data;
          return this;
        }
      };

      let caughtError = null;
      const next = (err) => {
        caughtError = err;
      };

      getAnalyticsSummary(req, res, next);

      // Wait for async execution
      for (let i = 0; i < 20; i++) {
        if (res.jsonData || caughtError) break;
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      if (caughtError) {
        throw caughtError;
      }

      if (res.statusCode !== 200) {
        throw new Error(`Expected status 200, got ${res.statusCode}`);
      }

      const { success, data } = res.jsonData;
      if (!success || !data) {
        throw new Error('Response is missing success status or data object');
      }

      // Assertions for correctness
      if (typeof data.study.totalHours !== 'number') throw new Error('Incorrect study hours format');
      if (typeof data.coding.totalHours !== 'number') throw new Error('Incorrect coding hours format');
      if (data.tasks.total !== 2) throw new Error('Incorrect task counts');
      if (data.tasks.overdue !== 1) throw new Error('Incorrect overdue task counts');
      if (data.skill.level !== 3) throw new Error('Incorrect skill level');
      if (data.habits.waterIntake !== 8) throw new Error('Incorrect average water intake');
      if (data.habits.sleepHours !== 8) throw new Error('Incorrect average sleep hours');
      if (data.habits.exercise !== 'Yes') throw new Error('Workout session was not flagged correctly');
      if (data.goals.completedGoals !== 0) throw new Error('Goal completion rate miscalculated');

      console.log(`✓ Analytics filter [${filter}] calculations validated.`);
    }

    // Teardown
    console.log('\n[Teardown] Cleaning up test data...');
    await Task.deleteMany({ userId });
    await StudySession.deleteMany({ userId });
    await StudyNote.deleteMany({ userId });
    await StudyPdf.deleteMany({ userId });
    await StudyRevision.deleteMany({ userId });
    await DSAProblem.deleteMany({ userId });
    await CodingSession.deleteMany({ userId });
    await CodingLanguage.deleteMany({ userId });
    await Project.deleteMany({ userId });
    await SkillProfile.deleteMany({ userId });
    await HealthProfile.deleteMany({ userId });
    await WaterLog.deleteMany({ userId });
    await SleepLog.deleteMany({ userId });
    await Habit.deleteMany({ userId });
    await Goal.deleteMany({ userId });
    await Workout.deleteMany({ userId });
    await User.deleteOne({ _id: userId });
    console.log('✓ Teardown complete.');

    console.log('\nAll Analytics verification tests passed successfully! 🎉');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

runTests();
