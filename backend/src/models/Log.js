const mongoose = require('mongoose');

const { Schema } = mongoose;

const LogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'comment'],
      required: true,
    },
    entityType: {
      type: String,
      enum: ['user', 'project', 'task', 'subscription'],
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    changes: {
      type: Schema.Types.Mixed,
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

LogSchema.index({ userId: 1 });
LogSchema.index({ entityType: 1, entityId: 1 });
LogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.models.Log || mongoose.model('Log', LogSchema);
