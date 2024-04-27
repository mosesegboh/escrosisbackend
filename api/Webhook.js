const express = require('express')
const router = express.Router()
const Transaction = require('./../models/Transaction')
const {updateParticularCurrencyBalances} = require('../functions/process/index.js')
const transferTemplate = require('../services/email/templates/transferTemplate')
const {sendEmailFunction} = require('../services/email/functions/sendEmailFunctionExport')
const {log} = require('../functions/process/index.js')

router.post('/feedback', (req, res) => {
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];
    if (!signature || (signature !== secretHash)) {
        res.status(401).end();
    }
   console.log(req.body, '-----this is the request body')
   const response = req.body
   const transactionId = response.txRef
   const status = response.status
   const eventType = response['event.type']
   const transferTransactionIdId = response.transfer.reference
    // console.log(response.transfer.status, '---this is web hook---')
    // return
    setTimeout(function() {
        Transaction.findOne({ 
            transactionId : eventType == 'Transfer' ? transferTransactionIdId 
            : transactionId
        })
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

                if (eventType == 'Transfer') {
                    if (response.transfer.status == 'SUCCESSFUL') {
                        transaction.status = "complete";
                        transaction.balance = +transaction.balance - +transaction.amount
                        sendEmailFunction(transaction, res, "success", transferTemplate)
    
                        if ( transaction.balanceForAdditionalCurrencies 
                            && transaction.balanceForAdditionalCurrencies.length > 0 
                            && transaction.balanceForAdditionalCurrencies[0] !== 0) {
                            // console.log('i got inside here')
                            transaction.balanceForAdditionalCurrencies = updateParticularCurrencyBalances(+transaction.amount, process.env.DEFAULT_CURRENCY, transaction.balanceForAdditionalCurrencies)
                        }
                    }else{
                        transaction.status = "failed";
                        //send transaction failed email
                        sendEmailFunction(transaction, res, "failed", transferTemplate)
    
                    }
                    transaction.save();
                }
 
            } else {
                // throw new Error("Transaction not found")
                console.log("Transaction not found or transaction already completed !!!")
            }

        })
        .catch(error => {
            console.log(error)
        })
    }, 5000);  
     // It's a good idea to log all received events.
     log(response);
     // Do something (that doesn't take too long) with the payload 
    res.status(200).end()
})

module.exports = router