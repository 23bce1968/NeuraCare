import { Router } from "express";
import { ensureAuthenticated } from "../middleware/Auth.js";
import WorkerProfile from "../models/WorkerProfile.js";
import { limiter } from "../middleware/rateLimiter.js";

const router = Router();

const getUserId = (req) => req.user._id || req.user.id;


router.get("/profile",limiter, ensureAuthenticated, async (req, res) => {
  try {
    const profile = await WorkerProfile.findOne({ userId: getUserId(req) });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/profile",limiter, ensureAuthenticated, async (req, res) => {
  try {
    const userId = getUserId(req);
    const exists = await WorkerProfile.findOne({ userId });
    if (exists) return res.status(400).json({ message: "Profile already exists" });

    const { age, gender, bloodGroup, location, occupation, language, emergencyContact } = req.body;
    const profile = new WorkerProfile({
      userId, age, gender, bloodGroup, location, occupation, language, emergencyContact,
    });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/profile",limiter, ensureAuthenticated, async (req, res) => {
  try {
    const profile = await WorkerProfile.findOneAndUpdate(
      { userId: getUserId(req) }, req.body, { new: true }
    );
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.patch("/consent",limiter, ensureAuthenticated, async (req, res) => {
  try {
    const { shareWithAdmin } = req.body;
    const profile = await WorkerProfile.findOneAndUpdate(
      { userId: getUserId(req) },
      {
        "consent.shareWithAdmin": shareWithAdmin,
        "consent.updatedAt": new Date(),
      },
      { new: true }
    );
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json({ consent: profile.consent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/consent",limiter, ensureAuthenticated, async (req, res) => {
  try {
    const profile = await WorkerProfile.findOne({ userId: getUserId(req) });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json({ consent: profile.consent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;