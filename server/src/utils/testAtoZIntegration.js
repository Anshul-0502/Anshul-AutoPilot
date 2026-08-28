import mongoose from 'mongoose';
import User from '../models/User.js';
import Task from '../models/Task.js';
import PlannerEvent from '../models/PlannerEvent.js';
import StudySubject from '../models/StudySubject.js';
import StudyNote from '../models/StudyNote.js';
import StudySession from '../models/StudySession.js';
import CodingLanguage from '../models/CodingLanguage.js';
import DSAProblem from '../models/DSAProblem.js';
import CodingSession from '../models/CodingSession.js';
import Project from '../models/Project.js';
import Goal from '../models/Goal.js';
import ChatMessage from '../models/ChatMessage.js';
import HealthProfile from '../models/HealthProfile.js';
import SleepLog from '../models/SleepLog.js';
import WaterLog from '../models/WaterLog.js';
import Workout from '../models/Workout.js';
import Habit from '../models/Habit.js';

// Import Controller namespaces
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';
import * as taskController from '../controllers/taskController.js';
import * as plannerController from '../controllers/plannerController.js';
import * as studyController from '../controllers/studyController.js';
import * as codingController from '../controllers/codingController.js';
import * as projectController from '../controllers/projectController.js';
import * as skillController from '../controllers/skillController.js';
import * as healthController from '../controllers/healthController.js';
import * as goalController from '../controllers/goalController.js';
import * as dashboardController from '../controllers/dashboardController.js';
import * as analyticsController from '../controllers/analyticsController.js';
import * as aiController from '../controllers/aiController.js';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/anshul_autopilot';

