const {validateData} = require('../validation/validateData')
const {saveTransaction, getCurrentUserDetails, updateParticularCurrencyBalances, collectFeesAndUpdateParticularCurrencyBalances} = require('../process')

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
        ...((data.useSingleBalance) ? { balance: data.useSingleBalance} : {}),
        ...((data.transactionType == "FirstLeg") ? {  
            ...((data.useSingleBalance) ? {  unLockedTransaction: currentUnlockedTransactionBalance + +data.amount} : {}),
            ...((data.useSingleBalance) ? {  lockedTransaction: currentlockedTransactionBalance} : {}),
            status: "open",
            secondPartyPhone: data.secondPartyPhone,
            secondPartyEmail: data.secondPartyEmail,
        } : {}
        ),
        ...((data.transactionType == "SecondLeg") ? { 
            ...((data.useSingleBalance) ? { balance: currentBalance} : {}),
            ...((data.useSingleBalance) ? {  unLockedTransaction: currentUnlockedTransactionBalance} : {}),
            ...((data.useSingleBalance) ? {  lockedTransaction: currentlockedTransactionBalance + +data.amount} : {}),
            secondLegTransactionId: data.secondLegTransactionId,
            secondPartyPhone: data.secondPartyPhone,
            secondPartyEmail: data.secondPartyEmail,
            status: "locked" ,
        } : {}   
        ),
        transactionParty: data.transactionParty,
        amount: data.amount,
        email: data.email,
        phone: data.phone,
        date: new Date(), 
        redemptionDate: data.date,
        lastUpdated: new Date(),
        details: data.details,
        transactFromWallet: data.transactFromWallet,
        transactionType: data.transactionType, 
        reference: data.transactionId,
        deliveryFee: data.deliveryFee,
        isDeliveryDeductable: data.isDeliveryDeductable,
        isPortableItem: data.isPortableItem, 
        
        // balanceForAdditionalCurrencies: await updateParticularCurrencyBalances(data.amount, data.currency, balanceForAdditionalCurrencies, 'add')  
    
        //additional currencies
        currency: data.currency,
        amountDeductedFromSelectedCurrencyBalance: data.amountDeductedFromSelectedCurrencyBalance,
        transactionCurrency: data.transactionCurrency,
        shouldCharge: data.shouldCharge,
        transactionFeesAmountDetails: data.transactionFeesAmountDetails,
        originalAmount: data.originalAmount,
        totalTransactionAmount: data.totalTransactionAmount,
        selectedBalance: data.selectedBalance,
        transactionDate: data.transactionDate,
        transactionItemType: data.transactionItemType,
        transactionRedemptionDate: data.transactionRedemptionDate,
        deliverySelected: data.deliverySelected,
        deliveryTrackingCode: data.deliveryTrackingCode,
        shouldDeliveryBeDeductedOnFailure: data.shouldDeliveryBeDeductedOnFailure,
        balanceForAdditionalCurrencies: balanceForAdditionalCurrencies,
         
    }; 

    // console.log(update, '-----this is update')
    // return

    var updatedTransaction = await collectFeesAndUpdateParticularCurrencyBalances(update) 
    // console.log(updatedTransaction, '------tester')
    // return
    
    // var multi = {firstKey:  data.secondLegTransactionId}   
    // console.log(data.transactionType == "SecondLeg" ? {firstKey:  data.secondLegTransactionId} : undefined, '--update')
    // return
    saveTransaction(undefined, updatedTransaction, data, res, "directsave", data.transactionType == "SecondLeg" ? {firstKey:  data.secondLegTransactionId} : undefined)
}

module.exports = {processEscrow}    