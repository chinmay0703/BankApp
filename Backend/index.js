const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { hashPassword } = require('./Hashpassword');
const randomnumber = require('./Randomnumberforaccountno')
const randomnumberonly = require('./Randomnumberforotp')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
var nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 3001;
app.use(cors(
    {
        origin: ["https://bank-app-2bf8.vercel.app"], methods: ["POST", "GET"],
        credentials: true
    }
));

const mongodbURL = process.env.MONGODB_URL;
mongoose.connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

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


const User = mongoose.model('Users', userSchema);
const TransactionHistory = mongoose.model('TransactionHistory', transactionSchema);

var jwtSecretKey = process.env.JWT_SECRET_KEY;
var tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
app.use(cors());
app.use(bodyParser.json());

// Signup
app.post('/postdata', async (req, res) => {
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

// Get all users
app.get('/', async (req, res) => {
    
    res.json("Hello");
});

// Delete all user

app.delete('/deleteallusers', async (req, res) => {
    try {
        const result = await User.deleteMany({});
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'All users deleted successfully.' });
        } else {
            res.status(404).json({ message: 'No users found to delete.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login
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

// VAlidate Token and extract the userid from token user._id
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

// Validate the sender
// Validate the reciever
// Validate the amount check if it less than 0 or 0 or the amount is present in the senders acount
//  if all this checked 4 digit otp is created and sent to the db and also to email
app.post('/verifyemail', async (req, res) => {
    const { email, recieve, amount } = req.body;
    const numericAmount = parseFloat(amount);
    console.log(numericAmount)
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

//  checked the otp matched with the db 
//  If matches Transaction will be successfull
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


app.post('/validateemail', async (req, res) => {
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
        res.status(200).json({ message: 'Verification email in progress' });
        const mailOptions = {
            to: email,
            subject: 'verification required!!! ',
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
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/checkotp", async (req, res) => {
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


app.post("/updatepass", async (req, res) => {
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





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});