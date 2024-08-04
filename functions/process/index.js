const Transaction = require('../../models/Transaction')
const ServiceFee = require('../../models/ServiceFee')
const TransactionFee = require('../../models/TransactionFee')
const FlutterwaveFee = require('../../models/FlutterwaveFee')
const TransactionApiLog = require('../../models/TransactionApiLog')
const {sendEmailFunction} = require('../../services/email/functions/sendEmailFunctionExport')
const walletTemplate = require('../../services/email/templates/walletTemplate')
const billPaymentTemplate = require('../../services/email/templates/billPaymentTemplate')
const firstLegEscrowTemplate = require('../../services/email/templates/firstLegEscrowTemplate')
const secondLegEscrowTemplate = require('../../services/email/templates/secondLegEscrowTemplate')
const paymentTemplate = require('../../services/email/templates/paymentTemplate')
const cancelTransactionTemplate = require('../../services/email/templates/cancelledTransactionTemplate')
const redeemTransactionTemplate = require('../../services/email/templates/redeemTransactionTemplate')
const transferTemplate = require('../../services/email/templates/transferTemplate')
const fs = require('fs');
const path = require('path');

const defaultCurrency = [
    {
        country: 'AT',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'BE',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'BG',
        balance: 0,
        currencyShortCode: 'BGN',
        currencySymbol: 'лв'
    },
    {
        country: 'HR',
        balance: 0,
        currencyShortCode: 'HRK',
        currencySymbol: 'kn'
    },
    {
        country: 'CY',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'CZ',
        balance: 0,
        currencyShortCode: 'CZK',
        currencySymbol: 'Kč'
    },
    {
        country: 'DK',
        balance: 0,
        currencyShortCode: 'DKK',
        currencySymbol: 'kr'
    },
    {
        country: 'EE',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'FI',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'FR',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'DE',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'GR',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'HU',
        balance: 0,
        currencyShortCode: 'HUF',
        currencySymbol: 'Ft'
    },
    {
        country: 'IS',
        balance: 0,
        currencyShortCode: 'ISK',
        currencySymbol: 'kr'
    },
    {
        country: 'IE',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'IT',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'LV',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'LI',
        balance: 0,
        currencyShortCode: 'CHF',
        currencySymbol: 'CHF'
    },
    {
        country: 'LT',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'LU',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'MT',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'MC',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'NL',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'NO',
        balance: 0,
        currencyShortCode: 'NOK',
        currencySymbol: 'kr'
    },
    {
        country: 'PL',
        balance: 0,
        currencyShortCode: 'PLN',
        currencySymbol: 'zł'
    },
    {
        country: 'PT',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'RO',
        balance: 0,
        currencyShortCode: 'RON',
        currencySymbol: 'lei'
    },
    {
        country: 'SM',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'SK',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'SI',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'ES',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'SE',
        balance: 0,
        currencyShortCode: 'SEK',
        currencySymbol: 'kr'
    },
    {
        country: 'CH',
        balance: 0,
        currencyShortCode: 'CHF',
        currencySymbol: 'CHF'
    },
    {
        country: 'GB',
        balance: 0,
        currencyShortCode: 'GBP',
        currencySymbol: '£'
    },
    {
        country: 'AD',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'VA',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'ME',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€'
    },
    {
        country: 'GH',
        balance: 0,
        currencyShortCode: 'GHS',
        currencySymbol: '₵'
    },
    {
        country: 'KE',
        balance: 0,
        currencyShortCode: 'KES',
        currencySymbol: 'KSh'
    },
    {
        country: 'NG',
        balance: 0,
        currencyShortCode: 'NGN',
        currencySymbol: '₦'
    },
    {
        country: 'SL',
        balance: 0,
        currencyShortCode: 'SLL',
        currencySymbol: 'Le'
    },
    {
        country: 'TZ',
        balance: 0,
        currencyShortCode: 'TZS',
        currencySymbol: 'TSh'
    },
    {
        country: 'UG',
        balance: 0,
        currencyShortCode: 'UGX',
        currencySymbol: 'USh'
    },
    {
        country: 'US',
        balance: 0,
        currencyShortCode: 'USD',
        currencySymbol: '$'
    },
    {
        country: 'CM',
        balance: 0,
        currencyShortCode: 'XAF',
        currencySymbol: 'FCFA'
    },
    {
        country: 'TD',
        balance: 0,
        currencyShortCode: 'XAF',
        currencySymbol: 'FCFA'
    },
    {
        country: 'CD',
        balance: 0,
        currencyShortCode: 'CDF',
        currencySymbol: 'FC'
    },
    {
        country: 'GA',
        balance: 0,
        currencyShortCode: 'XAF',
        currencySymbol: 'FCFA'
    },
    {
        country: 'BJ',
        balance: 0,
        currencyShortCode: 'XOF',
        currencySymbol: 'CFA'
    },
    {
        country: 'CI',
        balance: 0,
        currencyShortCode: 'XOF',
        currencySymbol: 'CFA'
    },
    {
        country: 'SN',
        balance: 0,
        currencyShortCode: 'XOF',
        currencySymbol: 'CFA'
    },
    {
        country: 'ZA',
        balance: 0,
        currencyShortCode: 'ZAR',
        currencySymbol: 'R'
    }
]

