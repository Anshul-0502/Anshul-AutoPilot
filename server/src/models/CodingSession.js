import mongoose from 'mongoose';

const codingSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: [true, 'Session type is required'],
    trim: true
  },
  durationMinutes: {
    type: Number,
    required: [true, 'Session duration is required'],
    min: 1
  },
  date: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

codingSessionSchema.index({ userId: 1, createdAt: -1 });

codingSessionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const CodingSession = mongoose.model('CodingSession', codingSessionSchema);

export default CodingSession;
