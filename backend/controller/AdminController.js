import DoctorModel from "../models/HCProvider.js";

/* 🔥 Get all pending doctors */
export const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({ isVerified: false });
    return res.json(doctors);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching doctors" });
  }
};

/* 🔥 Approve doctor */
export const approveDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    await DoctorModel.findByIdAndUpdate(id, {
      isVerified: true,
    });

    res.json({ message: "Doctor approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error approving doctor" });
  }
};

/* 🔥 Reject doctor */
export const rejectDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    await DoctorModel.findByIdAndDelete(id);

    res.json({ message: "Doctor rejected" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting doctor" });
  }
};