// const getCurrentUserDetails = async ({email, amount, transactFromWallet, transactionType },
//     sortOrder=-1, limit=2, getBy={email: email}, res = "") => {
//     var condition = {}
//     if (Object.keys(getBy).length > 0) {
//         var condition = {};
//         Object.keys(getBy).forEach((key) => {
//             const value = getBy[key];
//             condition[key] = value;
//             // const conditionKey = `Transaction.${key}`;
//             // condition[conditionKey] = value;
//         });
//     } else if (Object.keys(getBy).length === 0) {
//         var condition = {}
//     }
//     // console.log(condition);
//     const userDetails = await Transaction.find(condition)
//     .sort({_id: sortOrder}).limit(limit)
//     .then((transaction)=>{
//         if (transaction) {
//             // console.log(transaction, '--transaction')
//             var currentlockedTransactionBalance = (transaction.length > 1 && transaction[1].lockedTransaction)
//             ? transaction[1].lockedTransaction : (limit == 1 && transaction[0] && transaction[0].lockedTransaction)
//             ? transaction[0].lockedTransaction : 0.00
//             var currentUnlockedTransactionBalance = (transaction.length > 1 && transaction[1].unLockedTransaction )
//             ?  transaction[1].unLockedTransaction : (limit == 1 && transaction[0] && transaction[0].unLockedTransaction)
//             ? transaction[0].unLockedTransaction : 0.00
//             var currentBalance = (transaction.length > 1 && transaction[1].balance)
//             ? transaction[1].balance : (limit == 1 && transaction[0])
//             ? transaction[0].balance : 0.00
//             var userBalanceForAdditionalCurrencies = (transaction.length > 1 && transaction[1].balanceForAdditionalCurrencies)
//             ? transaction[1].balanceForAdditionalCurrencies : (limit == 1 && transaction[0] && transaction[0].balanceForAdditionalCurrencies.length !== 0 )
//             ? transaction[0].balanceForAdditionalCurrencies : defaultCurrency /* (new Transaction()).balanceForAdditionalCurrencies */ /* Formerly 0.00 */
//             var userCurrentTransactionCurrency = (transaction.length > 1 && transaction[1].transactionCurrency)
//             ? transaction[1].transactionCurrency : (limit == 1 && transaction[0])
//             ? transaction[0].transactionCurrency : null

