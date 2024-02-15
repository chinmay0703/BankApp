import User from "../model/userModel.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
export const validatetoken = (async (req, res) => {
    try {
        const { token } = req.body;
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const { userid } = jwt.verify(token, jwtSecretKey);
        console.log('Decoded Token:', { userid });
        const user = await User.findById(userid);
        if (user) {
            res.json({ user });
        } else {
            console.error('User not found for userid:', userid);
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ error: 'Token verification failed' });
    }
});
