const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceFeeSchema = new Schema({
    transacitonType: String,
    email: String,
    amount: Number,
    reference: String,
    currency: String,
    balance: Number,
    transactionDate: Date,
})

const ServiceFee = mongoose.model('ServiceFee', ServiceFeeSchema)

module.exports =ServiceFee;
