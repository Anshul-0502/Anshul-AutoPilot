import mongoose from 'mongoose';
import User from '../models/User.js';
import ChatMessage from '../models/ChatMessage.js';

// Controller handlers
import { getChatHistory, saveChatMessage, clearChatHistory } from '../controllers/aiController.js';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/anshul_autopilot';

async function runTests() {
  console.log('--- Starting Phase 19 Verification Tests ---');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Find or create test user
    let testUser = await User.findOne({ email: 'test_ai@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test AI User',
        email: 'test_ai@example.com',
        passwordHash: 'dummyhash123'
      });
      console.log('Created test user.');
    } else {
      console.log('Using existing test user.');
    }

    const userId = testUser._id;

    // Teardown
    await ChatMessage.deleteMany({ userId });

    // Res/req mocks
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

    // Test 1: Empty history check
    console.log('\n[Test 1] Fetch empty history...');
    let history = await execute(getChatHistory);
    if (!Array.isArray(history) || history.length !== 0) {
      throw new Error('Chat history should initially be empty');
    }
    console.log('✓ Checked empty history successfully.');

    // Test 2: Save user prompt
    console.log('[Test 2] Save user prompt message...');
    req.body = {
      sender: 'user',
      text: 'Open DSA page',
      timestamp: '10:45 AM'
    };
    let savedMsg = await execute(saveChatMessage);
    if (savedMsg.sender !== 'user' || savedMsg.text !== 'Open DSA page') {
      throw new Error('User message details not saved properly');
    }
    console.log('✓ User prompt message saved.');

    // Test 3: Save assistant response
    console.log('[Test 3] Save assistant response message...');
    req.body = {
      sender: 'assistant',
      text: 'Opening DSA, Boss.',
      timestamp: '10:45 AM'
    };
    let savedReply = await execute(saveChatMessage);
    if (savedReply.sender !== 'assistant' || savedReply.text !== 'Opening DSA, Boss.') {
      throw new Error('Assistant reply details not saved properly');
    }
    console.log('✓ Assistant reply message saved.');

    // Test 4: Retrieve full conversation log and assert sorting
    console.log('[Test 4] Fetch full history and check sorting...');
    req.body = {};
    let logs = await execute(getChatHistory);
    if (logs.length !== 2) {
      throw new Error(`Expected exactly 2 conversation logs, but got ${logs.length}`);
    }
    if (logs[0].sender !== 'user' || logs[1].sender !== 'assistant') {
      throw new Error('Messages returned in incorrect sorting order');
    }
    console.log('✓ History logs retrieval and sorting validated.');

    // Test 5: Clear history logs
    console.log('[Test 5] Clear conversation logs...');
    let clearRes = await execute(clearChatHistory);
    if (!clearRes.success) {
      throw new Error('Clear history returned non-success response');
    }
    let logsAfterClear = await execute(getChatHistory);
    if (logsAfterClear.length !== 0) {
      throw new Error('Logs were not deleted upon clear request');
    }
    console.log('✓ Conversation history cleared successfully.');

    // Teardown
    console.log('\n[Teardown] Cleaning up test data...');
    await ChatMessage.deleteMany({ userId });
    await User.deleteOne({ _id: userId });
    console.log('✓ Teardown complete.');

    console.log('\nAll AI Chat persistence verification tests passed successfully! 🎉');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

runTests();
