import mongoose from 'mongoose';

const studySubjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  color: {
    type: String,
    default: 'blue',
    trim: true
  },
  studyGoal: {
    type: String,
    default: '2h/week',
    trim: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  favorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for querying subjects by user
studySubjectSchema.index({ userId: 1, name: 1 });

studySubjectSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const StudySubject = mongoose.model('StudySubject', studySubjectSchema);

export default StudySubject;
