const mongoose = require('mongoose');

const { Schema } = mongoose;

const SubscriptionSchema = new Schema(
  {
    planType: {
      type: String,
      enum: ['free', 'premium'],
      required: true,
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      required: true,
      default: 'inactive',
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    renewalDate: {
      type: Date,
      validate: {
        validator(value) {
          return !value || value >= this.startDate;
        },
        message: 'renewalDate must be equal to or after subscription startDate.',
      },
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
      default: 'monthly',
    },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 254,
      match: [/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/, 'Please enter a valid email address.'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      required: true,
      default: 'user',
    },
    subscription: {
      type: SubscriptionSchema,
      required: true,
      default: () => ({}),
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: 1 });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
