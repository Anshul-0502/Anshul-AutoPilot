import mongoose from 'mongoose';
import User from '../models/User.js';
import Task from '../models/Task.js';

// Controller handlers
import { getTasks } from '../controllers/taskController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/anshul_autopilot';

async function runTests() {
  console.log('--- Starting Phase 22 Security Hardening Verification Tests ---');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // 1. Create User A and User B
    console.log('\n[Test 1] Creating test users User A and User B...');
    await User.deleteMany({ email: { $in: ['usera@example.com', 'userb@example.com'] } });
    
    const userA = await User.create({
      name: 'User A',
      email: 'usera@example.com',
      passwordHash: 'hashedpassword_a'
    });

    const userB = await User.create({
      name: 'User B',
      email: 'userb@example.com',
      passwordHash: 'hashedpassword_b'
    });
    console.log('✓ Test users created.');

    const req = {
      user: userA,
      body: {},
      params: {}
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
      
      for (let i = 0; i < 40; i++) {
        if (res.jsonData || caughtError) break;
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      if (caughtError) throw caughtError;
      return res.jsonData?.data || res.jsonData;
    };

    // 2. Assert passwordHash select: false policy
    console.log('\n[Test 2] Verifying passwordHash select: false default exclusions...');
    const queryUser = await User.findOne({ email: 'usera@example.com' });
    if (queryUser.passwordHash) {
      throw new Error('Security Violation: passwordHash was returned in default query results!');
    }
    console.log('✓ passwordHash successfully excluded by default.');

    // 3. Verify cross-user isolation boundaries
    console.log('\n[Test 3] Verifying cross-user data isolation boundaries...');
    
    // User A creates a task
    const taskA = await Task.create({
      userId: userA._id,
      title: "User A's Secret Task",
      category: 'General',
      priority: 'high',
      completed: false,
      status: 'todo'
    });
    console.log(`User A created task: "${taskA.title}" (${taskA._id})`);

    // Let User B run getTasks list query
    req.user = userB;
    let listRes = await execute(getTasks);
    
    const userBTasks = listRes.tasks || [];
    const sawUserATask = userBTasks.some(t => t._id.toString() === taskA._id.toString());
    if (sawUserATask) {
      throw new Error('Security Violation: User B retrieved User A\'s private tasks list!');
    }
    console.log('✓ User B tasks list queries successfully isolated.');

    // 4. Rate Limiter Middleware checks
    console.log('\n[Test 4] Verifying Rate Limiter middleware thresholds...');
    const limiter = rateLimiter({ windowMs: 1000, max: 2, keyPrefix: 'test-limiter' });
    const reqLim = { ip: '127.0.0.9' };
    const resLim = {
      statusCode: 200,
      jsonData: null,
      status(c) { this.statusCode = c; return this; },
      json(d) { this.jsonData = d; return this; }
    };

    let nextCalled = 0;
    const nextFn = () => { nextCalled++; };

    // Request 1
    limiter(reqLim, resLim, nextFn);
    // Request 2
    limiter(reqLim, resLim, nextFn);
    // Request 3 (should fail with HTTP 429)
    limiter(reqLim, resLim, nextFn);

    if (resLim.statusCode !== 429) {
      throw new Error(`Rate Limiter failed: expected HTTP 429, got HTTP ${resLim.statusCode}`);
    }
    console.log('✓ Rate limiter successfully blocked rapid requests with HTTP 429.');

    // Clean up
    console.log('\n[Teardown] Cleaning up security test collections...');
    await User.deleteMany({ email: { $in: ['usera@example.com', 'userb@example.com'] } });
    await Task.deleteMany({ userId: userA._id });
    console.log('✓ Cleanup complete.');

    console.log('\nAll security hardening verification tests passed successfully! 🛡️');

  } catch (error) {
    console.error('❌ Security verification failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

runTests();
