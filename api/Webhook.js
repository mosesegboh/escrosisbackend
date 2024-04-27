const express = require('express')
const router = express.Router()
const Transaction = require('./../models/Transaction')
const {updateParticularCurrencyBalances} = require('../functions/process/index.js')
const {success,failed} = require('../services/email/templates/transferTemplate')
const {sendEmailFunction} = require('../services/email/functions/sendEmailFunctionExport')

router.post('/feedback', (req, res) => {
    // If you specified a secret hash, check for the signature
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];
    if (!signature || (signature !== secretHash)) {
        // This request isn't from Flutterwave; discard
        res.status(401).end();
    }
   console.log(req.body, 'this is the request body')
   const response = req.body
   const transactionId = response.txRef
   const status = response.status
   const eventType = response['event.type']
    //console.log(response, '---this is web hook---')
    setTimeout(function() {
        Transaction.findOne({ transactionId: transactionId })
        .then(transaction => {
            if (transaction && (transaction.status !== "complete" || transaction.status !== "successful")) {
                if (eventType == 'CARD_TRANSACTION' || status == "successful") {
                    transaction.status = "successful";
                    transaction.balance = +transaction.balance + +transaction.amount
                    if ( transaction.balanceForAdditionalCurrencies 
                        && transaction.balanceForAdditionalCurrencies.length > 0 
                        && transaction.balanceForAdditionalCurrencies[0] !== 0) {
                        console.log('i got inside here')
                        transaction.balanceForAdditionalCurrencies = updateParticularCurrencyBalances(+transaction.amount, process.env.DEFAULT_CURRENCY, transaction.balanceForAdditionalCurrencies)
                    }
                }

                if (response.event == 'transfer.completed') {
                    transaction.status = "successful";
                    transaction.balance = +transaction.balance - +transaction.amount
                    sendEmailFunction(transaction, res, "successful", success)

                    if ( transaction.balanceForAdditionalCurrencies 
                        && transaction.balanceForAdditionalCurrencies.length > 0 
                        && transaction.balanceForAdditionalCurrencies[0] !== 0) {
                        console.log('i got inside here')
                        transaction.balanceForAdditionalCurrencies = updateParticularCurrencyBalances(+transaction.amount, process.env.DEFAULT_CURRENCY, transaction.balanceForAdditionalCurrencies)
                    }
                }else{
                    transaction.status = "failed";
                    //send transaction failed email
                    sendEmailFunction(transaction, res, "failed", failed)

                }
                return transaction.save();
            } else {
                throw new Error("Transaction not found")
            }

        })
        .catch(error => {
            console.log(error)
        })
    }, 5000);  
     // It's a good idea to log all received events.
     console.log(payload);
     // Do something (that doesn't take too long) with the payload 
    res.status(200).end()
})

module.exports = router