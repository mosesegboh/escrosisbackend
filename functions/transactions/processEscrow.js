const {validateData} = require('../validation/validateData')
const {saveTransaction, getCurrentUserDetails, updateParticularCurrencyBalances} = require('../process')

const processEscrow = async (data, res) => {

    validateData(data, res)

    var userCurrentDetails = await getCurrentUserDetails(data, undefined, 1, undefined, res);

    const {
        balanceForAdditionalCurrencies,
        currentBalance, 
        currentlockedTransactionBalance, 
        currentUnlockedTransactionBalance
    } = userCurrentDetails
    // console.log(currentBalance, '-- balance') 
    // return 
    var filter = { transactionId: data.transactionId };
    var update = {
        transactionId: data.transactionId, 
        transactionName: data.transactionName,
        transactionCurrency: data.transactionCurrency,
        transactionType: data.transactionType,
        balance: currentBalance - +data.amount,
        ...((data.transactionType == "FirstLeg") ? {  
            unLockedTransaction: currentUnlockedTransactionBalance + +data.amount,
            lockedTransaction: currentlockedTransactionBalance,
            status: "open",
            secondPartyPhone: data.secondPartyPhone,
            secondPartyEmail: data.secondPartyEmail,
        } : {}
        ),
        ...((data.transactionType == "SecondLeg") ? { 
            unLockedTransaction: currentUnlockedTransactionBalance, 
            lockedTransaction: currentlockedTransactionBalance + +data.amount,
            secondLegTransactionId: data.secondLegTransactionId,
            secondPartyPhone: data.secondPartyPhone,
            secondPartyEmail: data.secondPartyEmail,
            status: "locked" ,
            balance: currentBalance} : {}   
        ),
        transactionParty: data.transactionParty,
        amount: data.amount,
        email: data.email,
        phone: data.phone,
        date: new Date(), 
        redemptionDate: data.date,
        lastUpdated: data.lastUpdated,
        details: data.details,
        transactFromWallet: data.transactFromWallet,
        transactionType: data.transactionType, 
        reference: data.transactionId,
        balanceForAdditionalCurrencies: await updateParticularCurrencyBalances(data.amount, data.currency, balanceForAdditionalCurrencies, 'add')   
    }; 
    // var multi = {firstKey:  data.secondLegTransactionId}   
    // console.log(data.transactionType == "SecondLeg" ? {firstKey:  data.secondLegTransactionId} : undefined, '--update')
    // return
    saveTransaction(undefined, update, data, res, "directsave", data.transactionType == "SecondLeg" ? {firstKey:  data.secondLegTransactionId} : undefined)
}

module.exports = {processEscrow}    