import mongoose from 'mongoose';
import User from '../models/User.js';
import DataMigration from '../models/DataMigration.js';
import StudySession from '../models/StudySession.js';
import StudyNote from '../models/StudyNote.js';
import CodingLanguage from '../models/CodingLanguage.js';
import DSAProblem from '../models/DSAProblem.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import WaterLog from '../models/WaterLog.js';
import SleepLog from '../models/SleepLog.js';
import Habit from '../models/Habit.js';

// Controller handlers
import { getMigrationStatus, importLegacyData } from '../controllers/migrationController.js';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/anshul_autopilot';

async function runTests() {
  console.log('--- Starting Phase 21 Verification Tests ---');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Find or create test user
    let testUser = await User.findOne({ email: 'test_migration@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test Migrator',
        email: 'test_migration@example.com',
        passwordHash: 'dummyhash123'
      });
      console.log('Created test user.');
    } else {
      console.log('Using existing test user.');
    }

    const userId = testUser._id;

    // Teardown previous test data
    await DataMigration.deleteMany({ userId });
    await StudySession.deleteMany({ userId });
    await StudyNote.deleteMany({ userId });
    await CodingLanguage.deleteMany({ userId });
    await DSAProblem.deleteMany({ userId });
    await Project.deleteMany({ userId });
    await Task.deleteMany({ userId });
    await WaterLog.deleteMany({ userId });
    await SleepLog.deleteMany({ userId });
    await Habit.deleteMany({ userId });

    // Mock Express request/response
    const req = {
      user: testUser,
      body: {}
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

    // Helper execute function
    const execute = async (handler) => {
      res.statusCode = 200;
      res.jsonData = null;
      let caughtError = null;
      const next = (err) => { caughtError = err; };
      
      handler(req, res, next);
      
      for (let i = 0; i < 20; i++) {
        if (res.jsonData || caughtError) break;
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      if (caughtError) throw caughtError;
      return res.jsonData.data || res.jsonData;
    };

    // Test 1: Verify Initial Status (pending)
    console.log('\n[Test 1] Verify initial status is pending...');
    let initialStatus = await execute(getMigrationStatus);
    if (initialStatus.migrated !== false || initialStatus.status !== 'pending') {
      throw new Error('Initial migration status should be pending/false');
    }
    console.log('✓ Initial status verified.');

    // Test 2: Ingest Legacy Payload
    console.log('[Test 2] Ingesting legacy localStorage payload...');
    const mockLocalStorage = {
      'autopilot-study-sessions': JSON.stringify([
        { subject: 'Operating Systems', durationMinutes: 45, date: '2026-08-28' },
        { subject: 'DSA', durationMinutes: 60, date: '2026-08-28' }
      ]),
      'autopilot-study-notes': JSON.stringify([
        { title: 'Process States', subject: 'Operating Systems', content: 'Ready, Running, Blocked...' }
      ]),
      'anshul_autopilot_coding_data': JSON.stringify({
        languages: [{ name: 'Python', progress: 50 }],
        problems: [{ name: 'Reverse Linked List', difficulty: 'Easy', status: 'Solved', language: 'Python', dateLogged: '2026-08-28' }]
      }),
      'anshul_autopilot_projects_data': JSON.stringify([
        { name: 'Autopilot Frontend', description: 'React App', progress: 85 }
      ]),
      'anshul_autopilot_tasks_data': JSON.stringify([
        { title: 'Fix Layout alignment', category: 'General', deadline: '2026-08-28', completed: false }
      ]),
      'anshul_autopilot_health_data': JSON.stringify({
        waterLogs: [{ date: '2026-08-28', intake: 6 }],
        sleepLogs: [{ date: '2026-08-28', day: 'Friday', hours: 7 }],
        habits: [{ title: 'Drink Water', category: 'health', streak: 2, history: ['2026-08-28'] }]
      })
    };

    req.body = { data: mockLocalStorage };
    let importRes = await execute(importLegacyData);
    if (!importRes.migrated) {
      throw new Error('Migration did not report successful completed status');
    }

    const counts = importRes.importedCounts;
    if (
      counts.studySessions !== 2 ||
      counts.studyNotes !== 1 ||
      counts.languages !== 1 ||
      counts.problems !== 1 ||
      counts.projects !== 1 ||
      counts.tasks !== 1 ||
      counts.waterLogs !== 1 ||
      counts.sleepLogs !== 1 ||
      counts.habits !== 1
    ) {
      throw new Error(`Import counts are incorrect: ${JSON.stringify(counts)}`);
    }
    console.log('✓ Payload successfully ingested.');

    // Test 3: Deduplication check (re-run import)
    console.log('[Test 3] Re-running migration to assert deduplication...');
    // We try to run import again. It should return already migrated or skip imports
    // Wait, the controller will directly return the completed migration counts on subsequent requests,
    // but let's clear the status in DataMigration to force parsing again to assert item-level skips!
    await DataMigration.deleteMany({ userId });
    
    let reImportRes = await execute(importLegacyData);
    const reCounts = reImportRes.importedCounts;
    if (
      reCounts.studySessions !== 0 ||
      reCounts.studyNotes !== 0 ||
      reCounts.languages !== 0 ||
      reCounts.problems !== 0 ||
      reCounts.projects !== 0 ||
      reCounts.tasks !== 0
    ) {
      throw new Error(`Deduplication failed: created duplicate items: ${JSON.stringify(reCounts)}`);
    }
    console.log('✓ Deduplication verified successfully (0 items re-imported).');

    // Test 4: Final status check
    console.log('[Test 4] Verify final status is completed...');
    let finalStatus = await execute(getMigrationStatus);
    if (finalStatus.migrated !== true || finalStatus.status !== 'completed') {
      throw new Error('Final migration status should be completed/true');
    }
    console.log('✓ Final status verified.');

    // Teardown
    console.log('\n[Teardown] Cleaning up test data...');
    await DataMigration.deleteMany({ userId });
    await StudySession.deleteMany({ userId });
    await StudyNote.deleteMany({ userId });
    await CodingLanguage.deleteMany({ userId });
    await DSAProblem.deleteMany({ userId });
    await Project.deleteMany({ userId });
    await Task.deleteMany({ userId });
    await WaterLog.deleteMany({ userId });
    await SleepLog.deleteMany({ userId });
    await Habit.deleteMany({ userId });
    await User.deleteOne({ _id: userId });
    console.log('✓ Teardown complete.');

    console.log('\nAll legacy LocalStorage migration verification tests passed successfully! 🎉');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

runTests();
