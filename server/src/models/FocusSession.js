import mongoose from 'mongoose';

const focusSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Pomodoro', 'Short Break', 'Long Break', 'Deep Work', 'Mindfulness', 'Meditation'],
    default: 'Pomodoro'
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  date: {
    type: String,
    required: true
  },
  rewardProcessed: {
    type: Boolean,
    default: false
  },
  xpAwarded: {
    type: Number,
    default: 0
  },
  coinsAwarded: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

focusSessionSchema.index({ userId: 1, createdAt: -1 });

focusSessionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const FocusSession = mongoose.model('FocusSession', focusSessionSchema);

export default FocusSession;
