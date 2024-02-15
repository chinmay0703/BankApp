import defaultMailOptions from "../Utils/mailoptions.js";
import TransactionHistory from "../model/transactionModel.js";
import User from "../model/userModel.js";
import transporter from "../Utils/transporter.js"; // Import transporter
export const checkotppay = async (req, res) => {
    const { email, recieve, amount, otp } = req.body;
    const numericAmount = parseFloat(amount);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.verify === otp) {
            await User.findOneAndUpdate(
                { email: recieve },
                { $inc: { money: numericAmount } },
                { new: true }
            );
            const senderTransaction = new TransactionHistory({
                senderemail: email,
                receivermail: recieve,
                amount: numericAmount,
            });
            await User.findOneAndUpdate(
                { email },
                { $push: { transactions: senderTransaction } },
                { new: true }
            );
            const recipientMailOptions = {
                ...defaultMailOptions,
                to: recieve,
                subject: 'Transaction Alert',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h1 style="color: #3498db; text-align: center;">Transaction Details</h1>
                        <p style="font-size: 16px; color: #555;">Your account has been credited ${amount} rupees.</p>
                        <p style="font-size: 14px; color: #777;">Thank you for choosing our services!</p>
                    </div>
                `,
            };
            transporter.sendMail(recipientMailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Transaction Alert sent successfully to recipient");
                    console.log('Email sent: ' + info.response);
                }
            });
            await User.findOneAndUpdate(
                { email },
                { $inc: { money: -numericAmount } },
                { new: true }
            );
            const receiverTransaction = new TransactionHistory({
                senderemail: email,
                receivermail: recieve,
                amount: numericAmount,
            });
            await User.findOneAndUpdate(
                { email: recieve },
                { $push: { transactions: receiverTransaction } },
                { new: true }
            );
            const senderMailOptions = {
                ...defaultMailOptions,
                to: email,
                subject: 'Transaction Alert',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h1 style="color: #3498db; text-align: center;">Transaction Details</h1>
                        <p style="font-size: 16px; color: #555;">Your account has been debited ${amount} rupees.</p>
                        <p style="font-size: 14px; color: #777;">Thank you for choosing our services!</p>
                    </div>
                `,
            };
            transporter.sendMail(senderMailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Transaction Alert sent successfully to sender");
                    console.log('Email sent: ' + info.response);
                }
            });

            res.status(200).json({ message: 'Transaction successful' });
        } else {
            return res.status(400).json({ error: 'OTP does not match' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
