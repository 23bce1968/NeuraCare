import WorkerModel from '../models/Worker.js';
import DoctorModel from "../models/HCProvider.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendVerificationCode from '../middleware/Email.js';

export const workerSignup = async (req,res) => { 
    console.log(req.body);
    try {
        const {name,email,phone,password,role} = req.body;
        const verificationCode= Math.floor(100000 + Math.random() * 900000).toString()

        const user = await WorkerModel.findOne({email});
        if(user){
            return res.status(409).json({message:"User already exists"});
        }
        let workerModel = new WorkerModel({name,email,phone,password,verificationCode,role});
        workerModel.password = await bcrypt.hash(password,10);

        workerModel.save()
        sendVerificationCode(email,verificationCode)
        return res.status(201).json({message:"signup success"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
export const Login = async (req,res) => {
    try {
        const {email, password} = req.body;
        const doctor = await DoctorModel.findOne({email});
        const worker = await WorkerModel.findOne({email});
        if(!worker && !doctor){
            if(email==="admin@gmail.com" && password==="admin@1234"){
                const jwtToken = jwt.sign(
                    {email:email},
                    process.env.JWT_SECRET,
                    {expiresIn:'24h'}
                )
                return res.status(201).json({message:"Login successful",success:true,jwtToken,Email:email,name:"admin",isVerified:true,role:"admin"})
            }
            else{
                return res.status(401).json({message:"Authentication failed, either email or password is incorrect"})

            }
        }
        else if(worker){
            const isPassEqual = await bcrypt.compare(password, worker.password);
            if(!isPassEqual){
                return res.status(401).json({message:"Authentication failed, either email or password is incorrect"})
            }
            const jwtToken = jwt.sign(
                {email:worker.email,_id:worker._id},
                process.env.JWT_SECRET,
                {expiresIn:'24h'}
        
            )        
            return res.status(201).json({message:"Login successful",success:true,jwtToken,userEmail:email,name:worker.name,isVerified:worker.isVerified,role:worker.role})
        }
        else if(doctor){
            const isPassEqual = await bcrypt.compare(password,doctor.password);
            if(!isPassEqual){
                return res.status(401).json({message:"Authentication failed, either email or password is incorrect"})
            }
            const jwtToken = jwt.sign(
                {email:doctor.email,_id:doctor._id},
                process.env.JWT_SECRET,
                {expiresIn:'24h'}
            )
            return res.status(201).json({message:"Login successful",success:true,jwtToken,Email:email,name:doctor.name,isVerified:doctor.isVerified,role:doctor.role})
        }
    } catch (error) {
        return res.status(500).json({message:"internal server error"})
    }
    
}

export const verifyEmail = async (req,res) => {
    const {email,verificationCode} = req.body;
    const user = await WorkerModel.findOne({email})
    if(user.verificationCode===verificationCode){
        let response = await WorkerModel.updateOne({email},{$set:{isVerified:true}})
        console.log(response)
        return res.status(200).json({message:"success"})
    }
    else{
        return res.status(403).json({message:"Failed to verify"})
    }

}


export const doctorSignup = async (req, res) => {
    try {
        const { name, email, phone, doctorId, password, role } = req.body;

        const existing = await DoctorModel.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Doctor already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await DoctorModel.create({
            name,
            email,
            phone,
            doctorId,
            password: hashedPassword,
            role,
            isVerified: false   // 🔥 pending
        });

        // 🔥 Optional: send email to admin
        // sendAdminNotification()

        return res.status(201).json({
            message: "Signup successful. Waiting for admin approval."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};