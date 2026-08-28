import mongoose from 'mongoose';

const studyRevisionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  interval: {
    type: String,
    default: 'Weekly',
    trim: true
  },
  dueDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'overdue'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

studyRevisionSchema.index({ userId: 1, dueDate: 1 });

studyRevisionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const StudyRevision = mongoose.model('StudyRevision', studyRevisionSchema);

export default StudyRevision;
