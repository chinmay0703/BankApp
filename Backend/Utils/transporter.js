
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "chinya2103@gmail.com",
        pass: "aholwnnxmhbhubdx",
    },
});
export default transporter;
