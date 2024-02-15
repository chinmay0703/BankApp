import { hashPassword } from "../functions/hashpass.js";
import User from "../model/userModel.js";
export const updatepass=(async (req, res) => {
    const { password, email } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: { password: hashedPassword } },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});