//             if ( amount > currentBalance && transactFromWallet == "yes" && transactionType !== "SecondLeg") {
//                 return res.json({
//                     status: "FAILED",
//                     message: "You do not have sufficient funds to complete your transaction"
//                 })
//             }
//             // console.log(userBalanceForAdditionalCurrencies, currentlockedTransactionBalance, currentUnlockedTransactionBalance, currentBalance, '-----tihs')
//             // return
//             const userDetailsObject = {
//                 currentlockedTransactionBalance: currentlockedTransactionBalance,
//                 currentUnlockedTransactionBalance: currentUnlockedTransactionBalance,
//                 currentBalance: currentBalance,
//                 balanceForAdditionalCurrencies: userBalanceForAdditionalCurrencies,
//                 userCurrentTransactionCurrency: userCurrentTransactionCurrency
//             }
//             // console.log(userDetailsObject.balanceForAdditionalCurrencies, '---user detail object')
//             // return
//             return userDetailsObject;
//         }else{
//             return res.json({
//                 status: "FAILED",
//                 message: "Client data not found"
//             })
//         }
//     }).catch(err => {
//         console.log(err, '--an error occured')
//     })
//     return userDetails
// }
const saveTransaction = async (filter = {}, update, data, res = {}, directSave = "", multi = undefined) => {
    if (data.transactionName === "escrow" && data.status === "locked") {
        return res.json({
            status: "FAILED",
            message: "Transaction is already locked"
        })
    }
    // console.log(multi, '----transaction')
    if (multi !== undefined) {
        try {
            // console.log(multi.firstKey, 'i am inside here')
            var transaction = await Transaction.findOne({ transactionId: multi.firstKey })
            // console.log(transaction, '----transaction')
            // return
            transaction.unLockedTransaction = +transaction.unLockedTransaction - +transaction.amount
            transaction.lockedTransaction = +transaction.unLockedTransaction + +transaction.amount
            transaction.status = "locked"
            transaction.secondLegTransactionId = data.transactionId
            // console.log(transaction)
            // return
            transaction.save();
            // return
        } catch (error) {
            console.log(error)
        }
    }
    // console.log(directSave)
    if (directSave === "directsave") {
        const newTransaction = new Transaction(update)
        newTransaction.save()
        .then(result => {
            if (result) {
                // console.log(result, '--result')
                // return
                // var status = "success";
                var status = result.transactionType == "transfer" || result.transactionType == "billPayment" ? "pending" : "success";

                const templates = {
                    "wallet": walletTemplate,
                    "billPayment": billPaymentTemplate,
                    "FirstLeg": firstLegEscrowTemplate,
                    "SecondLeg": secondLegEscrowTemplate,
                    "receivepayments": paymentTemplate,
                    "transfer": transferTemplate
                };

                let relevantTemplate = templates[result.transactionName] || templates[result.transactionType] || '';
                
                //correct dont sent the email just yet
                if (result.transactionType !== "wallet" || result.transactionType !== "billPayment") {
                    sendEmailFunction(result, res, status, relevantTemplate)
                }

                

                return res.json({
                    status: "SUCCESS",
                    message: "Transaction was queued successfully",
                    data: result
                })
            }
        }).catch(err => {
            console.log(err)
            const status = "failed"

            const templates = {
                "wallet": walletTemplate,
                "billPayment": billPaymentTemplate,
                "FirstLeg": firstLegEscrowTemplate,
                "SecondLeg": secondLegEscrowTemplate,
                "receivepayments": paymentTemplate,
                "transfer": transferTemplate
            };

            let relevantTemplate = templates[data.transactionName] || templates[data.transactionType] || '';

            sendEmailFunction(data, res, status, relevantTemplate)

            return res.json({
                status: "FAILED",
                message: "An error occured while saving details"
            })
        })
        return
    }
}

const updateParticularCurrencyBalances = async (amount, currency, balanceForAdditionalCurrencies, addOrSubtract) => {
    balanceForAdditionalCurrencies.forEach((item) => {
        if (item.currencyShortCode == currency) {
            if (addOrSubtract == 'add') {
                item.balance = +item.balance + +amount;
            } else {
                // console.log(+item.balance, 'before')
                item.balance = +item.balance - +amount;
                // console.log(+item.balance , amount, 'got here update currency function correct')
                // return
            }
        }
    });
    return balanceForAdditionalCurrencies.sort((a, b) => b.balance - a.balance);
};

async function redeemTransaction(transaction, res = null) {
    // console.log(transaction[0].transactionId,'--transation');return
    if (transaction.status === 'complete' ||
        transaction.status === 'cancelled' ||
        transaction.status === 'pending'
    ) {
        const response = {
            status: "FAILED",
            message: "This transaction cannot be redeemed"
        };
        return res ? res.json(response) : response;
    }
    // console.log(transaction[0].transactionId,'--transation')
    // return
    let firstLegTransaction = await Transaction.findOne( {transactionId: transaction.transactionId})
    let secondLegTransaction = await Transaction.findOne( {transactionId: transaction.secondLegTransactionId} )
    // console.log(firstLegTransaction, secondLegTransaction, '--transationffff')
    // return
    if ((firstLegTransaction.status === "buyer-approved" || firstLegTransaction.status === "seller-approved")
     || (secondLegTransaction.status === "buyer-approved" || secondLegTransaction.status === "seller-approved")
    ) {
        let buyerTransactionId;
        let sellerTransactionId;
        // console.log('i am here')
        // return;
        if ( transaction.transactionParty = "Buyer" ) {
            buyerTransactionId = transaction.secondLegTransactionId
            sellerTransactionId = transaction.transactionId
        } else {
             buyerTransactionId = transaction.transactionId
             sellerTransactionId = transaction.secondLegTransactionId
        }

        const updateBuyer = {
            transactionId: buyerTransactionId,
            update: {
                status: 'complete',
                lockedTransaction: +transaction.lockedTransaction - +transaction.amount,
                lastUpdated: new Date(),
            }
        }

        let sellerTransactionEmail = transaction.transactionParty = "Seller" ? transaction.email : transaction.secondPartyEmail;
        const {currentBalance} = await getCurrentUserDetails(transaction, undefined, 1, {email: sellerTransactionEmail}, res);
        // console.log(secondy, '--secondy')
        // return
        const updateSeller = {
            transactionId: sellerTransactionId,
            update: {
                status: 'complete',
                lastUpdated: new Date(),
                lockedTransaction: +transaction.lockedTransaction - +transaction.amount,
                balance: +currentBalance + +transaction.amount
            }
        }

        const transactionsUpdates = [ updateBuyer, updateSeller ];
        // console.log(transactionsUpdates);
        // return
        const bulkOps = transactionsUpdates.map(transactionUpdate => {
            return {
                updateOne: {
                    filter: { transactionId: transactionUpdate.transactionId },
                    update: { $set: transactionUpdate.update }
                }
            };
        });

        Transaction.bulkWrite(bulkOps)
        .then((result) =>{
            if (result.modifiedCount > 0) {
                transaction.status = "complete"
                sendEmailFunction(transaction, res, 'success', redeemTransactionTemplate);
                return res.json({
                    status: "SUCCESS",
                    message: "Transaction Completed, both party has confirmed status"
                })
            }
        }).catch(err => console.error('Bulk update error:', err));
    }
    // console.log(transaction, 'here');
    // return;
    if (transaction.transactionParty == "Buyer") {
        filter = {transactionId: transaction.transactionId}
        update = {  escrowStatus: 'buyer-approved'}
        // console.log(filter, update, '--here');
        // return;
        await Transaction.findOneAndUpdate( filter, update)
        console.log('here')
        return res.json({
            status: "SUCCESS",
            message: "Transaction Updated, waiting for other transaction party"
        })
    }
    // console.log('kkkk')
    // return
    if (transaction.transactionParty == "Seller") {
        filter = {transactionId: transaction.transactionId}
        update = {escrowStatus: 'seller-approved'}

        await Transaction.findOneAndUpdate( filter, update)
        return res.json({
            status: "SUCCESS",
            message: "Transaction Updated, waiting for other party"
        })
    }
}

