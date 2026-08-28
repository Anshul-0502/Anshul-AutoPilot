import mongoose from 'mongoose';

const dataMigrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  importedCounts: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const DataMigration = mongoose.model('DataMigration', dataMigrationSchema);

export default DataMigration;
