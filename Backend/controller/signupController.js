import transporter from "../Utils/transporter.js";
import { hashPassword } from "../functions/hashpass.js";
import { randomnumber } from "../functions/randomnumberforaccount.js";
import User from "../model/userModel.js";
import defaultMailOptions from "../Utils/mailoptions.js";

export const signup =( async (req, res) => {
    try {
        const { name, email, pan, address, phone, password, money } = req.body;
        console.log(email);
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(402).json({ error: 'Enter a valid email, please' });
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            console.log("Email found");
            return res.status(400).json({ error: 'Email already exists' });
        }
        const accountno = randomnumber(10);
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            name,
            email,
            pan,
            address,
            phone,
            password: hashedPassword,
            accountno,
            money,
            verify: 53146,
        });
        await newUser.save();
        const updatedMailOptions = {
            ...defaultMailOptions,
            to: newUser.email,
            subject: 'Welcome to CTC Bank',
            text: `Dear ${name},\n\nGreetings! We are thrilled to welcome you to our exclusive platform. Your account has been successfully created, and you are now part of a community committed to excellence.`,
            html: `
                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                    <b>Dear ${name},</b>
                </p>
                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                    Greetings! We are thrilled to welcome you to our exclusive platform. Your account has been successfully created, and you are now part of a community committed to excellence.
                </p>
                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                    Best regards,
                    <br>
                    CTC BANK
                </p>
            `,
        };

        transporter.sendMail(updatedMailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent successfully");
                console.log('Email sent:' + info.response);
            }
        });
        res.status(200).json({ message: 'User data successfully saved to MongoDB!' });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