async function cancelTransaction(transaction, res) {
    if (transaction.status === 'complete' ||
        transaction.status === 'cancelled' ||
        transaction.status === 'pending'
    ) {
        const response = {
            status: "FAILED",
            message: "This transaction cannot be redeemed"
        };
        return res ? res.json(response) : response;
    }

    let firstLegTransaction = await Transaction.findOne( {transactionId: transaction.transactionId})
    let secondLegTransaction = await Transaction.findOne( {transactionId: transaction.secondLegTransactionId} )

    if ((firstLegTransaction.status === "buyer-cancelled" || firstLegTransaction.status === "seller-cancelled")
     || (secondLegTransaction.status === "buyer-cancelled" || secondLegTransaction.status === "seller-cancelled")
    ) {
        let buyerTransactionId;
        let sellerTransactionId;
        // console.log('i am here')
        // return;
        if ( transaction.transactionParty = "Buyer" ) {
            buyerTransactionId = transaction.secondLegTransactionId
            sellerTransactionId = transaction.transactionId
        } else {
             buyerTransactionId = transaction.transactionId
             sellerTransactionId = transaction.secondLegTransactionId
        }

        const updateBuyer = {
            transactionId: buyerTransactionId,
            update: {
                status: 'cancelled',
                lockedTransaction: +transaction.lockedTransaction - +transaction.amount,
                balance: +currentBalance + +transaction.amount,
                lastUpdated: new Date(),
            }
        }

        let sellerTransactionEmail = transaction.transactionParty = "Seller" ? transaction.email : transaction.secondPartyEmail;
        const {currentBalance} = await getCurrentUserDetails(transaction, undefined, 1, {email: sellerTransactionEmail}, res);
        // console.log(secondy, '--secondy')
        // return
        const updateSeller = {
            transactionId: sellerTransactionId,
            update: {
                status: 'cancelled',
                lastUpdated: new Date(),
                lockedTransaction: +transaction.lockedTransaction - +transaction.amount,
            }
        }

        const transactionsUpdates = [ updateBuyer, updateSeller ];
        // console.log(transactionsUpdates);
        // return
        const bulkOps = transactionsUpdates.map(transactionUpdate => {
            return {
                updateOne: {
                    filter: { transactionId: transactionUpdate.transactionId },
                    update: { $set: transactionUpdate.update }
                }
            };
        });

        Transaction.bulkWrite(bulkOps)
        .then((result) =>{
            if (result.modifiedCount > 0) {
                transaction.status = "cancelled"
                sendEmailFunction(transaction, res, 'success', redeemTransactionTemplate);
                return res.json({
                    status: "SUCCESS",
                    message: "Transaction Completed, both party has confirmed status"
                })
            }
        }).catch(err => console.error('Bulk update error:', err));
    }
}

// async function collectFees(data) {

//     if (!data.shouldCharge)  {
//         return data
//     }

