import { Router } from 'express'
import {workerSignupValidation ,loginValidation, doctorSignupValidation } from '../middleware/AuthValidation.js';
import {workerSignup,  verifyEmail, Login, doctorSignup } from '../controller/AuthController.js';
const userRouter = Router()

userRouter.post('/signup/worker', workerSignupValidation, workerSignup);
userRouter.post('/signup/verify-email',verifyEmail)
userRouter.post('/signup/doctor',doctorSignupValidation,doctorSignup)

userRouter.post('/login', loginValidation, Login);

export default userRouter;