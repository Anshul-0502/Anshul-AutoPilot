import mongoose from 'mongoose';

const skillProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  xp: {
    type: Number,
    default: 0
  },
  coins: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: String,
    default: ''
  },
  completedChallenges: {
    type: [String],
    default: []
  },
  unlockedAchievements: {
    type: [Number],
    default: [1] // 1 is unlocked by default
  },
  claimedAchievements: {
    type: [Number],
    default: []
  },
  missionsProgress: {
    type: Map,
    of: [String], // Array of completed node keys
    default: {}
  },
  stats: {
    totalGames: { type: Number, default: 0 },
    accuracy: { type: Number, default: 100 }, // Default high accuracy
    codingCompleted: { type: Number, default: 0 },
    quizzesCompleted: { type: Number, default: 0 },
    logicScore: { type: Number, default: 0 },
    reactionTime: { type: Number, default: 0 },
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

skillProfileSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const SkillProfile = mongoose.model('SkillProfile', skillProfileSchema);

export default SkillProfile;
