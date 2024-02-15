import User from "../model/userModel.js";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
dotenv.config();
export const login = (async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    try {
        const users = await User.find();
        for (const user of users) {
            var emailFound = false;
            if (user.email === email) {
                console.log("email found");
                emailFound = true;
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    let data = {
                        time: Date(),
                        userid: user._id
                    };
                    var jwtSecretKey = process.env.JWT_SECRET_KEY;
                    const token = jwt.sign(data, jwtSecretKey);
                    console.log("Password matched")
                    console.log("Token Generated")
                    return res.json({ token });
                } else {
                    console.log("Not Matched yet")
                    return res.status(401).json({ error: 'Incorrect password' });
                }
            }
        }
        return res.status(404).json({ error: 'Email not found' });
    } catch (error) {
        console.error('Error fetching all users or comparing passwords:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

