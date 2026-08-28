import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  calories: { type: Number, default: 0 },
  status: { type: String, default: 'Completed' },
  notes: { type: String, default: '' },
  date: { type: String, required: true }
}, { timestamps: true });

const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;
