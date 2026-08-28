import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  type: {
    type: String,
    default: 'Practice',
    trim: true
  },
  durationSeconds: {
    type: Number,
    required: [true, 'Duration is required']
  },
  durationText: {
    type: String,
    default: '0.0h'
  },
  date: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

studySessionSchema.index({ userId: 1, createdAt: -1 });

studySessionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const StudySession = mongoose.model('StudySession', studySessionSchema);

export default StudySession;
