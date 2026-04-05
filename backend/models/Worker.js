import mongoose from "mongoose";

const workerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        
    },
    phone:{
        type:Number,
        required:true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationCodeExpiry: {
        type: Date,
    },
    verificationCode:{
        type:String
    },
    role:{
        type:String
    }

},{timestamps:true})

const WorkerModel = mongoose.model("worker", workerSchema);
export default WorkerModel;