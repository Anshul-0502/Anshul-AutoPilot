import mongoose from 'mongoose';

const plannerEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  category: {
    type: String,
    default: 'other',
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  }
}, {
  timestamps: true
});

// Index to query events by user and date
plannerEventSchema.index({ userId: 1, date: 1 });

// Automatically map _id to id when returned to frontend
plannerEventSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const PlannerEvent = mongoose.model('PlannerEvent', plannerEventSchema);

export default PlannerEvent;
