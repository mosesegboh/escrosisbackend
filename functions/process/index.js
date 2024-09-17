const Transaction = require('../../models/Transaction')
const ServiceFee = require('../../models/ServiceFee')
const TransactionFee = require('../../models/TransactionFee')
const FlutterwaveFee = require('../../models/FlutterwaveFee')
const EscrowAccount = require('../../models/EscrowAccount')
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

const defaultCurrencyRates = [
    {
        country: 'AT',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09 // Example rate relative to USD
    },
    {
        country: 'BE',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'BG',
        balance: 0,
        currencyShortCode: 'BGN',
        currencySymbol: 'лв',
        rate: 0.59
    },
    {
        country: 'HR',
        balance: 0,
        currencyShortCode: 'HRK',
        currencySymbol: 'kn',
        rate: 0.16
    },
    {
        country: 'CY',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'CZ',
        balance: 0,
        currencyShortCode: 'CZK',
        currencySymbol: 'Kč',
        rate: 0.045
    },
    {
        country: 'DK',
        balance: 0,
        currencyShortCode: 'DKK',
        currencySymbol: 'kr',
        rate: 0.15
    },
    {
        country: 'EE',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'FI',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'FR',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'DE',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'GR',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'HU',
        balance: 0,
        currencyShortCode: 'HUF',
        currencySymbol: 'Ft',
        rate: 0.0028
    },
    {
        country: 'IS',
        balance: 0,
        currencyShortCode: 'ISK',
        currencySymbol: 'kr',
        rate: 0.0071
    },
    {
        country: 'IE',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'IT',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'LV',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'LI',
        balance: 0,
        currencyShortCode: 'CHF',
        currencySymbol: 'CHF',
        rate: 1.12
    },
    {
        country: 'LT',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'LU',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'MT',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'MC',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'NL',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'NO',
        balance: 0,
        currencyShortCode: 'NOK',
        currencySymbol: 'kr',
        rate: 0.097
    },
    {
        country: 'PL',
        balance: 0,
        currencyShortCode: 'PLN',
        currencySymbol: 'zł',
        rate: 0.25
    },
    {
        country: 'PT',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'RO',
        balance: 0,
        currencyShortCode: 'RON',
        currencySymbol: 'lei',
        rate: 0.22
    },
    {
        country: 'SM',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'SK',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'SI',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'ES',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'SE',
        balance: 0,
        currencyShortCode: 'SEK',
        currencySymbol: 'kr',
        rate: 0.10
    },
    {
        country: 'CH',
        balance: 0,
        currencyShortCode: 'CHF',
        currencySymbol: 'CHF',
        rate: 1.12
    },
    {
        country: 'GB',
        balance: 0,
        currencyShortCode: 'GBP',
        currencySymbol: '£',
        rate: 1.28
    },
    {
        country: 'AD',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'VA',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'ME',
        balance: 0,
        currencyShortCode: 'EUR',
        currencySymbol: '€',
        rate: 1.09
    },
    {
        country: 'GH',
        balance: 0,
        currencyShortCode: 'GHS',
        currencySymbol: '₵',
        rate: 0.086
    },
    {
        country: 'KE',
        balance: 0,
        currencyShortCode: 'KES',
        currencySymbol: 'KSh',
        rate: 0.0070
    },
    {
        country: 'NG',
        balance: 0,
        currencyShortCode: 'NGN',
        currencySymbol: '₦',
        rate: 0.0013
    },
    {
        country: 'SL',
        balance: 0,
        currencyShortCode: 'SLL',
        currencySymbol: 'Le',
        rate: 0.00005
    },
    {
        country: 'TZ',
        balance: 0,
        currencyShortCode: 'TZS',
        currencySymbol: 'TSh',
        rate: 0.0004
    },
    {
        country: 'UG',
        balance: 0,
        currencyShortCode: 'UGX',
        currencySymbol: 'USh',
        rate: 0.00027
    },
    {
        country: 'US',
        balance: 0,
        currencyShortCode: 'USD',
        currencySymbol: '$',
        rate: 1.0 // Base currency
    },
    {
        country: 'CM',
        balance: 0,
        currencyShortCode: 'XAF',
        currencySymbol: 'FCFA',
        rate: 0.0016
    },
    {
        country: 'TD',
        balance: 0,
        currencyShortCode: 'XAF',
        currencySymbol: 'FCFA',
        rate: 0.0016
    },
    {
        country: 'CD',
        balance: 0,
        currencyShortCode: 'CDF',
        currencySymbol: 'FC',
        rate: 0.0004
    },
    {
        country: 'GA',
        balance: 0,
        currencyShortCode: 'XAF',
        currencySymbol: 'FCFA',
        rate: 0.0016
    },
    {
        country: 'BJ',
        balance: 0,
        currencyShortCode: 'XOF',
        currencySymbol: 'CFA',
        rate: 0.0017
    },
    {
        country: 'CI',
        balance: 0,
        currencyShortCode: 'XOF',
        currencySymbol: 'CFA',
        rate: 0.0017
    },
    {
        country: 'SN',
        balance: 0,
        currencyShortCode: 'XOF',
        currencySymbol: 'CFA',
        rate: 0.0017
    },
    {
        country: 'ZA',
        balance: 0,
        currencyShortCode: 'ZAR',
        currencySymbol: 'R',
        rate: 0.055
    }
];

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

            if (data.email == transaction.email && data.transactionName == "escrow") {
                return res.json({
                    status: "FAILED",
                    message: "You cannot perform an escrow transaction with same account"
                })
            }
            // console.log(transaction, '----transaction')
            // return
            if (data.useSingleBalance) {
                transaction.unLockedTransaction = +transaction.unLockedTransaction - +transaction.amount
                transaction.lockedTransaction = +transaction.unLockedTransaction + +transaction.amount
            }
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

                // console.log(relevantTemplate, status, '----this is first' )
                // return
                
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

            // console.log(relevantTemplate,status, '----this is first' )
            // return

            sendEmailFunction(data, res, status, relevantTemplate)

            return res.json({
                status: "FAILED",
                message: "An error occured while saving details"
            })
        })
        return
    }
}

