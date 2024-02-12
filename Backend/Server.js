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

const transactionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    senderemail: String,
    receivermail: String,
    amount: Number,
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    pan: String,
    address: String,
    phone: Number,
    password: String,
    accountno: String,
    money: Number,
    verify: String,
    transactions: { type: [transactionSchema], default: [] },
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
    from: '"CTC Bank" <ctcbank@gmail.com>',
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
const TransactionHistory = mongoose.model('TransactionHistory', transactionSchema);
var jwtSecretKey = process.env.JWT_SECRET_KEY;
var tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
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
            verify: 53146,
        });
        await newUser.save();
        const mailOptions = {
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

        transporter.sendMail(mailOptions, function (error, info) {
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
app.get('/getall', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

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
app.post('/verifyemail', async (req, res) => {
    const { email, recieve, amount } = req.body;
    const numericAmount = parseFloat(amount);
    if (email === recieve) {
        return res.status(400).json({ error: "Sender's and receiver's emails cannot be the same" });
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
            const randNumber = randomnumber(4);
            await User.findOneAndUpdate(
                { email },
                { verify: randNumber },
                { new: true }
            );
            mailOptions.to = email;
            mailOptions.subject = 'One Time Pawword';
            mailOptions.html = `
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
            `;
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent successfully");
                    console.log('Email sent:' + info.response);
                }
            });
        }
        res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post("/checktop", async (req, res) => {
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
                {
                    $push: {
                        transactions: senderTransaction,
                    },

                },
                { new: true }
            );
            mailOptions.to = recieve;
            mailOptions.subject = 'Transaction Alert';
            mailOptions.html = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h1 style="color: #3498db; text-align: center;">Transaction Details</h1>
                <p style="font-size: 16px; color: #555;">Your account has been credited ${amount} rupees.</p>
                <p style="font-size: 14px; color: #777;">Thank you for choosing our services!</p>
              </div>
            `;

            transporter.sendMail(mailOptions);
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
                {
                    $push: {
                        transactions: receiverTransaction,
                    },

                },
                { new: true }
            );
            mailOptions.to = email;
            mailOptions.subject = 'Transaction Alert';
            mailOptions.html = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h1 style="color: #3498db; text-align: center;">Transaction Details</h1>
                <p style="font-size: 16px; color: #555;">Your account has been debited ${amount} rupees.</p>
                <p style="font-size: 14px; color: #777;">Thank you for choosing our services!</p>
              </div>
            `;
            transporter.sendMail(mailOptions);
        } else {
            return res.status(400).json({ error: 'OTP does not match' });
        }
        res.status(200).json({ message: 'Transaction successful' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});