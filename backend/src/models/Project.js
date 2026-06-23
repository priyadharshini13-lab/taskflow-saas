const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProjectMemberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'editor', 'viewer'],
      required: true,
      default: 'viewer',
    },
    joinedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: {
      type: [ProjectMemberSchema],
      default: [],
      validate: {
        validator(members) {
          return members.length <= 100;
        },
        message: 'A project may have at most 100 members.',
      },
    },
    archived: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ProjectSchema.index({ ownerId: 1 });
ProjectSchema.index({ ownerId: 1, archived: 1 });
ProjectSchema.index({ 'members.userId': 1 });
ProjectSchema.index({ createdAt: 1 });

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
