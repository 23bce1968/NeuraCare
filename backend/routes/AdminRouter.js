import express from "express";
import {
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
} from "../controller/AdminController.js";
import { ensureAuthenticated } from "../middleware/Auth.js";


const router = express.Router();

router.get("/pending-doctors", ensureAuthenticated, getPendingDoctors);
router.put("/approve/:id", ensureAuthenticated, approveDoctor);
router.delete("/reject/:id", ensureAuthenticated, rejectDoctor);

export default router;