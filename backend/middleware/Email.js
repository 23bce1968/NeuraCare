import transporter from './Email.Config.js'
import { Verification_Email_Template } from './EmailTemplate.js'
import dotenv from 'dotenv'

dotenv.config()
const sendVerificationCode = async (email, verificationCode) => {
    
    try {
        const response = await transporter.sendMail({
            from: '"Frontend Lead" <shrivastavaadityaraj2005@gmail.com>',
            to: email,
            subject: "OTP",
            text: "Verify your email",
            html: Verification_Email_Template.replace("{verificationCode}", verificationCode),
        })

        console.log("Email Sent", response)
    } catch (error) {
        console.log("Email error", error)
    }
}

export default sendVerificationCode