import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import userRouter from './routes/AuthRouter.js'
import adminRouter from "./routes/AdminRouter.js";
import workerRoutes from "./routes/WorkerRouter.js"
import appointmentRouter from "./routes/AppointmentRouter.js";

dotenv.config()
const app = express()

app.use(bodyParser.json());
app.use(express.json())
app.use(cors())
app.use("/", appointmentRouter);
app.use("/auth", userRouter);
app.use("/admin", adminRouter);
app.use("/worker", workerRoutes);

mongoose.connect(process.env.DBURL).then(()=>{
    console.log("Databse connected");
    app.listen(process.env.PORT || 8080,()=>{
        console.log("Server is running");

    })
}).catch((err)=>{
    console.log("error");
})