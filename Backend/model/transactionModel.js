
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now() },
    senderemail: String,
    receivermail: String,
    amount: Number,
});

const TransactionHistory = mongoose.model('TransactionHistory', transactionSchema);

export default TransactionHistory;
