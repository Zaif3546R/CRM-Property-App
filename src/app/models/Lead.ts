import mongoose, { Document, Schema, Model } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  propertyInterest: string;
  budget: number;
  status: "New" | "Contacted" | "In Progress" | "Closed" | "Lost";
  notes: string;
  assignedTo: mongoose.Types.ObjectId | null;
  score: "High" | "Medium" | "Low";
  followUpDate?: Date;
  createdAt: Date;
}

const LeadSchema: Schema<ILead> = new Schema(
  {
    name: { type: String, required: [true, "Lead name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: { type: String, required: [true, "Phone number is required"], trim: true },
    propertyInterest: { type: String, required: [true, "Property interest is required"] },
    budget: { type: Number, required: [true, "Budget is required"], min: 0 },
    status: {
      type: String,
      enum: ["New", "Contacted", "In Progress", "Closed", "Lost"],
      default: "New",
    },
    notes: { type: String, default: "" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    score: { type: String, enum: ["High", "Medium", "Low"] },
    followUpDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// Rule-based scoring middleware
LeadSchema.pre("save", function () {
  if (this.isNew || this.isModified("budget")) {
    if (this.budget > 20000000) {
      this.score = "High";
    } else if (this.budget >= 10000000 && this.budget <= 20000000) {
      this.score = "Medium";
    } else {
      this.score = "Low";
    }
  }
});

export const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);