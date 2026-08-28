import mongoose from 'mongoose';

const meditationSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

const MeditationSession = mongoose.model('MeditationSession', meditationSessionSchema);
export default MeditationSession;
