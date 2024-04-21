const Transaction = require('../../models/Transaction')
const {sendEmailFunction} = require('../../services/email/functions/sendEmailFunctionExport')
const walletTemplate = require('../../services/email/templates/walletTemplate')
const billPaymentTemplate = require('../../services/email/templates/billPaymentTemplate')
const firstLegEscrowTemplate = require('../../services/email/templates/firstLegEscrowTemplate')
const secondLegEscrowTemplate = require('../../services/email/templates/secondLegEscrowTemplate') 
const paymentTemplate = require('../../services/email/templates/paymentTemplate')
const cancelTransactionTemplate = require('../../services/email/templates/cancelledTransactionTemplate')
const redeemTransactionTemplate = require('../../services/email/templates/redeemTransactionTemplate')

const getCurrentUserDetails = async ({email, amount, transactFromWallet, transactionType }, 
    sortOrder=-1, limit=2, getBy={email: email}, res = "") => {
    var condition = {}
    if (Object.keys(getBy).length > 0) {
        var condition = {};
        Object.keys(getBy).forEach((key) => {
            const value = getBy[key];
            condition[key] = value;
            // const conditionKey = `Transaction.${key}`;
            // condition[conditionKey] = value;
        });
    } else if (Object.keys(getBy).length === 0) {
        var condition = {}
    }
    // console.log(condition); 
    const userDetails = await Transaction.find(condition)
    .sort({_id: sortOrder}).limit(limit)
    .then((transaction)=>{
        if (transaction) {
            // console.log(transaction, '--transaction') 
            var currentlockedTransactionBalance = (transaction.length > 1 && transaction[1].lockedTransaction) 
            ? transaction[1].lockedTransaction : (limit == 1 && transaction[0]) 
            ? transaction[0].lockedTransaction : 0.00
            var currentUnlockedTransactionBalance = (transaction.length > 1 && transaction[1].unLockedTransaction ) 
            ?  transaction[1].unLockedTransaction : (limit == 1 && transaction[0]) 
            ? transaction[0].unLockedTransaction : 0.00
            var currentBalance = (transaction.length > 1 && transaction[1].balance) 
            ? transaction[1].balance : (limit == 1 && transaction[0]) 
            ? transaction[0].balance : 0.00
            var userBalanceForAdditionalCurrencies = (transaction.length > 1 && transaction[1].balanceForAdditionalCurrencies) 
            ? transaction[1].balanceForAdditionalCurrencies : (limit == 1 && transaction[0]) 
            ? transaction[0].balanceForAdditionalCurrencies : null /* Formerly 0.00 */ 
            var userCurrentTransactionCurrency = (transaction.length > 1 && transaction[1].transactionCurrency) 
            ? transaction[1].transactionCurrency : (limit == 1 && transaction[0]) 
            ? transaction[0].transactionCurrency : null

            if ( amount > currentBalance && transactFromWallet == "yes" && transactionType !== "SecondLeg") {
                return res.json({
                    status: "FAILED",
                    message: "You do not have sufficient funds to complete your transaction"
                })
            }
            // console.log(currentlockedTransactionBalance, currentUnlockedTransactionBalance, currentBalance)
            const userDetailsObject = {
                currentlockedTransactionBalance: currentlockedTransactionBalance,
                currentUnlockedTransactionBalance: currentUnlockedTransactionBalance, 
                currentBalance: currentBalance,
                balanceForAdditionalCurrencies: userBalanceForAdditionalCurrencies,
                userCurrentTransactionCurrency: userCurrentTransactionCurrency
            }
            return userDetailsObject; 
        }else{
            return res.json({
                status: "FAILED",
                message: "Client data not found"
            })
        }
    }).catch(err => {
        console.log(err, '--an error occured')
    })
    return userDetails
}

const saveTransaction = async (filter = {}, update, data, res = {}, directSave = "", multi = undefined) => {
    if (data.transactionName === "escrow" && data.status === "locked") {
        return res.json({
            status: "FAILED",
            message: "Transaction is already locked"
        })
    }

    // console.log(multi, '----transaction')
    //         return

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
                const status = "success";

                const templates = {
                    "wallet": walletTemplate,
                    "billPayment": billPaymentTemplate,
                    "FirstLeg": firstLegEscrowTemplate,
                    "SecondLeg": secondLegEscrowTemplate,
                    "receivepayments": paymentTemplate
                };
            
                let relevantTemplate = templates[result.transactionName] || templates[result.transactionType] || '';

                sendEmailFunction(result, res, status, relevantTemplate)

                return res.json({
                    status: "SUCCESS",
                    message: "Transaction was queued successfully"
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
                "receivepayments": paymentTemplate
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

const updateParticularCurrencyBalances = (amount, currency, multipleCurrencyObject) => {
    multipleCurrencyObject.forEach((item) => {
        if (item.transactionCurrency === currency) { 
            item.mainBalanceAfterTransaction = +item.mainBalanceAfterTransaction + +amount 
        }
    })
    return multipleCurrencyObject
}

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

module.exports = {
    saveTransaction, 
    getCurrentUserDetails, 
    updateParticularCurrencyBalances, 
    redeemTransaction,
    cancelTransaction
}  