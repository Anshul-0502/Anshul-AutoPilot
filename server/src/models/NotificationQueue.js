import mongoose from 'mongoose';

const notificationQueueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['study', 'coding', 'health', 'task', 'system', 'info'],
    default: 'info'
  },
  scheduledFor: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  error: {
    type: String
  },
  sentAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to quickly find pending items scheduled in the past
notificationQueueSchema.index({ status: 1, scheduledFor: 1 });
notificationQueueSchema.index({ userId: 1 });

notificationQueueSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const NotificationQueue = mongoose.model('NotificationQueue', notificationQueueSchema);

export default NotificationQueue;
