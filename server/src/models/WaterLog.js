import mongoose from 'mongoose';

const waterLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  intake: { type: Number, default: 0 },
  goal: { type: Number, default: 8 }
}, { timestamps: true });

waterLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const WaterLog = mongoose.model('WaterLog', waterLogSchema);
export default WaterLog;
