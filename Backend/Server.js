const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

const jwt = require('jsonwebtoken');
dotenv.config();
var nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

const port = 3001;
mongoose.connect('mongodb+srv://chinmay:LIP54dqmq0o0dODS@contact.cjo104s.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    pan: String,
    address: String,
    phone: String,
    password: String,
    accountno: String,
    money: String,
});

const workFactor = 10;

const hashPassword = async (password) => {
    console.log(password)
    try {
        const salt = await bcrypt.genSalt(workFactor);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw new Error("Hashing failed");
    }
};
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "chinya2103@gmail.com",
        pass: "aholwnnxmhbhubdx",
    },
});

const mailOptions = {
    from: '"CTC Bank" <chinya2103@gmail.com>',
    subject: "Account Creation Notification",
    to: " ",
    text: "Hello signup successfully"
};

function randomnumber(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
const User = mongoose.model('Users', userSchema);

app.use(cors());
app.use(bodyParser.json());
app.post('/postdata', async (req, res) => {
    try {
        const { name, email, pan, address, phone, password, money } = req.body;
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
        });
        await newUser.save();
        // mailOptions.to = newUser.email;
        // mailOptions.text = `Hello ${name},your account has been created!`;
        // mailOptions.html = `<b>Hello ${name},</b><br>Your account has been created  `;

        // transporter.sendMail(mailOptions, function (error, info) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log("Email sent successfully");
        //         console.log('Email sent:'+ info.response);
        //     }
        // });
        res.status(200).json({ message: 'User data successfully saved to MongoDB!' });

    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/getall', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

var jwtSecretKey = process.env.JWT_SECRET_KEY;
var tokenHeaderKey = process.env.TOKEN_HEADER_KEY;

app.post('/auntheticatelogin', async (req, res) => {
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
app.post("/validateToken", async (req, res) => {
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



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});