import mongoose from 'mongoose';
import User from '../models/User.js';
import Task from '../models/Task.js';
import PlannerEvent from '../models/PlannerEvent.js';
import StudySubject from '../models/StudySubject.js';
import StudySession from '../models/StudySession.js';
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

// Controller handler simulator
import { getDashboardSummary } from '../controllers/dashboardController.js';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/anshul_autopilot';

async function runTests() {
  console.log('--- Starting Phase 16 Verification Tests ---');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Find or create test user
    let testUser = await User.findOne({ email: 'test_dashboard@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test Dashboard User',
        email: 'test_dashboard@example.com',
        passwordHash: 'dummyhash123'
      });
      console.log('Created test user.');
    } else {
      console.log('Using existing test user.');
    }

    const userId = testUser._id;

    // Teardown any old tests
    await Task.deleteMany({ userId });
    await PlannerEvent.deleteMany({ userId });
    await StudySubject.deleteMany({ userId });
    await StudySession.deleteMany({ userId });
    await DSAProblem.deleteMany({ userId });
    await CodingSession.deleteMany({ userId });
    await Project.deleteMany({ userId });
    await SkillProfile.deleteMany({ userId });
    await HealthProfile.deleteMany({ userId });
    await WaterLog.deleteMany({ userId });
    await SleepLog.deleteMany({ userId });
    await Habit.deleteMany({ userId });
    await Goal.deleteMany({ userId });
    await Notification.deleteMany({ userId });

    // Seed mock data for verification
    await Task.create({ userId, title: 'Test Task 1', completed: false, priority: 'High', deadline: new Date() });
    await PlannerEvent.create({ userId, title: 'Planner Event 1', startTime: '10:00 AM', endTime: '11:00 AM', duration: 60, date: new Date() });
    await StudySubject.create({ userId, name: 'Data Networks', progress: 50, color: 'blue' });
    await StudySession.create({ userId, subject: 'Data Networks', durationSeconds: 3600, date: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}` });
    await DSAProblem.create({ userId, name: 'Binary Search', difficulty: 'Medium', status: 'Solved', dateLogged: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}` });
    await CodingSession.create({ userId, type: 'practice', durationMinutes: 45, date: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}` });
    await Project.create({ userId, name: 'AutoPilot App', progress: 30, status: 'In Progress' });
    await SkillProfile.create({ userId, level: 2, xp: 450, coins: 150 });
    await HealthProfile.create({ userId, waterGoal: 8 });
    await WaterLog.create({ userId, date: new Date().toISOString().split('T')[0], intake: 3 });
    await Notification.create({ userId, title: 'Test Alert', message: 'Something completed', type: 'system' });

    // Mock Express request/response
    const req = {
      user: testUser
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
    getDashboardSummary(req, res, next);

    // Wait for async controller execution to finish
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

    // Asserts
    console.log('\nAsserting Dashboard JSON structures...');
    
    if (data.user.name !== 'Test Dashboard User') throw new Error('Incorrect user name');
    console.log('✓ User metadata validated.');

    if (data.tasks.pending !== 1 || data.tasks.recent.length !== 1) throw new Error('Incorrect task statistics');
    console.log('✓ Tasks counts validated.');

    if (data.calendar.upcomingEvents.length !== 1 || data.calendar.eventDays.length !== 1) throw new Error('Incorrect calendar lists');
    console.log('✓ Calendar schedule validated.');

    if (data.study.todayMinutes !== 60 || data.study.subjects.length !== 1) throw new Error('Incorrect study metrics');
    console.log('✓ Study Hub stats validated.');

    if (data.coding.solvedProblems !== 1 || data.coding.minutesToday !== 45 || data.coding.streak !== 1) throw new Error('Incorrect coding logs');
    console.log('✓ Coding Workspace profile validated.');

    if (data.projects.total !== 1 || data.projects.list.length !== 1) throw new Error('Incorrect projects data');
    console.log('✓ Project milestones validated.');

    if (data.skills.level !== 2 || data.skills.coins !== 150) throw new Error('Incorrect skill profiles');
    console.log('✓ Skill Arena profile validated.');

    if (data.health.waterIntake !== 3 || data.health.waterGoal !== 8) throw new Error('Incorrect health records');
    console.log('✓ Health & hydrations logged validated.');

    if (data.notifications.length !== 1) throw new Error('Incorrect notifications log');
    console.log('✓ Notification widget entries validated.');

    // Teardown
    console.log('\n[Teardown] Cleaning up test data...');
    await Task.deleteMany({ userId });
    await PlannerEvent.deleteMany({ userId });
    await StudySubject.deleteMany({ userId });
    await StudySession.deleteMany({ userId });
    await DSAProblem.deleteMany({ userId });
    await CodingSession.deleteMany({ userId });
    await Project.deleteMany({ userId });
    await SkillProfile.deleteMany({ userId });
    await HealthProfile.deleteMany({ userId });
    await WaterLog.deleteMany({ userId });
    await SleepLog.deleteMany({ userId });
    await Habit.deleteMany({ userId });
    await Goal.deleteMany({ userId });
    await Notification.deleteMany({ userId });
    await User.deleteOne({ _id: userId });
    console.log('✓ Teardown complete.');

    console.log('\nAll Dashboard verification tests passed successfully! 🎉');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

runTests();