//     // return balanceForAdditionalCurrencies.sort((a, b) => b.balance - a.balance);
//     if (data.appServiceFee) {
//         // let updatedAmountLesServiceFee = +data.amount - +data.serviceFee - +data.transactionFee
//         const latestServiceEntry = await ServiceFee.findOne().sort({ transactionDate: -1 })
//         // const balance = latestServiceEntry ? latestServiceEntry.balance : 0
//         let latestServiceEntryBalanceForAdditionalCurrency = latestServiceEntry ? latestServiceEntry.balanceForAdditionalCurrencies : defaultCurrency;
//         let updatedLatestServiceEntryBalanceForAdditionalCurrency = await updateParticularCurrencyBalances(
//             data.appServiceFee, data.transactionCurrency,
//             latestServiceEntryBalanceForAdditionalCurrency, 'subtract');
//         // console.log((+latestServiceEntry ? +latestServiceEntry.balance : +0)); return
//         const serviceFee = new ServiceFee({
//             transactionType: data.transactionType,
//             email: data.email,
//             amount: data.serviceFee,
//             reference: data.reference,
//             currency: data.currency,
//             balance: process.env.NOT_USED_TEXT,
//             transactionDate: new Date(),
//             balanceForAdditionalCurrencies: updatedLatestServiceEntryBalanceForAdditionalCurrency,
//         })
//         serviceFee.save()
//             .then(result => {/*console.log("saved") */})
//             .catch(err => console.error( err));
//     }

//     if (data.appTransactionFee) {
//         const latestTransactionEntry = await TransactionFee.findOne().sort({ transactionDate: -1 });
//         let latestTransactionEntryBalanceForAdditionalCurrency = latestTransactionEntry ? latestTransactionEntry.balanceForAdditionalCurrencies : defaultCurrency;
//         let updatedLatestTransactionEntryBalanceForAdditionalCurrency = updateParticularCurrencyBalances(
//             data.appTransactionFee, data.transactionCurrency,
//             latestTransactionEntryBalanceForAdditionalCurrency, 'subtract');

//         const transactionFee = new TransactionFee({
//             transactionType: data.transactionType,
//             email: data.email,
//             amount: data.transactionFee,
//             reference: data.reference,
//             currency: data.currency,
//             balance:  process.env.NOT_USED_TEXT,
//             transactionDate: new Date(),
//             balanceForAdditionalCurrencies: updatedLatestTransactionEntryBalanceForAdditionalCurrency,
//         })
//         transactionFee.save()
//             .then(result => { /*console.log('saved') */})
//             .catch(err => console.error( err));
//     }

//     if (data.flutterwaveTransactionFee) {
//         const latestFlutterwaveEntry = await FlutterwaveFee.findOne().sort({ transactionDate: -1 });
//         const balanceTransactionFlutterwave = latestTransactionEntry ? latestTransactionEntry.balance : 0

//         let latestFlutterwaveEntryBalanceForAdditionalCurrency =  latestFlutterwaveEntry ? latestFlutterwaveEntry.balanceForAdditionalCurrencies : defaultCurrency;
//         let updatedlatestFlutterwaveEntryBalanceForAdditionalCurrency = updateParticularCurrencyBalances(
//             data.appTransactionFee, data.transactionCurrency,
//             latestServiceEntry.balanceForAdditionalCurrencies, 'add');

//         const transactionFlutterwaveFee = new FlutterwaveFee({
//             transactionType: data.transactionType,
//             email: data.email,
//             amount: data.transactionFee,
//             reference: data.reference,
//             currency: data.currency,
//             balance: process.env.NOT_USED_TEXT,
//             transactionDate: new Date(),
//             balanceForAdditionalCurrencies: updatedlatestFlutterwaveEntryBalanceForAdditionalCurrency,
//         })
//         transactionFee.save()
//             .then(result => { /*console.log('saved') */})
//             .catch(err => console.error( err));
//     }


