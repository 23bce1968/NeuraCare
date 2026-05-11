import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS,
  },
})

export default transporter