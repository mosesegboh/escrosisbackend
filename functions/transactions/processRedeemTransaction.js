const Transaction = require('../../models/Transaction')
const validation = require('../validation/validateData')
const {redeemTransaction} = require('../process')

const processRedeemTransaction = async (data, res) => {

    validation.validateData(data, res)

    let { transactionId } = data

    try
    {
        let transactionToRedeem = await Transaction.find({transactionId: transactionId})
                
        if (transactionToRedeem) {
            await redeemTransaction(transactionToRedeem, res)
        }else{
            return res.json({
                status: "FAILED",
                message: "You cannot redeem this transaction!"
            })
        }
    } catch(error) {
        console.log(err);
        return res.json({
            status: "FAILED",
            message: "An error occurred!"
        })
    }
}

module.exports = {processRedeemTransactionImmediate}  