//     // data.amount = updatedAmountLesServiceFee
//     return data
// }
const getCurrentUserDetails = async (
    { email, amount, transactFromWallet, transactionType },
    sortOrder = -1,
    limit = 2,
    getBy = { email: email },
    res = ""
  ) => {
    var condition = {};
    if (Object.keys(getBy).length > 0) {
      Object.keys(getBy).forEach((key) => {
        const value = getBy[key];
        condition[key] = value;
      });
    } else if (Object.keys(getBy).length === 0) {
      condition = {};
    }
  
    const userDetails = await Transaction.find(condition)
        .sort({ _id: sortOrder })
        .limit(limit)
        .then((transaction) => {
            if (transaction) {
            var currentlockedTransactionBalance =
                transaction.length > 1 && transaction[1].lockedTransaction
                ? transaction[1].lockedTransaction
                : limit == 1 && transaction[0] && transaction[0].lockedTransaction
                ? transaction[0].lockedTransaction
                : 0.0;
    
            var currentUnlockedTransactionBalance =
                transaction.length > 1 && transaction[1].unLockedTransaction
                ? transaction[1].unLockedTransaction
                : limit == 1 && transaction[0] && transaction[0].unLockedTransaction
                ? transaction[0].unLockedTransaction
                : 0.0;
    
            var currentBalance =
                transaction.length > 1 && transaction[1].balance
                ? transaction[1].balance
                : limit == 1 && transaction[0]
                ? transaction[0].balance
                : 0.0;
    
            var userBalanceForAdditionalCurrencies =
                transaction.length > 1 && transaction[1].balanceForAdditionalCurrencies
                ? transaction[1].balanceForAdditionalCurrencies
                : limit == 1 && transaction[0] && transaction[0].balanceForAdditionalCurrencies.length !== 0
                ? transaction[0].balanceForAdditionalCurrencies
                : defaultCurrency;
    
            var userCurrentTransactionCurrency =
                transaction.length > 1 && transaction[1].transactionCurrency
                ? transaction[1].transactionCurrency
                : limit == 1 && transaction[0]
                ? transaction[0].transactionCurrency
                : null;

            const userDetailsObject = {
                currentlockedTransactionBalance: currentlockedTransactionBalance,
                currentUnlockedTransactionBalance: currentUnlockedTransactionBalance,
                currentBalance: currentBalance,
                balanceForAdditionalCurrencies: userBalanceForAdditionalCurrencies,
                userCurrentTransactionCurrency: userCurrentTransactionCurrency,
            };
    
            return userDetailsObject;
            } else {
            return res.json({
                status: "FAILED",
                message: "Client data not found",
            });
            }
        })
        .catch((err) => {
            console.log(err, "--an error occurred");
        });
    
        return userDetails;
};
  
const feeModelMap = {
    flutterwaveFee: FlutterwaveFee,
    transactionFee: TransactionFee,
    serviceFee: ServiceFee,
};
  
