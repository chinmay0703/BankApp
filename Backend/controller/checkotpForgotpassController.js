import User from "../model/userModel.js";

export const forgotpassotp=(async (req, res) => {
    const { otp, email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user.verify === otp) {
            res.status(200).json({ message: "OTP matched" });
        } else {
            res.status(400).json({ error: "OTP does not matched" });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});