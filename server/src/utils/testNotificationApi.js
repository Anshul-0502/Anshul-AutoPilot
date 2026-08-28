import mongoose from 'mongoose';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import AlertRegister from '../models/AlertRegister.js';
import NotificationQueue from '../models/NotificationQueue.js';
import { processQueueInternal } from '../controllers/notificationController.js';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/anshul_autopilot';

async function runTests() {
  console.log('--- Starting Phase 15 Verification Tests ---');
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Find or create a test user
    let testUser = await User.findOne({ email: 'test_notification@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test Notification User',
        email: 'test_notification@example.com',
        passwordHash: 'dummyhash123'
      });
      console.log('Created test user.');
    } else {
      console.log('Using existing test user.');
    }

    const userId = testUser._id;

    // Clean up any old test data for this user
    await Notification.deleteMany({ userId });
    await AlertRegister.deleteMany({ userId });
    await NotificationQueue.deleteMany({ userId });

    // ==========================================
    // Test 1: Notifications CRUD
    // ==========================================
    console.log('\n[Test 1] Notifications CRUD...');
    const notif1 = await Notification.create({
      userId,
      title: 'Test Notification 1',
      message: 'This is a test notification 1',
      type: 'study'
    });

    const notif2 = await Notification.create({
      userId,
      title: 'Test Notification 2',
      message: 'This is a test notification 2',
      type: 'coding'
    });

    const list = await Notification.find({ userId });
    if (list.length !== 2) throw new Error(`Expected 2 notifications, got ${list.length}`);
    console.log('✓ Successfully created and retrieved notifications.');

    // Test mark as read
    notif1.read = true;
    await notif1.save();
    const updatedNotif = await Notification.findById(notif1._id);
    if (!updatedNotif.read) throw new Error('Expected notification to be marked as read');
    console.log('✓ Successfully marked notification as read.');

    // Test clear all
    await Notification.deleteMany({ userId });
    const clearedList = await Notification.find({ userId });
    if (clearedList.length !== 0) throw new Error(`Expected 0 notifications, got ${clearedList.length}`);
    console.log('✓ Successfully cleared notifications.');

    // ==========================================
    // Test 2: Alert Registers Seeding and Toggling
    // ==========================================
    console.log('\n[Test 2] Alert Registers Seeding and Toggling...');
    
    // Seed default alerts
    const defaultAlerts = [
      { label: 'Water Hydration Alarm', time: 'Every 2 Hours', enabled: true, type: 'water' },
      { label: 'Revision Study Session Alert', time: '10 Mins Before Slot', enabled: true, type: 'study' },
      { label: 'Habit Recap Checklist', time: 'Daily, 9:00 PM', enabled: false, type: 'habit' },
      { label: 'Screen Rest Eye Exercises', time: 'Every 1 Hour', enabled: false, type: 'eye' }
    ];
    await AlertRegister.insertMany(defaultAlerts.map(d => ({ ...d, userId })));

    const alerts = await AlertRegister.find({ userId });
    if (alerts.length !== 4) throw new Error(`Expected 4 seeded alerts, got ${alerts.length}`);
    console.log('✓ Successfully seeded default alerts.');

    // Toggle one alert
    const targetAlert = alerts.find(a => a.type === 'habit');
    targetAlert.enabled = true;
    await targetAlert.save();

    const checkedAlert = await AlertRegister.findById(targetAlert._id);
    if (!checkedAlert.enabled) throw new Error('Expected alert to be enabled');
    console.log('✓ Successfully toggled alert register.');

    // ==========================================
    // Test 3: Notifications Queue Scheduling & Processing
    // ==========================================
    console.log('\n[Test 3] Queue Scheduling & Processing...');
    
    // Schedule one for the past (should process)
    const pastTime = new Date(Date.now() - 60000); // 1 minute ago
    await NotificationQueue.create({
      userId,
      title: 'Queued Test Past',
      message: 'This should be processed',
      type: 'task',
      scheduledFor: pastTime
    });

    // Schedule one for the future (should NOT process yet)
    const futureTime = new Date(Date.now() + 3600000); // 1 hour from now
    await NotificationQueue.create({
      userId,
      title: 'Queued Test Future',
      message: 'This should not be processed yet',
      type: 'study',
      scheduledFor: futureTime
    });

    const queuedAll = await NotificationQueue.find({ userId });
    if (queuedAll.length !== 2) throw new Error(`Expected 2 queued alerts, got ${queuedAll.length}`);
    console.log('✓ Successfully scheduled background notifications.');

    // Run queue processing
    const processResult = await processQueueInternal();
    console.log(`Queue run results: processedCount = ${processResult.processedCount}`);

    // Check sent status in queue
    const queuePast = await NotificationQueue.findOne({ userId, title: 'Queued Test Past' });
    if (queuePast.status !== 'sent') throw new Error(`Expected past job status to be 'sent', got '${queuePast.status}'`);
    
    const queueFuture = await NotificationQueue.findOne({ userId, title: 'Queued Test Future' });
    if (queueFuture.status !== 'pending') throw new Error(`Expected future job status to be 'pending', got '${queueFuture.status}'`);

    // Check that a real notification was generated for the past one
    const userNotifications = await Notification.find({ userId });
    if (userNotifications.length !== 1) throw new Error(`Expected 1 notification generated, got ${userNotifications.length}`);
    if (userNotifications[0].title !== 'Queued Test Past') throw new Error(`Unexpected notification title: '${userNotifications[0].title}'`);
    console.log('✓ Successfully verified queue worker execution and status transitions.');

    // ==========================================
    // Teardown
    // ==========================================
    console.log('\n[Teardown] Cleaning up test data...');
    await Notification.deleteMany({ userId });
    await AlertRegister.deleteMany({ userId });
    await NotificationQueue.deleteMany({ userId });
    await User.deleteOne({ _id: userId });
    console.log('✓ Teardown complete.');
    console.log('\nAll verification tests passed successfully! 🎉');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

runTests();
