import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'worker', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  symptoms: [{ type: String }],
  diagnosis: { type: String },
  diagnosisSeverity: { type: String, enum: ['mild', 'moderate', 'severe', 'critical'] },
  vitals: {
    temperature: { type: Number },
    bp: { type: String },
    pulse: { type: Number },
    spo2: { type: Number },
    weight: { type: Number },
    height: { type: Number },
    bmi: { type: Number },
  },
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
  }],
  labResults: [{
    testName: String,
    result: String,
    normalRange: String,
    isAbnormal: { type: Boolean, default: false },
  }],
  followUpDate: { type: Date },
  followUpNotes: { type: String },
  notes: { type: String },
  type: { type: String, enum: ['self-report', 'hospital', 'teleconsult', 'emergency'], default: 'hospital' },
  status: { type: String, enum: ['active', 'recovered', 'ongoing', 'referred'], default: 'active' },
}, { timestamps: true });

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);
export default HealthRecord;