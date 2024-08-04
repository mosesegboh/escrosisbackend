const express = require('express')
const router = express.Router()
const Transaction = require('./../models/Transaction')
const {updateParticularCurrencyBalances, collectFeesAndUpdateParticularCurrencyBalances} = require('../functions/process/index.js')
const transferTemplate = require('../services/email/templates/transferTemplate')
const billPaymentTemplate = require('../services/email/templates/billPaymentTemplate')
const addFundsToWalletTemplate = require('../services/email/templates/walletTemplate')
const {sendEmailFunction} = require('../services/email/functions/sendEmailFunctionExport')
const {log} = require('../functions/process/index.js')

// router.post('/feedback', (req, res) => {
//     const secretHash = process.env.FLW_SECRET_HASH;
//     const signature = req.headers["verif-hash"];
//     if (!signature || (signature !== secretHash)) {
//         res.status(401).end();
//     }
//    console.log(req.body, '-----this is the request body')
//    const response = req.body
//    const transactionId = response.txRef
//    const status = response.status
//    const eventType = response['event.type']
// //    const transferTransactionId = response.transfer.reference  ?? null
//     const transferTransactionId = response?.transfer?.reference ?? null;
// //    console.log(transferTransactionId)
// //    return
//    const billPaymentTransactionId = response.data.customer_reference ?? null
//    const event = response.event

//    var transactionIdUsed = eventType == 'Transfer' ? transferTransactionId :
//             eventType == 'SingleBillPayment' ? billPaymentTransactionId :
//             transactionId
// //    console.log(eventType)
// //    return
//    log(response);
//     // console.log(response.transfer.status, '---this is web hook---')
//     // return
//     // {
//     //     event: 'singlebillpayment.status',
//     //     'event.type': 'SingleBillPayment',
//     //     data: { status: 'fail', message: 'Insufficient funds in your wallet' }
//     // }
//     setTimeout(function() {
//         Transaction.findOne({
//             transactionId : transactionIdUsed
//         })
//         .then(async (transaction) => {
//             if (transaction && (transaction.status !== "complete" || transaction.status !== "successful")) {
//                 if (eventType == 'CARD_TRANSACTION' || status == "successful") {
//                     transaction.status = "successful";
//                     transaction.balance = +transaction.balance + +transaction.amount
//                     if ( transaction.balanceForAdditionalCurrencies
//                         && transaction.balanceForAdditionalCurrencies.length > 0
//                         && transaction.balanceForAdditionalCurrencies[0] !== 0) {
//                         console.log('i got inside here')
//                         // transaction.balanceForAdditionalCurrencies = updateParticularCurrencyBalances(+transaction.amount, process.env.DEFAULT_CURRENCY, transaction.balanceForAdditionalCurrencies)
//                         transaction.balanceForAdditionalCurrencies = await updateParticularCurrencyBalances(transaction.amount, transaction.transactionCurrency, transaction.balanceForAdditionalCurrencies, 'add')
//                     }
//                 }

//                 if (eventType == 'SingleBillPayment' || event == 'singlebillpayment.status') {
//                     // console.log('here oooo')
//                     // return
//                     if (response.data.status == "success") {
//                         transaction.status = "success";
//                         transaction.balance = +transaction.balance - +transaction.amount
//                         if ( transaction.balanceForAdditionalCurrencies
//                             && transaction.balanceForAdditionalCurrencies.length > 0
//                             && transaction.balanceForAdditionalCurrencies[0] !== 0) {
//                                 // console.log('i am inside here')
//                                 // return
//                             // log('i got inside here')
//                             // transaction.balanceForAdditionalCurrencies = updateParticularCurrencyBalances(+transaction.amount, process.env.DEFAULT_CURRENCY, transaction.balanceForAdditionalCurrencies)
//                             transaction.balanceForAdditionalCurrencies = await updateParticularCurrencyBalances(transaction.amount, transaction.transactionCurrency, transaction.balanceForAdditionalCurrencies, 'subtract')
//                         }
//                         sendEmailFunction(transaction, res, "success", billPaymentTemplate)
//                     } else {
//                         //I can try thesame bill payment again before failing
//                         transaction.status = "failed";
//                         sendEmailFunction(transaction, res, "failed", billPaymentTemplate)
//                     }
//                     // transaction.save();
//                 }

//                 if (eventType == 'Transfer') {
//                     if (response.transfer.status == 'SUCCESSFUL') {
//                         transaction.status = "complete";
//                         transaction.balance = +transaction.balance - +transaction.amount
//                         sendEmailFunction(transaction, res, "success", transferTemplate)

