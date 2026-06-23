const mongoose = require('mongoose');

const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed'],
      required: true,
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
      default: 'medium',
    },
    dueDate: {
      type: Date,
      validate: {
        validator(value) {
          return !value || value instanceof Date;
        },
        message: 'dueDate must be a valid date.',
      },
    },
    tags: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 50,
        },
      ],
      default: [],
      validate: {
        validator(tags) {
          return tags.length <= 20;
        },
        message: 'A task may include at most 20 tags.',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

TaskSchema.index({ projectId: 1 });
TaskSchema.index({ projectId: 1, status: 1 });
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ createdAt: 1 });

module.exports = mongoose.models.Task || mongoose.model('Task', TaskSchema);