async function collectFeesAndUpdateParticularCurrencyBalances(data) {
    if (!data.shouldCharge) {
        return data;
    }

    for (const [feeType, feeAmount] of Object.entries(data.transactionFeesAmountDetails)) {
        if (!feeAmount) continue;

        const model = feeModelMap[feeType];
        if (!model) continue;

        const latestEntry = await model.findOne().sort({ transactionDate: -1 });

        // console.log(model,defaultCurrency, '-----hhhhhhhhhh' )
       
        const latestBalanceForAdditionalCurrency = latestEntry ? latestEntry.balanceForAdditionalCurrencies : 
        
        [
            {
                country: 'AT',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'BE',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'BG',
                balance: 0,
                currencyShortCode: 'BGN',
                currencySymbol: 'лв'
            },
            {
                country: 'HR',
                balance: 0,
                currencyShortCode: 'HRK',
                currencySymbol: 'kn'
            },
            {
                country: 'CY',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'CZ',
                balance: 0,
                currencyShortCode: 'CZK',
                currencySymbol: 'Kč'
            },
            {
                country: 'DK',
                balance: 0,
                currencyShortCode: 'DKK',
                currencySymbol: 'kr'
            },
            {
                country: 'EE',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'FI',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'FR',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'DE',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'GR',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'HU',
                balance: 0,
                currencyShortCode: 'HUF',
                currencySymbol: 'Ft'
            },
            {
                country: 'IS',
                balance: 0,
                currencyShortCode: 'ISK',
                currencySymbol: 'kr'
            },
            {
                country: 'IE',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'IT',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'LV',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'LI',
                balance: 0,
                currencyShortCode: 'CHF',
                currencySymbol: 'CHF'
            },
            {
                country: 'LT',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'LU',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'MT',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'MC',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'NL',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'NO',
                balance: 0,
                currencyShortCode: 'NOK',
                currencySymbol: 'kr'
            },
            {
                country: 'PL',
                balance: 0,
                currencyShortCode: 'PLN',
                currencySymbol: 'zł'
            },
            {
                country: 'PT',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'RO',
                balance: 0,
                currencyShortCode: 'RON',
                currencySymbol: 'lei'
            },
            {
                country: 'SM',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'SK',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'SI',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'ES',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'SE',
                balance: 0,
                currencyShortCode: 'SEK',
                currencySymbol: 'kr'
            },
            {
                country: 'CH',
                balance: 0,
                currencyShortCode: 'CHF',
                currencySymbol: 'CHF'
            },
            {
                country: 'GB',
                balance: 0,
                currencyShortCode: 'GBP',
                currencySymbol: '£'
            },
            {
                country: 'AD',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'VA',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'ME',
                balance: 0,
                currencyShortCode: 'EUR',
                currencySymbol: '€'
            },
            {
                country: 'GH',
                balance: 0,
                currencyShortCode: 'GHS',
                currencySymbol: '₵'
            },
            {
                country: 'KE',
                balance: 0,
                currencyShortCode: 'KES',
                currencySymbol: 'KSh'
            },
            {
                country: 'NG',
                balance: 0,
                currencyShortCode: 'NGN',
                currencySymbol: '₦'
            },
            {
                country: 'SL',
                balance: 0,
                currencyShortCode: 'SLL',
                currencySymbol: 'Le'
            },
            {
                country: 'TZ',
                balance: 0,
                currencyShortCode: 'TZS',
                currencySymbol: 'TSh'
            },
            {
                country: 'UG',
                balance: 0,
                currencyShortCode: 'UGX',
                currencySymbol: 'USh'
            },
            {
                country: 'US',
                balance: 0,
                currencyShortCode: 'USD',
                currencySymbol: '$'
            },
            {
                country: 'CM',
                balance: 0,
                currencyShortCode: 'XAF',
                currencySymbol: 'FCFA'
            },
            {
                country: 'TD',
                balance: 0,
                currencyShortCode: 'XAF',
                currencySymbol: 'FCFA'
            },
            {
                country: 'CD',
                balance: 0,
                currencyShortCode: 'CDF',
                currencySymbol: 'FC'
            },
            {
                country: 'GA',
                balance: 0,
                currencyShortCode: 'XAF',
                currencySymbol: 'FCFA'
            },
            {
                country: 'BJ',
                balance: 0,
                currencyShortCode: 'XOF',
                currencySymbol: 'CFA'
            },
            {
                country: 'CI',
                balance: 0,
                currencyShortCode: 'XOF',
                currencySymbol: 'CFA'
            },
            {
                country: 'SN',
                balance: 0,
                currencyShortCode: 'XOF',
                currencySymbol: 'CFA'
            },
            {
                country: 'ZA',
                balance: 0,
                currencyShortCode: 'ZAR',
                currencySymbol: 'R'
            }
        ]
        // console.log(latestBalanceForAdditionalCurrency, '------default ')
        const updateAction = 'add'
        
        const updatedBalanceForAdditionalCurrency = await updateParticularCurrencyBalances(
            feeAmount,
            data.transactionCurrency,
            latestBalanceForAdditionalCurrency,
            updateAction
        );

        // data.totalTransactionAmount -= feeAmount

        const feeEntry = new model({
            transactionType: data.transactionType,
            email: data.email,
            amount: feeAmount,
            reference: data.transactionId,
            currency: data.transactionCurrency,
            balance: 0,
            transactionDate: new Date(),
            balanceForAdditionalCurrencies: updatedBalanceForAdditionalCurrency,
        });

        // console.log(feeEntry,model,feeAmount, '-----lll'  )

        await feeEntry.save().catch(err => console.error(err));
    }

    const mainTransactionUpdateAction = data.transactionType == "wallet" ? 'add' : 'subtract'

    //update currency balancies
    const updatedBalanceForAdditionalCurrencyForMainTransaction = await updateParticularCurrencyBalances(
        data.totalTransactionAmount,
        data.transactionCurrency,
        data.balanceForAdditionalCurrencies,
        mainTransactionUpdateAction
    )

    data.balanceForAdditionalCurrencies = updatedBalanceForAdditionalCurrencyForMainTransaction

    return data;
}

