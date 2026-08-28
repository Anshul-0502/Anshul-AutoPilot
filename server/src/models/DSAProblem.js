import mongoose from 'mongoose';

const dsaProblemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Problem name is required'],
    trim: true
  },
  platform: {
    type: String,
    default: 'LeetCode',
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'easy', 'medium', 'hard'],
    default: 'Medium'
  },
  topic: {
    type: String,
    default: 'General',
    trim: true
  },
  status: {
    type: String,
    default: 'Solved',
    trim: true
  },
  timeTaken: {
    type: String,
    default: '15 mins',
    trim: true
  },
  revisionRequired: {
    type: Boolean,
    default: false
  },
  solutionCode: {
    type: String,
    default: ''
  },
  complexityAnalysis: {
    type: String,
    default: ''
  },
  dateLogged: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

dsaProblemSchema.index({ userId: 1, dateLogged: -1 });

dsaProblemSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const DSAProblem = mongoose.model('DSAProblem', dsaProblemSchema);

export default DSAProblem;
