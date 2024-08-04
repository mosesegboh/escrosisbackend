const {validateData} = require('../validation/validateData')
const {saveTransaction, getCurrentUserDetails, updateParticularCurrencyBalances} = require('../process')

const processBillPayment = async (data, res) => {

    validateData(data, res)

    var userCurrentDetails = await getCurrentUserDetails(data, undefined, 1, undefined);

    var {
        balanceForAdditionalCurrencies, 
        currentBalance, 
        currentlockedTransactionBalance,
        currentUnlockedTransactionBalance,
        // userCurrentTransactionCurrency,
    } = userCurrentDetails

    var update = {
        status: "pending",
        transactionId: data.transactionId,
        transactionName: data.transactionName,
        transactionType: data.transactionType,
        balance: +currentBalance - +data.amount,
        lockedTransaction: +currentlockedTransactionBalance,
        unLockedTransaction: +currentUnlockedTransactionBalance,
        amount: data.amount,
        email: data.email,
        date: data.date,
        details: data.details,
        transactFromWallet: data.transactFromWallet,
        country: data.country,
        transactionType: data.transactionType,
        customer_id: data.customer_id,
        recurrence: data.recurrence,
        // reference: data.reference,
        currency: data.currency,
        amountDeductedFromSelectedCurrencyBalance: data.amountDeductedFromSelectedCurrencyBalance,
        transactionCurrency: data.transactionCurrency,

        shouldCharge: data.shouldCharge,
        transactionFeesAmountDetails: data.transactionFeesAmountDetails,
        originalAmount: data.originalAmount,
        totalTransactionAmount: data.totalTransactionAmount,
        balanceForAdditionalCurrencies: balanceForAdditionalCurrencies 
        // balanceForAdditionalCurrencies: await updateParticularCurrencyBalances(data.amount, data.currency, balanceForAdditionalCurrencies, 'subtract')
    };

    // console.log(update, '--UPDATE') 
    // return

    saveTransaction(undefined, update, data, res, "directsave")
}

module.exports = {processBillPayment}  