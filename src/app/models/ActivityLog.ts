import mongoose, { Document, Schema, Model } from "mongoose";

export interface IActivityLog extends Document {
  lead: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  action: string;
  details: string;
  timestamp: Date;
}

const ActivityLogSchema: Schema<IActivityLog> = new Schema(
  {
    lead: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: [true, "Lead ID is required"],
      index: true, // Index for fast querying by lead
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    action: {
      type: String,
      required: [true, "Action is required"],
      // Actions: "CREATED", "ASSIGNED", "STATUS_UPDATED", "NOTE_ADDED", "CONTACTED"
    },
    details: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Automatically set the timestamp on creation
ActivityLogSchema.pre("save", function () {
  if (!this.timestamp) {
    this.timestamp = new Date();
  }
});

export const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);