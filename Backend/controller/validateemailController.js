
import defaultMailOptions from "../Utils/mailoptions.js";
import User from "../model/userModel.js";
import transporter from "../Utils/transporter.js"; 
import randomnumberonly from "../functions/randomnumberforotp.js";
export const validateemail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const randNumber = randomnumberonly(4);

        await User.findOneAndUpdate(
            { email },
            { verify: randNumber },
            { new: true }
        );

        const mailOptions = {
            ...defaultMailOptions, 
            to: email,
            subject: 'Verification required!!!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #ccc; border-radius: 10px;">
                    <p style="font-size: 16px; margin-bottom: 20px;">Hello, this is your OTP for verification </p>
                    <div style="display: flex; justify-content: space-between; align-items: center; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
                        ${randNumber.split('').map(letter => `
                            <div style="width: 30px; height: 30px; border: 1px solid #ccc; text-align: center; line-height: 30px; font-size: 18px; border-radius: 5px;">
                                ${letter}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email send error:', error);
                return res.status(500).json({ error: 'Error sending email' });
            }

            console.log('Email sent successfully:', info.response);
            res.status(200).json({ message: 'Verification email sent successfully' });
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