//                         if ( transaction.balanceForAdditionalCurrencies
//                             && transaction.balanceForAdditionalCurrencies.length > 0
//                             && transaction.balanceForAdditionalCurrencies[0] !== 0) {
//                             // console.log('i got inside here')
//                             // transaction.balanceForAdditionalCurrencies = updateParticularCurrencyBalances(+transaction.amount, process.env.DEFAULT_CURRENCY, transaction.balanceForAdditionalCurrencies)
//                             transaction.balanceForAdditionalCurrencies = await updateParticularCurrencyBalances(transaction.amount, transaction.transactionCurrency, transaction.balanceForAdditionalCurrencies, 'subtract')
//                         }
//                     }else{
//                         //i can try again before failing
//                         transaction.status = "failed";
//                         sendEmailFunction(transaction, res, "failed", transferTemplate)
//                     }
//                     // transaction.save();
//                 }
//                 transaction.save();
//             } else {
//                 // throw new Error("Transaction not found")
//                 console.log("Transaction not found or transaction already completed !!!")
//             }

//         })
//         .catch(error => {
//             console.log(error)
//         })
//     }, 0);
//      // It's a good idea to log all received events.
//      log(response);
//      // Do something (that doesn't take too long) with the payload
//     res.status(200).end()
// })

router.post('/feedback', (req, res) => {
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];
    // if (!signature || (signature !== secretHash)) {
    //     return res.status(401).end();
    // }

    console.log(req.body, '-----this is the request body')
    const response = req.body
    const transactionId = response.txRef
    const status = response.status
    const eventType = response['event.type']
    const transferTransactionId = response?.transfer?.reference ?? null;
    const billPaymentTransactionId = response?.data?.customer_reference ?? null
    const event = response.event
    const transactionIdUsed = eventType === 'Transfer' ? transferTransactionId :
            eventType === 'SingleBillPayment' ? billPaymentTransactionId :
            eventType === 'CARD_TRANSACTION' ? transactionId :
            transactionId

    log(response);

    setTimeout(async function() {
        try {
            const transaction = await Transaction.findOne({ transactionId: transactionIdUsed });
            if (transaction && (transaction.status !== "complete" && transaction.status !== "successful")) {
                if (eventType === 'CARD_TRANSACTION' || eventType === 'MOBILEMONEYGH_TRANSACTION') {
                    if (response.status === "successful") {
                        transaction.status = "complete";
                        transaction.balance = +transaction.balance + +transaction.amount
                        if (transaction.balanceForAdditionalCurrencies
                            && transaction.balanceForAdditionalCurrencies.length > 0
                            && transaction.balanceForAdditionalCurrencies[0] !== 0) {
                            var updatedTransaction = await collectFeesAndUpdateParticularCurrencyBalances(transaction) 
                            // console.log(updatedTransaction, '---transaction less fees')
                            // return
                            // transaction.balanceForAdditionalCurrencies = await updateParticularCurrencyBalances(transaction.amount, transaction.transactionCurrency, transactionLessFees.balanceForAdditionalCurrencies, 'add')
                        }
                        sendEmailFunction(transaction, res, "success", addFundsToWalletTemplate)
                    } else {
                        transaction.status = "failed";
                        sendEmailFunction(transaction, res, "failed", addFundsToWalletTemplate)
                    }
                }

                if (eventType === 'SingleBillPayment' || event === 'singlebillpayment.status') {
                    if (response.data.status === "success") {
                        transaction.status = "complete";
                        transaction.balance = +transaction.balance - +transaction.amount
                        if (transaction.balanceForAdditionalCurrencies
                            && transaction.balanceForAdditionalCurrencies.length > 0
                            && transaction.balanceForAdditionalCurrencies[0] !== 0) {
                            var updatedTransaction = await collectFeesAndUpdateParticularCurrencyBalances(transaction) 
                            // transaction.balanceForAdditionalCurrencies = await updateParticularCurrencyBalances(transaction.amountDeductedFromSelectedCurrencyBalance, transaction.transactionCurrency, transaction.balanceForAdditionalCurrencies, 'subtract')
                        }
                        sendEmailFunction(transaction, res, "success", billPaymentTemplate)
                    } else {
                        transaction.status = "failed";
                        sendEmailFunction(transaction, res, "failed", billPaymentTemplate)
                    }
                }

                if (eventType === 'Transfer') {
                    if (response.transfer.status === 'SUCCESSFUL') {
                        transaction.status = "complete";
                        transaction.balance = +transaction.balance - +transaction.amount
                        sendEmailFunction(transaction, res, "success", transferTemplate)

                        if (transaction.balanceForAdditionalCurrencies
                            && transaction.balanceForAdditionalCurrencies.length > 0
                            && transaction.balanceForAdditionalCurrencies[0] !== 0) {
                            transaction.balanceForAdditionalCurrencies = await updateParticularCurrencyBalances(transaction.amountDeductedFromSelectedCurrencyBalance, transaction.transactionCurrency, transaction.balanceForAdditionalCurrencies, 'subtract')
                        }
                    } else {
                        transaction.status = "failed";
                        sendEmailFunction(transaction, res, "failed", transferTemplate)
                    }
                }
                // console.log(transaction, '--this is transaction')
                // return
                await updatedTransaction.save()
                // await transaction.save();
            } else {
                console.log("Transaction not found or transaction already completed !!!")
                log("Transaction not found or transaction already completed !!!")
            }
        } catch (error) {
            console.log(error)
        }
    }, 2000);

    // log(response);
    res.status(200).end()
})

module.exports = router
