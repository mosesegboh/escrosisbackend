const Transaction = require('../../models/Transaction')
const validation = require('../validation/validateData')
const {redeemTransaction} = require('../process')

const processRedeemTransactionImmediate = async (data, res) => {

    validation.validateData(data, res)

    let { transactionId } = data

    try
    {
        let transactionToRedeem = await Transaction.findOne({transactionId: transactionId})
        // console.log(transactionToRedeem, '---to redeem');
        // return
                
        if (transactionToRedeem) {
            await redeemTransaction(transactionToRedeem, res)
        }else{
            return res.json({
                status: "FAILED",
                message: "You cannot redeem this transaction!"
            })
        }
    } catch(error) {
        console.log(error);
        return res.json({
            status: "FAILED",
            message: "An error occurred!"
        })
    }
}

module.exports = {processRedeemTransactionImmediate}  