function log(data) {
    const newTransactionApiLog = new TransactionApiLog({
        // transactionDate: new Date(),
        log: data
    })
    newTransactionApiLog.save().then(() => {}).catch(err => {console.log(err);})

    const filePath = path.join(__dirname, 'app.log'); // Log file path
    const timestamp = new Date().toISOString(); // ISO format timestamp

    // Check if the data is an object and convert it to string if it is
    const logMessage = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;

    // Append log message to file with a timestamp
    fs.appendFile(filePath, `${timestamp} - ${logMessage}\n`, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
}

// export const defaultCurrency = [
// //     {
// //         country: 'AT',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'BE',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'BG',
// //         balance: 0,
// //         currencyShortCode: 'BGN',
// //         currencySymbol: 'лв'
// //     },
// //     {
// //         country: 'HR',
// //         balance: 0,
// //         currencyShortCode: 'HRK',
// //         currencySymbol: 'kn'
// //     },
// //     {
// //         country: 'CY',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'CZ',
// //         balance: 0,
// //         currencyShortCode: 'CZK',
// //         currencySymbol: 'Kč'
// //     },
// //     {
// //         country: 'DK',
// //         balance: 0,
// //         currencyShortCode: 'DKK',
// //         currencySymbol: 'kr'
// //     },
// //     {
// //         country: 'EE',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'FI',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'FR',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'DE',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'GR',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'HU',
// //         balance: 0,
// //         currencyShortCode: 'HUF',
// //         currencySymbol: 'Ft'
// //     },
// //     {
// //         country: 'IS',
// //         balance: 0,
// //         currencyShortCode: 'ISK',
// //         currencySymbol: 'kr'
// //     },
// //     {
// //         country: 'IE',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'IT',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'LV',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'LI',
// //         balance: 0,
// //         currencyShortCode: 'CHF',
// //         currencySymbol: 'CHF'
// //     },
// //     {
// //         country: 'LT',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'LU',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'MT',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'MC',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'NL',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'NO',
// //         balance: 0,
// //         currencyShortCode: 'NOK',
// //         currencySymbol: 'kr'
// //     },
// //     {
// //         country: 'PL',
// //         balance: 0,
// //         currencyShortCode: 'PLN',
// //         currencySymbol: 'zł'
// //     },
// //     {
// //         country: 'PT',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'RO',
// //         balance: 0,
// //         currencyShortCode: 'RON',
// //         currencySymbol: 'lei'
// //     },
// //     {
// //         country: 'SM',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'SK',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'SI',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'ES',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'SE',
// //         balance: 0,
// //         currencyShortCode: 'SEK',
// //         currencySymbol: 'kr'
// //     },
// //     {
// //         country: 'CH',
// //         balance: 0,
// //         currencyShortCode: 'CHF',
// //         currencySymbol: 'CHF'
// //     },
// //     {
// //         country: 'GB',
// //         balance: 0,
// //         currencyShortCode: 'GBP',
// //         currencySymbol: '£'
// //     },
// //     {
// //         country: 'AD',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'VA',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'ME',
// //         balance: 0,
// //         currencyShortCode: 'EUR',
// //         currencySymbol: '€'
// //     },
// //     {
// //         country: 'GH',
// //         balance: 0,
// //         currencyShortCode: 'GHS',
// //         currencySymbol: '₵'
// //     },
// //     {
// //         country: 'KE',
// //         balance: 0,
// //         currencyShortCode: 'KES',
// //         currencySymbol: 'KSh'
// //     },
// //     {
// //         country: 'NG',
// //         balance: 0,
// //         currencyShortCode: 'NGN',
// //         currencySymbol: '₦'
// //     },
// //     {
// //         country: 'SL',
// //         balance: 0,
// //         currencyShortCode: 'SLL',
// //         currencySymbol: 'Le'
// //     },
// //     {
// //         country: 'TZ',
// //         balance: 0,
// //         currencyShortCode: 'TZS',
// //         currencySymbol: 'TSh'
// //     },
// //     {
// //         country: 'UG',
// //         balance: 0,
// //         currencyShortCode: 'UGX',
// //         currencySymbol: 'USh'
// //     },
// //     {
// //         country: 'US',
// //         balance: 0,
// //         currencyShortCode: 'USD',
// //         currencySymbol: '$'
// //     },
// //     {
// //         country: 'CM',
// //         balance: 0,
// //         currencyShortCode: 'XAF',
// //         currencySymbol: 'FCFA'
// //     },
// //     {
// //         country: 'TD',
// //         balance: 0,
// //         currencyShortCode: 'XAF',
// //         currencySymbol: 'FCFA'
// //     },
// //     {
// //         country: 'CD',
// //         balance: 0,
// //         currencyShortCode: 'CDF',
// //         currencySymbol: 'FC'
// //     },
// //     {
// //         country: 'GA',
// //         balance: 0,
// //         currencyShortCode: 'XAF',
// //         currencySymbol: 'FCFA'
// //     },
// //     {
// //         country: 'BJ',
// //         balance: 0,
// //         currencyShortCode: 'XOF',
// //         currencySymbol: 'CFA'
// //     },
// //     {
// //         country: 'CI',
// //         balance: 0,
// //         currencyShortCode: 'XOF',
// //         currencySymbol: 'CFA'
// //     },
// //     {
// //         country: 'SN',
// //         balance: 0,
// //         currencyShortCode: 'XOF',
// //         currencySymbol: 'CFA'
// //     },
// //     {
// //         country: 'ZA',
// //         balance: 0,
// //         currencyShortCode: 'ZAR',
// //         currencySymbol: 'R'
// //     }
// ]

module.exports = {
    saveTransaction,
    getCurrentUserDetails,
    updateParticularCurrencyBalances,
    redeemTransaction,
    cancelTransaction,
    log,
    collectFeesAndUpdateParticularCurrencyBalances
}
