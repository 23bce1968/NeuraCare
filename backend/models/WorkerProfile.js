import mongoose from "mongoose";

const workerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
      unique: true,
    },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], required: true },
    location: { type: String, required: true },
    occupation: { type: String, required: true },
    language: { type: String, required: true },
    emergencyContact: { type: String, required: true },

    // ── Consent Management ──
    consent: {
      shareWithAdmin: { type: Boolean, default: false },
      updatedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

const WorkerProfile = mongoose.model("WorkerProfile", workerProfileSchema)
export default WorkerProfile