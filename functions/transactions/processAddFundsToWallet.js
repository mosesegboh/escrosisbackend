const {saveTransaction, getCurrentUserDetails} = require('../process')
const {validateData} = require('../validation/validateData')

const processAddFundsToWallet = async (data, res) => {

    validateData(data, res)

    var userCurrentDetails = await getCurrentUserDetails(data, undefined, 1, undefined);

    var {
        balanceForAdditionalCurrencies, 
        currentBalance, 
        currentlockedTransactionBalance,
        currentUnlockedTransactionBalance, 
    } = userCurrentDetails

    var update = {
        status: "pending",
        transactionId: data.transactionId,
        transactionName: data.transactionName,
        transactionType: data.transactionType,
        balance: currentBalance,
        transactionCurrency: data.transactionCurrency,
        transactionName: data.transactionName,
        lockedTransaction: currentlockedTransactionBalance,
        unLockedTransaction: currentUnlockedTransactionBalance,
        amount: data.amount,
        email: data.email,
        date: data.date,
        details: data.details, 

        shouldCharge: data.shouldCharge,
        transactionFeesAmountDetails: data.transactionFeesAmountDetails,
        originalAmount: data.originalAmount,
        totalTransactionAmount: data.totalTransactionAmount,
        // customer: data.customer,
        // reference: data.reference,
        balanceForAdditionalCurrencies: balanceForAdditionalCurrencies,   
    };
        // console.log(update, '--this is data')
        // return
    saveTransaction(undefined, update, data, res, "directsave") 
}

module.exports = {processAddFundsToWallet}