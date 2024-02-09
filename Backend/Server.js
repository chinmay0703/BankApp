const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt'); 
// const crypto = require('crypto');
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



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "chinya2103@gmail.com",
        pass: "aholwnnxmhbhubdx",
    },
});

const mailOptions = {
    from: '"CTC Bank" <chinya2103@gmail.com>',
    subject: "Congratulations on creating new Account",
    to:" ",
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
        const accountno = randomnumber(10);
        const newUser = new User({
            name,
            email,
            pan,
            address,
            phone,
            password,
            accountno,
            money,
        });
        await newUser.save();
        // mailOptions.to = newUser.email;
        // mailOptions.text = `Hello ${name},your account has been created!`;
        // mailOptions.html = `<b>Hello ${name},</b><br>Your account has been created! `;

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



app.put('/updatedata/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const updatedData = req.body;
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ error: 'Invalid contactId format' });
        }
        const updatedContact = await Contact.findByIdAndUpdate(contactId, updatedData, { new: true });
        if (updatedContact) {
            res.json({ message: 'Contact updated successfully', updatedContact });

        } else {
            res.status(404).json({ error: 'Contact not found' });
        }
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/getcontacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getbyid', async (req, res) => {
    try {
        const id = req.query.id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid or missing ID parameter' });
        }
        const data = await Contact.findById(id);

        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error('Error fetching data by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/deletecontact/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        console.log("contact of the id ", contactId, "is deleted");
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ error: 'Invalid contactId format' });
        }
        const deletedContact = await Contact.findOneAndDelete({ _id: contactId });
        if (deletedContact) {
            res.json({ message: 'Contact deleted successfully' });
        } else {
            res.status(404).json({ error: 'Contact not found' });
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});