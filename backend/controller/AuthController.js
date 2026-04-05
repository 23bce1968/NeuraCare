import WorkerModel from '../models/Worker.js';
import DoctorModel from "../models/HCProvider.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendVerificationCode from '../middleware/Email.js';


export const workerSignup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUser = await WorkerModel.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({ message: "User already exists" });
    }
    if (existingUser && !existingUser.isVerified) {
      await WorkerModel.deleteOne({ email });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const workerModel = new WorkerModel({
      name, email, phone,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false,
      role,
    });

    await workerModel.save();
    await sendVerificationCode(email, verificationCode);

    return res.status(201).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await WorkerModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up again." });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified. Please login." });
    }
    if (user.verificationCodeExpiry && new Date() > user.verificationCodeExpiry) {
      await WorkerModel.deleteOne({ email });
      return res.status(410).json({ message: "OTP expired. Please sign up again." });
    }
    if (user.verificationCode !== verificationCode) {
      return res.status(403).json({ message: "Invalid OTP. Please try again." });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully! You can now login." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const doctorSignup = async (req, res) => {
  try {
    const { name, email, phone, doctorId, password, role } = req.body;

    const existing = await DoctorModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await DoctorModel.create({
      name, email, phone, doctorId,
      password: hashedPassword,
      role,
      isVerified: false,
    });

    return res.status(201).json({ message: "Signup successful. Waiting for admin approval." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    if (email === "admin@gmail.com" && password === "admin@1234") {
      const jwtToken = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.status(200).json({
        success: true,
        message: "Login successful",
        jwtToken,
        Email: email,
        name: "admin",
        isVerified: true,
        role: "admin",
      });
    }

    
    let user = await WorkerModel.findOne({ email });
    let userType = "worker";

    if (!user) {
      user = await DoctorModel.findOne({ email });
      userType = "doctor";
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      const msg = userType === "doctor"
        ? "Your account is pending admin approval."
        : "Email not verified. Please sign up again.";
      return res.status(403).json({ message: msg });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const jwtToken = jwt.sign(
      { _id: user._id, id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      jwtToken,
      Email: user.email,
      name: user.name,
      isVerified: user.isVerified,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};