const updateParticularCurrencyBalances = async (amount, currency, balanceForAdditionalCurrencies, addOrSubtract, data = {}) => {
    balanceForAdditionalCurrencies.forEach((item) => {
        if (item.currencyShortCode == currency) {
            if (addOrSubtract == 'add') {
                item.balance = +item.balance + +amount;
            } else {
                // console.log(+item.balance, 'before')
                item.balance = +item.balance - +amount;
                // console.log(+item.balance , amount, 'got here update currency function correct')
                // return
                //add to escrow account
                // if (data.transactionName == "escrow" && data.transactionParty == "Buyer") {

                // }
            }
        }
    });
    return balanceForAdditionalCurrencies.sort((a, b) => b.balance - a.balance);
};

async function redeemTransaction(transaction, res = null) {
    // console.log(transaction.transactionId, '--------jjj')
    // return
    if (transaction.status === 'complete' ||
        transaction.status === 'cancelled' ||
        transaction.status === 'pending' ||
        transaction.status === 'redeemed'
    ) {
        const response = {
            status: "FAILED",
            message: "This transaction cannot be redeemed"
        };
        return res ? res.json(response) : response;
    }

    if (transaction.transactionParty == "Buyer") {
        // console.log('i am here buyer')
        try {
            let buyerTransaction = await Transaction.findOne( {transactionId: transaction.transactionId})
            let sellerTransaction = await Transaction.findOne( {transactionId: transaction.secondLegTransactionId})

            if ( buyerTransaction.buyerEscrowStatus !== "buyer-redeemed" ) {
                buyerTransaction.buyerEscrowStatus = "buyer-redeemed";
                buyerTransaction.lastUpdated = new Date();
                buyerTransaction.save();
            }

            if (sellerTransaction.buyerEscrowStatus = "buyer-redeemed") {
                sellerTransaction.buyerEscrowStatus = "buyer-redeemed";
                sellerTransaction.lastUpdated = new Date();
                sellerTransaction.save();
            }

            if (sellerTransaction.sellerEscrowStatus !== "seller-redeemed") {
                return res.json({
                    status: "success",
                    message: "Buyer has redeemed transaction, waiting for the seller",
                    data: buyerTransaction
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (transaction.transactionParty == "Seller") {
        // console.log('i am inside here seller')
        try {
            let sellerTransaction = await Transaction.findOne( {transactionId: transaction.transactionId})
            let buyerTransaction = await Transaction.findOne( {transactionId: transaction.secondLegTransactionId})//also update on the buyer sde

            if ( sellerTransaction.sellerEscrowStatus !== "seller-redeemed") {
                sellerTransaction.sellerEscrowStatus = "seller-redeemed";
                sellerTransaction.lastUpdated = new Date();
                sellerTransaction.save();
            }

            if (buyerTransaction.sellerEscrowStatus !== "seller-redeemed") {
                buyerTransaction.sellerEscrowStatus = "seller-redeemed";
                buyerTransaction.lastUpdated = new Date();
                buyerTransaction.save();
            }
            
            if ( buyerTransaction.buyerEscrowStatus !== "buyer-redeemed" ) {
                return res.json({
                    status: "success",
                    message: "Seller has redeemed transaction, waiting for the buyer",
                    data: sellerTransaction
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    // console.log(transaction.transactionId,'--transation')
    // return
    let firstLegTransaction = await Transaction.findOne( {transactionId: transaction.transactionId})
    let secondLegTransaction = await Transaction.findOne( {transactionId: transaction.secondLegTransactionId} )
    // console.log(firstLegTransaction, secondLegTransaction, '--transationffff')
    // return
    if (firstLegTransaction.buyerEscrowStatus == "buyer-redeemed" && firstLegTransaction.sellerEscrowStatus == "seller-redeemed"
        || (secondLegTransaction.buyerEscrowStatus == "buyer-redeemed" || secondLegTransaction.sellerEscrowStatus == "seller-redeemed")
       ) {
           console.log('all parties redeemed here')
           let buyerTransactionId;
           let sellerTransactionId;
           let firstLegTransactionId;
           let secondLegTransactionId;
           let balanceForAdditionalCurrenciesBuyer;
           let balanceForAdditionalCurrenciesSeller;
           // console.log('i am here')
           // return;
           //this code is useless because before getting here, this should always be already second leg.
           if (transaction.transactionType == "FirstLeg" || transaction.transactionLeg == "FirstLeg") {
               firstLegTransactionId = transaction.transactionId
               secondLegTransactionId = transaction.secondLegTransactionId
           } else if (transaction.transactionType == "SecondLeg" || transaction.transactionLeg == "SecondLeg") {
               firstLegTransactionId = transaction.secondLegTransactionId
               secondLegTransactionId = transaction.transactionId
           }
   
           // console.log(firstLegTransactionId, secondLegTransactionId);
           // return
   
           if ( transaction.transactionParty == "Buyer" ) {
               let buyerDetails = await getCurrentUserDetails(transaction, undefined, 1, {email: transaction.email}, res);
               balanceForAdditionalCurrenciesBuyer = buyerDetails.balanceForAdditionalCurrencies;
               buyerTransactionId = transaction.transactionId
               let sellerDetails = await getCurrentUserDetails(transaction, undefined, 1, {email: transaction.secondPartyEmail}, res);
               balanceForAdditionalCurrenciesSeller = sellerDetails.balanceForAdditionalCurrencies;
               sellerTransactionId = transaction.secondLegTransactionId
           } else if(transaction.transactionParty == "Seller" ) {
               let sellerDetails= await getCurrentUserDetails(transaction, undefined, 1, {email: transaction.email}, res);
               balanceForAdditionalCurrenciesSeller = sellerDetails.balanceForAdditionalCurrencies;
               sellerTransactionId = transaction.transactionId
               let buyerDetails = await getCurrentUserDetails(transaction, undefined, 1, {email: transaction.secondPartyEmail}, res);
               balanceForAdditionalCurrenciesBuyer = buyerDetails.balanceForAdditionalCurrencies;
               buyerTransactionId = transaction.secondLegTransactionId
           }
   
           // console.log(buyerTransactionId, sellerTransactionId, balanceForAdditionalCurrenciesBuyer, balanceForAdditionalCurrenciesSeller, '-------hhhhhhhh')
           // return
           //debit the escrow accounting
           let credittEscrowAccountEntry = await EscrowAccount.findOne({reference: firstLegTransactionId})
           const latestEscrowEntry = await EscrowAccount.findOne().sort({ transactionDate: -1 });
           credittEscrowAccountEntry.status = "redeemed";
   
           credittEscrowAccountEntry.save()
   
           const latestEscrowEntryBalanceForAdditionalCurrencies = await updateParticularCurrencyBalances(
               credittEscrowAccountEntry.amount,
               credittEscrowAccountEntry.currency,
               latestEscrowEntry.balanceForAdditionalCurrencies, 
               'subtract'
           )
   
           // console.log( latestEscrowEntryBalanceForAdditionalCurrencies , '-------xxxxxx')
           // return
   
           const debitEscrowAccount = new EscrowAccount({
               transactionType: transaction.TransactionType,
               email: transaction.email,
               amount: transaction.amount,
               reference: transaction.transactionId,
               currency: transaction.transactionCurrency,
               transactionDate: new Date(),
               isDebitOrCredit: 'debit',
               status: 'redeemed',
               balanceForAdditionalCurrencies: latestEscrowEntryBalanceForAdditionalCurrencies,         
           })
   
           // console.log('||||----->', credittEscrowAccountEntry, '----->', debitEscrowAccount, '------>', latestEscrowEntryBalanceForAdditionalCurrencies , '-------xxxxxx')
           // return
   
           await debitEscrowAccount.save().catch(err => console.error(err));
   
           const balanceForAdditionalCurrenciesBuyerToUpdate = await updateParticularCurrencyBalances(
                (+transaction.originalAmount + +transaction.deliveryFee),
               transaction.transactionCurrency,
               balanceForAdditionalCurrenciesBuyer,
               'subtract'
           )
   
           const updateBuyer = {
               transactionId: buyerTransactionId,
               update: {
                   status: 'redeemed',
                   lastUpdated: new Date(),
                   balanceForAdditionalCurrencies: balanceForAdditionalCurrenciesBuyerToUpdate
               }
           }
   
           const balanceForAdditionalCurrenciesSellerToUpdate = await updateParticularCurrencyBalances(
                (+transaction.originalAmount + +transaction.deliveryFee),
                transaction.transactionCurrency,
                balanceForAdditionalCurrenciesSeller,
                'add'
           )
   
           const updateSeller = {
               transactionId: sellerTransactionId,
               update: {
                   status: 'redeemed',
                   lastUpdated: new Date(),
                   balanceForAdditionalCurrencies: balanceForAdditionalCurrenciesSellerToUpdate
               }
           }
   
           const transactionsUpdates = [ updateBuyer, updateSeller ];
   
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

async function cancelTransaction(transaction, res=null) {
    if (transaction.status === 'complete' ||
        transaction.status === 'cancelled' ||
        transaction.status === 'pending' ||
        transaction.status === 'redeemed'
    ) {
        const response = {
            status: "FAILED",
            message: "This transaction cannot be cancelled"
        };
        return res ? res.json(response) : response;
    }
    
    if (transaction.transactionParty == "Buyer") {
        // console.log('i am here buyer')
        try {
            let buyerTransaction = await Transaction.findOne( {transactionId: transaction.transactionId})
            let sellerTransaction = await Transaction.findOne( {transactionId: transaction.secondLegTransactionId})

            if ( buyerTransaction.buyerEscrowStatus !== "buyer-cancelled" ) {
                buyerTransaction.buyerEscrowStatus = "buyer-cancelled";
                buyerTransaction.lastUpdated = new Date();
                buyerTransaction.save();
            }

            if (sellerTransaction.buyerEscrowStatus = "buyer-cancelled") {
                sellerTransaction.buyerEscrowStatus = "buyer-cancelled";
                sellerTransaction.lastUpdated = new Date();
                sellerTransaction.save();
            }

            if (sellerTransaction.sellerEscrowStatus !== "seller-cancelled") {
                return res.json({
                    status: "success",
                    message: "Buyer has cancelled transaction, waiting for the seller",
                    data: buyerTransaction
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (transaction.transactionParty == "Seller") {
        // console.log('i am inside here seller')
        try {
            let sellerTransaction = await Transaction.findOne( {transactionId: transaction.transactionId})
            let buyerTransaction = await Transaction.findOne( {transactionId: transaction.secondLegTransactionId})//also update on the buyer sde

            if ( sellerTransaction.sellerEscrowStatus !== "seller-cancelled") {
                sellerTransaction.sellerEscrowStatus = "seller-cancelled";
                sellerTransaction.lastUpdated = new Date();
                sellerTransaction.save();
            }

            if (buyerTransaction.sellerEscrowStatus !== "seller-cancelled") {
                buyerTransaction.sellerEscrowStatus = "seller-cancelled";
                buyerTransaction.lastUpdated = new Date();
                buyerTransaction.save();
            }
            
            if ( buyerTransaction.buyerEscrowStatus !== "buyer-cancelled" ) {
                return res.json({
                    status: "success",
                    message: "Seller has cancelled transaction, waiting for the buyer",
                    data: sellerTransaction
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    let firstLegTransaction = await Transaction.findOne( {transactionId: transaction.transactionId})
    let secondLegTransaction = await Transaction.findOne( {transactionId: transaction.secondLegTransactionId} )

    if (firstLegTransaction.buyerEscrowStatus == "buyer-cancelled" && firstLegTransaction.sellerEscrowStatus == "seller-cancelled"
     || (secondLegTransaction.buyerEscrowStatus == "buyer-cancelled" || secondLegTransaction.sellerEscrowStatus == "seller-cancelled")
    ) {
        console.log('all parties cancenled here')
        let buyerTransactionId;
        let sellerTransactionId;
        let firstLegTransactionId;
        let secondLegTransactionId;
        let balanceForAdditionalCurrenciesBuyer;
        let balanceForAdditionalCurrenciesSeller;
        // console.log('i am here')
        // return;
        //this code is useless because before getting here, this should always be already second leg.
        if (transaction.transactionType == "FirstLeg" || transaction.transactionLeg == "FirstLeg") {
            firstLegTransactionId = transaction.transactionId
            secondLegTransactionId = transaction.secondLegTransactionId
        } else if (transaction.transactionType == "SecondLeg" || transaction.transactionLeg == "SecondLeg") {
            firstLegTransactionId = transaction.secondLegTransactionId
            secondLegTransactionId = transaction.transactionId
        }

        // console.log(firstLegTransactionId, secondLegTransactionId);
        // return

        if ( transaction.transactionParty == "Buyer" ) {
            let buyerDetails = await getCurrentUserDetails(transaction, undefined, 1, {email: transaction.email}, res);
            balanceForAdditionalCurrenciesBuyer = buyerDetails.balanceForAdditionalCurrencies;
            buyerTransactionId = transaction.transactionId
            let sellerDetails = await getCurrentUserDetails(transaction, undefined, 1, {email: transaction.secondPartyEmail}, res);
            balanceForAdditionalCurrenciesSeller = sellerDetails.balanceForAdditionalCurrencies;
            sellerTransactionId = transaction.secondLegTransactionId
        } else if(transaction.transactionParty == "Seller" ) {
            let sellerDetails= await getCurrentUserDetails(transaction, undefined, 1, {email: transaction.email}, res);
            balanceForAdditionalCurrenciesSeller = sellerDetails.balanceForAdditionalCurrencies;
            sellerTransactionId = transaction.transactionId
            let buyerDetails = await getCurrentUserDetails(transaction, undefined, 1, {email: transaction.secondPartyEmail}, res);
            balanceForAdditionalCurrenciesBuyer = buyerDetails.balanceForAdditionalCurrencies;
            buyerTransactionId = transaction.secondLegTransactionId
        }

        // console.log(buyerTransactionId, sellerTransactionId, balanceForAdditionalCurrenciesBuyer, balanceForAdditionalCurrenciesSeller, '-------hhhhhhhh')
        // return
        //debit the escrow accounting
        let credittEscrowAccountEntry = await EscrowAccount.findOne({reference: firstLegTransactionId})
        const latestEscrowEntry = await EscrowAccount.findOne().sort({ transactionDate: -1 });
        credittEscrowAccountEntry.status = "cancelled";

        credittEscrowAccountEntry.save()

        const latestEscrowEntryBalanceForAdditionalCurrencies = await updateParticularCurrencyBalances(
            credittEscrowAccountEntry.amount,
            credittEscrowAccountEntry.currency,
            latestEscrowEntry.balanceForAdditionalCurrencies, 
            'subtract'
        )

        // console.log( latestEscrowEntryBalanceForAdditionalCurrencies , '-------xxxxxx')
        // return

        const debitEscrowAccount = new EscrowAccount({
            transactionType: transaction.TransactionType,
            email: transaction.email,
            amount: transaction.amount,
            reference: transaction.transactionId,
            currency: transaction.transactionCurrency,
            transactionDate: new Date(),
            isDebitOrCredit: 'debit',
            status: 'cancelled',
            balanceForAdditionalCurrencies: latestEscrowEntryBalanceForAdditionalCurrencies,         
        })

        // console.log('||||----->', credittEscrowAccountEntry, '----->', debitEscrowAccount, '------>', latestEscrowEntryBalanceForAdditionalCurrencies , '-------xxxxxx')
        // return

        await debitEscrowAccount.save().catch(err => console.error(err));

        const balanceForAdditionalCurrenciesBuyerToUpdate = await updateParticularCurrencyBalances(
            transaction.isDeliveryDeductable ? (+transaction.originalAmount - +transaction.deliveryFee) 
            : +transaction.originalAmount,
            transaction.transactionCurrency,
            balanceForAdditionalCurrenciesBuyer,
            'add'
        )

        const updateBuyer = {
            transactionId: buyerTransactionId,
            update: {
                status: 'cancelled',
                lastUpdated: new Date(),
                balanceForAdditionalCurrencies: balanceForAdditionalCurrenciesBuyerToUpdate
            }
        }

        const balanceForAdditionalCurrenciesSellerToUpdate = await updateParticularCurrencyBalances(
            transaction.isDeliveryDeductable ?  +transaction.deliveryFee : 0,
            transaction.transactionCurrency,
            balanceForAdditionalCurrenciesSeller,
            'add'
        )

        const updateSeller = {
            transactionId: sellerTransactionId,
            update: {
                status: 'cancelled',
                lastUpdated: new Date(),
                balanceForAdditionalCurrencies: balanceForAdditionalCurrenciesSellerToUpdate
            }
        }

        const transactionsUpdates = [ updateBuyer, updateSeller ];

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
                sendEmailFunction(transaction, res, 'success', cancelTransactionTemplate);
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

    if (data.transactionName == "escrow" && data.transactionType == "SecondLeg") {
        // console.log('we are inside here ooooo')
        return data
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
        mainTransactionUpdateAction,
    )

    data.balanceForAdditionalCurrencies = updatedBalanceForAdditionalCurrencyForMainTransaction;
    console.log(data.transactionName, data.transactionParty, data.transactionParty, '---i got here')

        //add to corresponding escrow account is this is an escrow account
    if (data.transactionName == "escrow" && data.transactionParty == "Buyer" && data.transactionType == "FirstLeg") {
        // console.log('i got here')
        // return
         //add to escrow accoun 
        const latestEscrowAccountEntry = await EscrowAccount.findOne().sort({ transactionDate: -1 });

        const latestEscrowAccountBalanceForAdditionalCurrency = latestEscrowAccountEntry ? latestEscrowAccountEntry.balanceForAdditionalCurrencies : 
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
    
        const updatedBalanceForAdditionalCurrencyForEscrow = await updateParticularCurrencyBalances(
            data.originalAmount,
            data.transactionCurrency,
            latestEscrowAccountBalanceForAdditionalCurrency,
            'add'
        );
        // data.totalTransactionAmount -= feeAmount
        const escrowEntry = new EscrowAccount({
            transactionType: data.transactionType,
            email: data.email,
            amount: data.originalAmount,
            reference: data.transactionId,
            currency: data.transactionCurrency,
            balance: 0,
            isDebitOrCredit: 'credit',
            status: 'open',
            transactionDate: new Date(),
            balanceForAdditionalCurrencies: updatedBalanceForAdditionalCurrencyForEscrow,
        });  
        
        await escrowEntry.save().catch(err => console.error(err));
    } 

    return data;
}

async function redeemTransactionForCron(transaction, res = null) {
    if (transaction.status === 'complete' ||
        transaction.status === 'cancelled' ||
        transaction.status === 'pending' ||
        transaction.status === 'redeemed'
    ) {
        const response = {
            status: "FAILED",
            message: "This transaction cannot be redeemed"
        };
        console.log(response)
        return res ? res.json(response) : response;
    }

    
    let firstLegTransaction = await Transaction.findOne( {transactionId: transaction.transactionId})
    let secondLegTransaction = await Transaction.findOne( {transactionId: transaction.secondLegTransactionId} )
    // console.log(firstLegTransaction, secondLegTransaction, '--transationffff')
    // return
    console.log('all parties redeemed here')
    let buyerTransactionId;
    let sellerTransactionId;
    let firstLegTransactionId;
    let secondLegTransactionId;
    let balanceForAdditionalCurrenciesBuyer;
    let balanceForAdditionalCurrenciesSeller;
    // console.log('i am here')
    // return;
    //this code is useless because before getting here, this should always be already second leg.
    if (transaction.transactionType == "FirstLeg" || transaction.transactionLeg == "FirstLeg") {
        firstLegTransactionId = transaction.transactionId
        secondLegTransactionId = transaction.secondLegTransactionId
    } else if (transaction.transactionType == "SecondLeg" || transaction.transactionLeg == "SecondLeg") {
        firstLegTransactionId = transaction.secondLegTransactionId
        secondLegTransactionId = transaction.transactionId
    }
    // console.log(firstLegTransactionId, secondLegTransactionId);
    // return
    if ( transaction.transactionParty == "Buyer" ) {
        let buyerDetails = await getCurrentUserDetails(transaction, undefined, 1, {email: transaction.email}, res);
        balanceForAdditionalCurrenciesBuyer = buyerDetails.balanceForAdditionalCurrencies;
        buyerTransactionId = transaction.transactionId
        let sellerDetails = await getCurrentUserDetails(transaction, undefined, 1, {email: transaction.secondPartyEmail}, res);
        balanceForAdditionalCurrenciesSeller = sellerDetails.balanceForAdditionalCurrencies;
        sellerTransactionId = transaction.secondLegTransactionId
    } else if(transaction.transactionParty == "Seller" ) {
        let sellerDetails= await getCurrentUserDetails(transaction, undefined, 1, {email: transaction.email}, res);
        balanceForAdditionalCurrenciesSeller = sellerDetails.balanceForAdditionalCurrencies;
        sellerTransactionId = transaction.transactionId
        let buyerDetails = await getCurrentUserDetails(transaction, undefined, 1, {email: transaction.secondPartyEmail}, res);
        balanceForAdditionalCurrenciesBuyer = buyerDetails.balanceForAdditionalCurrencies;
        buyerTransactionId = transaction.secondLegTransactionId
    }
    
    let credittEscrowAccountEntry = await EscrowAccount.findOne({reference: firstLegTransactionId})
    const latestEscrowEntry = await EscrowAccount.findOne().sort({ transactionDate: -1 });
    credittEscrowAccountEntry.status = "redeemed";

    credittEscrowAccountEntry.save()

    const latestEscrowEntryBalanceForAdditionalCurrencies = await updateParticularCurrencyBalances(
        credittEscrowAccountEntry.amount,
        credittEscrowAccountEntry.currency,
        latestEscrowEntry.balanceForAdditionalCurrencies, 
        'subtract'
    )
    // console.log( latestEscrowEntryBalanceForAdditionalCurrencies , '-------xxxxxx')
    // return

    const debitEscrowAccount = new EscrowAccount({
        transactionType: transaction.TransactionType,
        email: transaction.email,
        amount: transaction.amount,
        reference: transaction.transactionId,
        currency: transaction.transactionCurrency,
        transactionDate: new Date(),
        isDebitOrCredit: 'debit',
        status: 'redeemed',
        balanceForAdditionalCurrencies: latestEscrowEntryBalanceForAdditionalCurrencies,         
    })

    // console.log('||||----->', credittEscrowAccountEntry, '----->', debitEscrowAccount, '------>', latestEscrowEntryBalanceForAdditionalCurrencies , '-------xxxxxx')
    // return

    await debitEscrowAccount.save().catch(err => console.error(err));

    const balanceForAdditionalCurrenciesBuyerToUpdate = await updateParticularCurrencyBalances(
        (+transaction.originalAmount + +transaction.deliveryFee),
        transaction.transactionCurrency,
        balanceForAdditionalCurrenciesBuyer,
        'subtract'
    )

    const updateBuyer = {
        transactionId: buyerTransactionId,
        update: {
            status: 'redeemed',
            lastUpdated: new Date(),
            balanceForAdditionalCurrencies: balanceForAdditionalCurrenciesBuyerToUpdate,
            sellerEscrowStatus: "seller-redeemed",
            buyerEscrowStatus: "buyer-redeemed",
        }
    }

    const balanceForAdditionalCurrenciesSellerToUpdate = await updateParticularCurrencyBalances(
        (+transaction.originalAmount + +transaction.deliveryFee),
        transaction.transactionCurrency,
        balanceForAdditionalCurrenciesSeller,
        'add'
    )

    const updateSeller = {
        transactionId: sellerTransactionId,
        update: {
            status: 'redeemed',
            lastUpdated: new Date(),
            balanceForAdditionalCurrencies: balanceForAdditionalCurrenciesSellerToUpdate,
            sellerEscrowStatus: "seller-redeemed",
            buyerEscrowStatus: "buyer-redeemed",
        }
    }

    const transactionsUpdates = [ updateBuyer, updateSeller ];

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
            const response = {
                status: "SUCCESS",
                message: "Transaction Completed, both party has confirmed status"
            };
            console.log(response)
            return res ? res.json(response) : response;
        }
    }).catch(err => console.error('Bulk update error:', err));
    
   
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

module.exports = {
    saveTransaction,
    getCurrentUserDetails,
    updateParticularCurrencyBalances,
    redeemTransaction,
    cancelTransaction,
    log,
    collectFeesAndUpdateParticularCurrencyBalances,
    redeemTransactionForCron,
}
