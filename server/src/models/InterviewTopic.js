import mongoose from 'mongoose';

const interviewTopicSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Topic title is required'],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

interviewTopicSchema.index({ userId: 1, category: 1 });

interviewTopicSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const InterviewTopic = mongoose.model('InterviewTopic', interviewTopicSchema);

export default InterviewTopic;
