import { Router } from 'express';
import Appointment from '../models/Appointment.js';
import HealthRecord from '../models/HealthRecord.js';
import DoctorModel from '../models/HCProvider.js';
import WorkerProfile from '../models/WorkerProfile.js';
import { ensureAuthenticated } from '../middleware/Auth.js';
import { limiter } from '../middleware/rateLimiter.js';

const router = Router();

// ── Helper: check if appointment time has passed ──
const hasAppointmentPassed = (appt) => {
  const apptDate = new Date(appt.date);
  if (appt.timeSlot) {
    const [time, period] = appt.timeSlot.split(" ");
    let [hours, mins] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    apptDate.setHours(hours, mins, 0, 0);
  }
  return new Date() >= apptDate;
};

/* ══════════════ WORKER ROUTES ══════════════ */

router.get('/worker/doctors',limiter, ensureAuthenticated, async (req, res) => {
  try {
    const doctors = await DoctorModel.find({ isVerified: true }).select('-password');
    res.json(doctors);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/worker/appointments',limiter, ensureAuthenticated, async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;
    const appt = await new Appointment({ workerId: req.user._id, doctorId, date, timeSlot, reason }).save();
    const populated = await appt.populate('doctorId', 'name email phone doctorId');
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/worker/appointments',limiter, ensureAuthenticated, async (req, res) => {
  try {
    const appts = await Appointment.find({ workerId: req.user._id })
      .populate('doctorId', 'name email phone doctorId')
      .sort({ date: 1 });
    res.json(appts);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.get('/worker/health-records',limiter, ensureAuthenticated, async (req, res) => {
  try {
    const records = await HealthRecord.find({ workerId: req.user._id })
      .populate('doctorId', 'name doctorId')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

/* ══════════════ DOCTOR ROUTES ══════════════ */

router.get('/doctor/appointments',limiter, ensureAuthenticated, async (req, res) => {
  try {
    const appts = await Appointment.find({ doctorId: req.user._id })
      .populate('workerId', 'name email')
      .sort({ date: 1 });

    const enriched = await Promise.all(appts.map(async (appt) => {
      const profile = await WorkerProfile.findOne({ userId: appt.workerId._id });
      return { ...appt.toObject(), workerProfile: profile };
    }));

    res.json(enriched);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// ✅ Doctor creates health record — only AFTER appointment time
router.post('/doctor/health-record',limiter, ensureAuthenticated, async (req, res) => {
  try {
    const {
      workerId, appointmentId, symptoms, diagnosis, diagnosisSeverity,
      vitals, medications, labResults, followUpDate, followUpNotes,
      notes, type, status
    } = req.body;

    // ── Validate appointment time has passed ──
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      if (!hasAppointmentPassed(appointment)) {
        return res.status(403).json({
          message: "Cannot add record before the appointment time. Please wait until the scheduled date and time."
        });
      }
    }

    const record = await new HealthRecord({
      workerId, doctorId: req.user._id, appointmentId,
      symptoms, diagnosis, diagnosisSeverity, vitals,
      medications, labResults, followUpDate, followUpNotes,
      notes, type, status,
    }).save();

    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        status: 'completed',
        healthRecordId: record._id,
      });
    }

    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/doctor/health-records',limiter, ensureAuthenticated, async (req, res) => {
  try {
    const records = await HealthRecord.find({ doctorId: req.user._id })
      .populate('workerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.patch('/doctor/appointments/:id',limiter, ensureAuthenticated, async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    ).populate('workerId', 'name email');
    res.json(appt);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

export default router;