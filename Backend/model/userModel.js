// userModel.js
import mongoose from 'mongoose';
import TransactionHistory from './transactionModel.js';

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
    transactions: { type: [TransactionHistory.schema], default: [] }, 
});

const User = mongoose.model('Users', userSchema);

export default User;
