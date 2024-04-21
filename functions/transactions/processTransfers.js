const validation = require('../validation/validateData')
const {saveTransaction, getCurrentUserDetails} = require('../process')

const processTransfers = async (data, res) => {

    validation.validateData(data, res)

    let {email, 
        transactionId,
        amount, 
        transactionType, 
        date, 
        details, 
        transactionName,
        transactFromWallet,
        accountNumber,
        accountBank,
        currency,
        reference,
        callbackUrl,
        debitCurrency,
        transferType
    } = data

    const userCurrentDetails = await getCurrentUserDetails(data)

    var {  currentBalance } = userCurrentDetails

    var filter = { transactionId: transactionId }; 
    var update = {
        transactionId: transactionId,
        transactionName: transactionName,
        transactionType: transactionType,
        //wait till after webook before deducting - so just leave the old balance for now or you can debit it back after being successfull
        balance: currentBalance,
        amount: amount,
        email: email,
        date: date,
        details: details,
        transactFromWallet: transactFromWallet,
        accountNumber: accountNumber,
        accountBank: accountBank,
        currency: currency,
        reference: reference,
        callbackUrl: callbackUrl,
        debitCurrency: debitCurrency,
        status: 'pending',

        ...((transferType == "isGUZT") ? { destination_branch_code: data.branchCode, beneficiary_name: data.beneficiaryName } : {}),

        ...((transferType = "isLocalDomiciliaryAndIsFcmbOrIsUsdOrIsEur") ? { beneficiary_name: data.beneficiaryName } : {}),

        ...((transferType = "isLocalDomiciliary") ? { meta: [{
            first_name: data.beneficiaryFirstName,
            last_name: data.beneficiaryLastName,
            email: data.beneficiaryEmail,
            beneficiary_country: data.beneficiaryCountry,
            mobile_number: data.beneficiaryMobile,
            sender: data.sender,
            merchant_name: data.merchantName
          }] } : {}),
        //additional meta fields for international transfers
        ...((transferType == "isLocalDomiciliaryandisFcmbDorm") ? { meta: [{
            beneficiaryEmail: data.beneficiaryEmail,
            beneficiary_country: data.beneficiaryCountry,
            beneficiary_occupation: data.beneficiaryOccupation,
            recipient_address: data.recipientAddress,
            mobile_number: data.beneficiaryMobile,
            sender: data.sender,
            sender_country: data.senderCountry,
            sender_id_number: data.senderIdNumber,
            sender_id_type: data.senderIdType,
            sender_id_expiry: data.senderIdExpiryDate,
            sender_mobile_number: data.senderMobile,
            sender_address: data.senderAddress,
            sender_occupation: data.senderOccupation,
            sender_beneficiary_relationship: data.senderBeneficiaryRelationship,
            transfer_purpose: data.transferPurpose
        }] } : {}),

        ...(transferType = "isUsdAccount" ? { meta: [{
            AccountNumber: data.inputValueAccount,
            RoutingNumber: data.routingNumber,
            SwiftCode: data.swiftCode,
            BankName: data.internationBankName,
            BeneficiaryName: data.beneficiaryName,
            BeneficiaryAddress: data.beneficiaryAddress,
            BeneficiaryCountry: data.beneficiaryCountry,
          }]} : {}),

        ...(transferType == "isEurGbp" ? { meta: [{
            AccountNumber: data.inputValueAccount,
            RoutingNumber: data.routingNumber,
            SwiftCode: data.swiftCode,
            BankName: data.internationBankName,
            BeneficiaryName: data.beneficiaryName,
            BeneficiaryCountry: data.beneficiaryCountry,
            PostalCode: data.postalCode,
            StreetNumber: data.streetNumber,
            StreetName: data.beneficiaryStreetName,
            City: data.beneficiaryCity
        }]} : {}),

        ...(transferType == "isKesAccount" ? { meta: [{
            sender: data.sender,
            sender_country: data.senderCountry,
            mobile_number: data.senderMobile
        }]} : {}),

        ...(isZarAccount == 'isZarAccount' ? { meta: [{
            first_name: data.beneficiaryFirstName,
            last_name: data.beneficiaryLastName,
            email: data.beneficiaryEmail,
            mobile_number: data.beneficiaryMobile,
            recipient_address: data.recipientAddress
        }]} : {}),

    };
    console.log(update,'---this is update')
    return;

    saveTransaction(filter, update, data, res, "directsave")
}

module.exports = {processTransfers}  