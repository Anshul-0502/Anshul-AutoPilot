import mongoose from 'mongoose';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import UserPreferences from '../models/UserPreferences.js';

// Controller handlers
import { getProfile, updateProfile, getPreferences, updatePreferences } from '../controllers/userController.js';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/anshul_autopilot';

async function runTests() {
  console.log('--- Starting Phase 18 Verification Tests ---');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Find or create test user
    let testUser = await User.findOne({ email: 'test_preferences@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test Pref User',
        email: 'test_preferences@example.com',
        passwordHash: 'dummyhash123'
      });
      console.log('Created test user.');
    } else {
      console.log('Using existing test user.');
    }

    const userId = testUser._id;

    // Teardown
    await UserProfile.deleteMany({ userId });
    await UserPreferences.deleteMany({ userId });

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
      return res.jsonData.data;
    };

    // Test 1: Get Profile (auto-creation check)
    console.log('\n[Test 1] Fetch Profile...');
    let profileData = await execute(getProfile);
    if (!profileData.profile || profileData.profile.fullName !== 'Test Pref User') {
      throw new Error('Incorrect auto-created profile full name');
    }
    console.log('✓ Profile auto-creation validated.');

    // Test 2: Update Profile details
    console.log('[Test 2] Update Profile...');
    req.body = { bio: 'DTU student studying algorithms.', college: 'DTU' };
    profileData = await execute(updateProfile);
    if (profileData.profile.bio !== 'DTU student studying algorithms.' || profileData.profile.college !== 'DTU') {
      throw new Error('Profile updates did not persist');
    }
    console.log('✓ Profile updates validated.');

    // Test 3: Get Preferences (auto-creation check)
    console.log('[Test 3] Fetch Preferences...');
    req.body = {};
    let prefData = await execute(getPreferences);
    if (!prefData.preferences || prefData.preferences.appearance.theme !== 'Dark') {
      throw new Error('Incorrect default preference theme value');
    }
    console.log('✓ Preferences auto-creation validated.');

    // Test 4: Update partial nested Preference properties
    console.log('[Test 4] Partial Nesting Update Preference...');
    // We update only appearance.accentColor, and assert theme is NOT cleared
    req.body = {
      appearance: { accentColor: 'emerald' }
    };
    prefData = await execute(updatePreferences);
    if (prefData.preferences.appearance.accentColor !== 'emerald') {
      throw new Error('Preferences accentColor did not persist');
    }
    if (prefData.preferences.appearance.theme !== 'Dark') {
      throw new Error('Partial update cleared non-specified nested field theme');
    }
    console.log('✓ Partial nesting preferences validation passed.');

    // Teardown
    console.log('\n[Teardown] Cleaning up test data...');
    await UserProfile.deleteMany({ userId });
    await UserPreferences.deleteMany({ userId });
    await User.deleteOne({ _id: userId });
    console.log('✓ Teardown complete.');

    console.log('\nAll Preferences and profile settings verification tests passed successfully! 🎉');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

runTests();
