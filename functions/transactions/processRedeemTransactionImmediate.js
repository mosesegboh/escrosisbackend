const Transaction = require('../../models/Transaction')
const validation = require('../validation/validateData')
const {redeemTransaction} = require('../process')

const processRedeemTransactionImmediate = async (data, res) => {

    validation.validateData(data, res)

    let { transactionId } = data

    try{
        var transactionToRedeem = await Transaction.findOne({transactionId: transactionId})
        if (transactionToRedeem) {
            await redeemTransaction(transactionToRedeem, res);
        }
    } catch(error) {
        console.log(error);
    }
}

module.exports = {processRedeemTransactionImmediate}  