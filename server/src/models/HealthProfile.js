import mongoose from 'mongoose';

const healthProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  waterGoal: { type: Number, default: 8 },
  sleepTime: { type: String, default: '23:00' },
  wakeTime: { type: String, default: '07:00' },
  sleepQuality: { type: Number, default: 80 },
  reminders: {
    water: { type: Boolean, default: true },
    eyeBreak: { type: Boolean, default: true },
    stretchBreak: { type: Boolean, default: false },
    sleep: { type: Boolean, default: true }
  }
}, { timestamps: true });

const HealthProfile = mongoose.model('HealthProfile', healthProfileSchema);
export default HealthProfile;