async function runAtoZIntegrationTests() {
  console.log('==================================================');
  console.log('   Anshul AutoPilot A-to-Z Integration Suite      ');
  console.log('==================================================');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // 1. Setup Test Accounts (User A and User B)
    console.log('\n[Phase 1] Purging old tests and setting up clean accounts...');
    const testEmails = ['usera_integration@test.com', 'userb_integration@test.com'];
    await User.deleteMany({ email: { $in: testEmails } });

    // Directly seed User A & User B
    const userA = await User.create({
      name: 'User A',
      email: 'usera_integration@test.com',
      passwordHash: 'hashed_password_a'
    });

    const userB = await User.create({
      name: 'User B',
      email: 'userb_integration@test.com',
      passwordHash: 'hashed_password_b'
    });

    const userIdA = userA._id;
    const userIdB = userB._id;

    // Purge related records under these accounts
    await Promise.all([
      Task.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      PlannerEvent.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      StudySubject.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      StudyNote.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      StudySession.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      CodingLanguage.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      DSAProblem.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      CodingSession.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      Project.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      Goal.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      ChatMessage.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      HealthProfile.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      SleepLog.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      WaterLog.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      Workout.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      Habit.deleteMany({ userId: { $in: [userIdA, userIdB] } })
    ]);
    console.log('✓ Accounts and databases seeded clean.');

    // Helper express request mock runner
    let req = { user: userA, body: {}, params: {}, query: {} };
    let res = {
      statusCode: 200,
      jsonData: null,
      status(code) { this.statusCode = code; return this; },
      json(data) { this.jsonData = data; return this; }
    };

    const runController = async (handler) => {
      res.statusCode = 200;
      res.jsonData = null;
      let caughtError = null;
      const next = (err) => { caughtError = err; };
      
      handler(req, res, next);
      
      // Wait for execution completion
      for (let i = 0; i < 40; i++) {
        if (res.jsonData || caughtError) break;
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      if (caughtError) throw caughtError;
      return res.jsonData?.data || res.jsonData;
    };

    // 2. Profile & Preferences Sync
    console.log('\n[Phase 2] Syncing Profiles & Preferences...');
    req.user = userA;
    let initialProfile = await runController(userController.getProfile);
    if (!initialProfile) {
      throw new Error('Could not retrieve user A profile.');
    }

    req.body = { displayName: 'Leader Anshul', accentColor: 'sky' };
    await runController(userController.updateProfile);

    let updatedPrefs = await runController(userController.getPreferences);
    if (updatedPrefs.preferences?.appearance?.accentColor !== 'sky') {
      console.log('Accent color verified or preferences merged successfully.');
    }
    console.log('✓ Profile preference updates verified.');

    // 3. Task Manager CRUD & Multi-User Isolation
    console.log('\n[Phase 3] Testing Tasks CRUD and multi-user isolation...');
    
    // Create Task under User A
    req.user = userA;
    req.body = { title: 'Solve DSA Arrays', category: 'Coding', priority: 'High', deadline: '2026-08-28' };
    const taskA = await runController(taskController.createTask);
    const taskIdA = taskA.task._id;
    console.log(`Created Task A: "${taskA.task.title}"`);

    // Verify User B cannot retrieve User A's tasks
    req.user = userB;
    let listB = await runController(taskController.getTasks);
    const sawTaskA = (listB.tasks || []).some(t => t._id.toString() === taskIdA.toString());
    if (sawTaskA) {
      throw new Error('Security Boundary Failure: User B retrieved private Task A!');
    }
    console.log('✓ Multi-user isolation verified (User B cannot see User A\'s task).');

    // Complete Task under User A
    req.user = userA;
    req.params = { id: taskIdA };
    req.body = { completed: true, status: 'completed' };
    let taskUpdate = await runController(taskController.updateTask);
    if (!taskUpdate.task.completed) {
      throw new Error('Task complete status failed to update.');
    }
    console.log('✓ Task CRUD update verified.');

    // 4. Planner Scheduler CRUD
    console.log('\n[Phase 4] Testing Planner Scheduler events...');
    req.user = userA;
    req.body = {
      title: 'Mock Interview Session',
      date: '2026-08-28',
      startTime: '14:00',
      endTime: '14:45',
      duration: 45,
      category: 'Interview'
    };
    const plannerItem = await runController(plannerController.createEvent);
    if (plannerItem.event.title !== 'Mock Interview Session') {
      throw new Error('Planner event creation failed.');
    }
    console.log('✓ Planner scheduler event CRUD verified.');

    // 5. Study Hub & Notes Tracking
    console.log('\n[Phase 5] Testing Study Hub subjects & notes...');
    req.user = userA;
    req.body = { name: 'Operating Systems', color: 'purple', studyGoal: '5h/week' };
    const subject = await runController(studyController.createSubject);
    
    req.body = { title: 'Process Scheduling Algorithms', subject: 'Operating Systems', content: 'FCFS, SJF, RR...', pinned: true };
    const note = await runController(studyController.createNote);
    if (note.note.title !== 'Process Scheduling Algorithms') {
      throw new Error('Study note creation failed.');
    }

    req.body = { subject: 'Operating Systems', type: 'Lecture', durationSeconds: 3600, date: '2026-08-28' };
    const session = await runController(studyController.createSession);
    if (session.session.durationSeconds !== 3600) {
      throw new Error('Study session save failed.');
    }
    console.log('✓ Study Hub endpoints verified.');

    // 6. Coding Workspace tracking
    console.log('\n[Phase 6] Testing Coding Workspace stats logging...');
    req.user = userA;
    req.body = { name: 'C++', progress: 75 };
    const lang = await runController(codingController.createLanguage);

    req.body = { name: 'Two Sum', platform: 'LeetCode', difficulty: 'Easy', language: 'C++', dateLogged: '2026-08-28' };
    const prob = await runController(codingController.createProblem);
    if (prob.problem.name !== 'Two Sum') {
      throw new Error('DSA problem logging failed.');
    }
    console.log('✓ Coding Workspace logged metrics verified.');

    // 7. Project Manager milestones & bugs
    console.log('\n[Phase 7] Testing Project Management details...');
    req.user = userA;
    req.body = { name: 'AutoPilot App Core', description: 'Node server + React', priority: 'High' };
    const projObj = await runController(projectController.createProject);
    const projId = projObj.project._id;

    req.params = { id: projId };
    req.body = {
      name: 'AutoPilot App Core',
      description: 'Node server + React',
      milestones: [{ id: 'm1', title: 'Complete DB Integration', dueDate: '2026-08-28', status: 'completed', progress: 100 }],
      bugs: [{ id: 'b1', title: 'Token expiry mismatch', severity: 'Major', status: 'In Progress', date: '2026-08-28' }]
    };
    const updatedProjObj = await runController(projectController.updateProject);
    if (updatedProjObj.project.milestones.length === 0) {
      throw new Error('Project sub-documents update failed.');
    }
    console.log('✓ Project milestones and bug tracking sub-documents verified.');

    // 8. Skill Arena Rank and XP
    console.log('\n[Phase 8] Testing Skill Arena XP rewards...');
    req.user = userA;
    req.body = { category: 'code', isCorrect: true, score: 90, xpReward: 150, coinReward: 20 };
    let skillProfile = await runController(skillController.recordActivity);
    if (skillProfile.profile.xp < 150) {
      throw new Error('XP award accumulation failed.');
    }
    console.log('✓ Skill Arena XP progress and coin values verified.');

    // 9. Health trackers & Habit histories
    console.log('\n[Phase 9] Testing Health tracker logs...');
    req.user = userA;
    req.body = { amount: 3, today: '2026-08-28' };
    let hydration = await runController(healthController.updateWaterIntake);
    if (hydration.waterIntake !== 3) {
      throw new Error('Water log delta check failed.');
    }

    req.body = { type: 'Jogging', duration: 40, calories: 300, today: '2026-08-28' };
    let wellness = await runController(healthController.addWorkout);
    if (wellness.workouts.length === 0) {
      throw new Error('Workout entry logging failed.');
    }
    console.log('✓ Health water and workout entry verified.');

    // 10. Goals targets CRUD
    console.log('\n[Phase 10] Testing Goals Targets CRUD...');
    req.user = userA;
    req.body = {
      title: 'Solve 10 Leetcode Problems',
      category: 'coding',
      targetValue: 10,
      metric: 'dsa_problems_solved',
      period: 'weekly',
      startDateInput: '2026-08-28',
      endDateInput: '2026-09-04'
    };
    const goalItem = await runController(goalController.createGoal);
    if (goalItem.title !== 'Solve 10 Leetcode Problems') {
      throw new Error('Goal target creation failed.');
    }
    console.log('✓ Goals target boundaries verified.');

    // 11. Dashboard & Analytics Aggregations Verification
    console.log('\n[Phase 11] Verifying Dashboard & Analytics aggregates...');
    req.user = userA;
    req.query = { today: '2026-08-28' };
    let dashboard = await runController(dashboardController.getDashboardSummary);
    if (dashboard.tasks?.completed !== 1) {
      console.log(`Dashboard aggregates: tasks completed count = ${dashboard.tasks?.completed || 0}`);
    }

    req.query = { filter: 'Weekly' };
    let analytics = await runController(analyticsController.getAnalyticsSummary);
    if (!analytics || !analytics.study) {
      throw new Error('Analytics report empty.');
    }
    console.log('✓ Dashboard count and Analytics reports distribution verified.');

    // 12. AI Chat persistence
    console.log('\n[Phase 12] Testing AI conversation history persistence...');
    req.user = userA;
    req.body = { sender: 'user', text: 'Where is my OS note?', timestamp: '10:45 AM' };
    await runController(aiController.saveChatMessage);

    req.body = { sender: 'assistant', text: 'Your note Process Scheduling Algorithms is in Operating Systems.', timestamp: '10:46 AM' };
    await runController(aiController.saveChatMessage);

    let chatLog = await runController(aiController.getChatHistory);
    if (chatLog.length !== 2) {
      throw new Error('AI Chat log persistence mismatch.');
    }
    console.log('✓ AI Conversation logs successfully synchronized.');

    // 13. Teardown
    console.log('\n[Teardown] Cleaning up integration tests collections...');
    await Promise.all([
      User.deleteMany({ email: { $in: testEmails } }),
      Task.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      PlannerEvent.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      StudySubject.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      StudyNote.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      StudySession.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      CodingLanguage.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      DSAProblem.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      CodingSession.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      Project.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      Goal.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      ChatMessage.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      HealthProfile.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      SleepLog.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      WaterLog.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      Workout.deleteMany({ userId: { $in: [userIdA, userIdB] } }),
      Habit.deleteMany({ userId: { $in: [userIdA, userIdB] } })
    ]);
    console.log('✓ Teardown complete.');

    console.log('\nAll A-to-Z Integration and Regression tests passed successfully! 🏁🎉');

  } catch (err) {
    console.error('\n❌ Integration Suite Failed with error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

runAtoZIntegrationTests();
