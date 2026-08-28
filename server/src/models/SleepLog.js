import mongoose from 'mongoose';

const sleepLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: { type: mongoose.Schema.Types.Mixed, required: true },
  date: { type: String, required: true },
  day: { type: String, required: true },
  hours: { type: Number, required: true }
}, { timestamps: true });

const SleepLog = mongoose.model('SleepLog', sleepLogSchema);
export default SleepLog;
