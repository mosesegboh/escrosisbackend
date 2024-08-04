const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionApiLogSchema = new Schema({
    transactionDate: {
      type: Date,
      required: false
    },
    reference: {
        type: String,
        required: false
    },
    log: {
      type: Object,
      required: false
    }
  }, { timestamps: true });

const TransactionApiLog = mongoose.model('TransactionApiLog', TransactionApiLogSchema)

module.exports = TransactionApiLog;
