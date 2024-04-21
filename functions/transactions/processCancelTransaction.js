const Transaction = require('../../models/Transaction')
const validation = require('../validation/validateData')
const {cancelTransaction} = require('../process')

const processCancelTransactionImmediate = async (data, res) => {

    validation.validateData(data, res)

    let { transactionId } = data

    try{
        let transactionToCancel = await Transaction.findOne({transactionId: transactionId})
                
        if (transactionToCancel) {
            await cancelTransaction(transactionToCancel, res)
        }
    } catch(error) {
        console.log(err);
    }
}

module.exports = {processCancelTransactionImmediate}  