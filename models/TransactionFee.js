const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionFeeSchema = new Schema({
    transacitonType: String,
    email: String,
    amount: Number,
    reference: String,
    currency: String,
    balance: Number,
    transactionDate: Date,
})

const TransactionFee = mongoose.model('TransactionFee', TransactionFeeSchema)

module.exports = TransactionFee;
