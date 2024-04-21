const express = require('express')
const router = express.Router()
const Transaction = require('./../models/Transaction')
const {updateParticularCurrencyBalances} = require('../functions/process/index.js');

router.post('/feedback', (req, res) => {
   console.log(req.body, 'this is the request body')
   const response = req.body
   const transactionId = response.txRef
   const status = response.status
   const eventType = response['event.type']
    //console.log(response, '---this is web hook---')
    setTimeout(function() {
        Transaction.findOne({ transactionId: transactionId })
        .then(transaction => {
            if (transaction) {
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
                    if ( transaction.balanceForAdditionalCurrencies 
                        && transaction.balanceForAdditionalCurrencies.length > 0 
                        && transaction.balanceForAdditionalCurrencies[0] !== 0) {
                        console.log('i got inside here')
                        transaction.balanceForAdditionalCurrencies = updateParticularCurrencyBalances(+transaction.amount, process.env.DEFAULT_CURRENCY, transaction.balanceForAdditionalCurrencies)
                    }
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
})

module.exports = router