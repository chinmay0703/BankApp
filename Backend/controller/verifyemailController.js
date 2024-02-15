import defaultMailOptions from "../Utils/mailoptions.js";
import User from "../model/userModel.js";
import transporter from "../Utils/transporter.js";
import randomnumberonly from "../functions/randomnumberforotp.js";

export const verifyemail = async (req, res) => {
    const { email, recieve, amount } = req.body;
    const numericAmount = parseFloat(amount);
    console.log(numericAmount);
    if (email === recieve) {
        return res.status(400).json({ error: "You can't send money to your own account. Please choose a different recipient." });
    }
    if (numericAmount < 0) {
        return res.status(400).json({ error: "Please Enter Valid Amount" });
    }
    if (numericAmount === 0) {
        return res.status(400).json({ error: "Enter Valid Amount" });
    }
    try {
        const sender = await User.findOne({ email });
        if (!sender) {
            return res.status(404).json({ error: "Sender not found" });
        }
        if (sender.money < numericAmount) {
            return res.status(400).json({ error: "Not enough money to send" });
        }
        if (sender.money === 0) {
            return res.status(400).json({ error: "Enter valid Amount" });
        }
        const receiver = await User.findOne({ email: recieve });
        if (!receiver) {
            return res.status(404).json({ error: "Receiver not found" });
        } else {
            const randNumber = randomnumberonly(4);
            await User.findOneAndUpdate(
                { email },
                { verify: randNumber },
                { new: true }
            );
            res.status(200).json({ message: 'User found. Verification process initiated' });
            const mailOptions = {
                ...defaultMailOptions,
                to: email,
                subject: 'One time Password!!!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #ccc; border-radius: 10px;">
                        <p style="font-size: 16px; margin-bottom: 20px;">Hello, this is your OTP for verification </p>
                        <div style="display: flex; justify-content: space-between; align-items: center; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
                    
                            <!-- Use a loop to generate boxed style for each letter in OTP -->
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
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
