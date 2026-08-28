import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
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
  desc: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['study', 'coding', 'health', 'task', 'system', 'info'],
    default: 'info'
  },
  read: {
    type: Boolean,
    default: false
  },
  date: {
    type: String
  }
}, {
  timestamps: true
});

notificationSchema.index({ userId: 1, createdAt: -1 });

// Ensure id virtual property matches _id, and desc is a fallback alias for message
notificationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    if (ret.message && !ret.desc) ret.desc = ret.message;
    if (ret.desc && !ret.message) ret.message = ret.desc;
    return ret;
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
