import express from "express";
import {
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  getAiInsights,
  getApprovedDoctors,
} from "../controller/AdminController.js";
import { ensureAuthenticated } from "../middleware/Auth.js";
import { limiter } from "../middleware/rateLimiter.js";


const router = express.Router();

router.get("/pending-doctors",limiter, ensureAuthenticated, getPendingDoctors);
router.get("/approved-doctors",limiter, ensureAuthenticated, getApprovedDoctors);
router.put("/approve/:id",limiter, ensureAuthenticated, approveDoctor);
router.delete("/reject/:id",limiter, ensureAuthenticated, rejectDoctor);
router.get("/getInsights",limiter,  ensureAuthenticated, getAiInsights);

export default router;