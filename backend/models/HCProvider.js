import mongoose from 'mongoose'

const doctorSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        
    },
    phone:{
        type:Number,
        required:true
    },
    doctorId: {                
        type: String,
        required:true,
        unique:true
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role:{
        type:String
    }
},{timestamps:true})

const DoctorModel = mongoose.model('doctor',doctorSchema)
export default DoctorModel 