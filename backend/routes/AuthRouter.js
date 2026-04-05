import { Router } from 'express'
import {workerSignupValidation ,loginValidation, doctorSignupValidation } from '../middleware/AuthValidation.js';
import {workerSignup,  verifyEmail, Login, doctorSignup } from '../controller/AuthController.js';
import { limiter } from '../middleware/rateLimiter.js';
const userRouter = Router()

userRouter.post('/signup/worker', limiter, workerSignupValidation, workerSignup);
userRouter.post('/signup/verify-email',limiter,verifyEmail)
userRouter.post('/signup/doctor',limiter, doctorSignupValidation,doctorSignup)

userRouter.post('/login',limiter, loginValidation, Login);

export default userRouter;