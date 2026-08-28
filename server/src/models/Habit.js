import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: { type: mongoose.Schema.Types.Mixed, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  streak: { type: Number, default: 0 },
  history: {
    type: Map,
    of: Boolean,
    default: {}
  }
}, { timestamps: true });

habitSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.id || (ret._id ? ret._id.toString() : '');
    // Convert history Map to standard plain JS Object on JSON serialization for frontend compatibility
    if (ret.history instanceof Map) {
      ret.history = Object.fromEntries(ret.history);
    }
    return ret;
  }
});

const Habit = mongoose.model('Habit', habitSchema);
export default Habit;
