const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    email: String,
    phone: String,
    transactionId: String,
    transactionDate: Date,
    amount: Number,
    transactionType: String,
    date: Date,
    details: String,
    status: String,
    escrowStatus: {
        type: String,
        required: false,
    },
    balance: { 
        type: Number, 
        default: 0 
    },
    transactionName: String,
    lockedTransaction:  {
        type: Number,
        required: false,
    },
    unLockedTransaction:  {
        type: Number,
        required: false,
    },
    secondLegTransactionId: {
        type: String,
        required: false,
    },
    transactFromWallet: {
        type: String,
        required: false,
    },
    transactFromAddedFunds: {
        type: String,
        required: false,
    },
    accountNumber: {
        type: Number,
        required: false,
    },
    accountBank: {
        type: Number,
        required: false,
    },
    currency: {
        type: String,
        required: false,
    },
    transactionCurrency: {
        type: String,
        required: false,
    },
    amountDeductedFromSelectedCurrencyBalance :{
        type: String,
        required: false,
    },
    reference: {
        type: String,
        required: false
    },
    callbackUrl: {
        type: String,
        required: false
    },
    debitCurrency: {
        type: String,
        required: false
    },
    beneficiaryEmail: {
        type: String,
        required: false
    },
    beneficiary_country: {
        type: String,
        required: false
    },
    beneficiary_occupation: {
        type: String,
        required: false
    },
    recipient_address: {
        type: String,
        required: false
    },
    mobile_number: {
        type: Number,
        required: false
    },
    sender: {
        type: String,
        required: false
    },
    sender_country: {
        type: String,
        required: false
    },
    sender_id_number: {
        type: String,
        required: false
    },
    sender_id_type: {
        type: String,
        required: false
    },
    sender_id_expiry: {
        type: Date,
        required: false
    },
    sender_mobile_number: {
        type: Number,
        required: false
    },
    sender_mobile_number: {
        type: Number,
        required: false
    },
    sender_occupation: {
        type: String,
        required: false
    },
    sender_beneficiary_relationship: {
        type: String,
        required: false
    },
    transfer_purpose: {
        type: String,
        required: false
    },
    destination_branch_code: {
        type: String,
        required: false
    },
    beneficiary_name: {
        type: String,
        required: false
    },
    AccountNumber: {
        type: String,
        required: false
    },
    RoutingNumber: {
        type: String,
        required: false
    },
    SwiftCode: {
        type: String,
        required: false
    },
    BankName: {
        type: String,
        required: false
    },
    BeneficiaryName: {
        type: String,
        required: false
    },
    BeneficiaryAddress: {
        type: String,
        required: false
    },
    BeneficiaryCountry: {
        type: String,
        required: false
    },
    PostalCode: {
        type: String,
        required: false
    },
    StreetNumber: {
        type: String,
        required: false
    },
    StreetName: {
        type: String,
        required: false
    },
    City: {
        type: String,
        required: false
    },
    first_name: {
        type: String,
        required: false
    },
    last_name: {
        type: String,
        required: false
    },
    virtualCardId: {
        type: String,
        required: false
    },
    account_id: {
        type: String,
        required: false
    },
    card_hash: {
        type: String,
        required: false
    },
    masked_pan: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    address_1: {
        type: String,
        required: false
    },
    address_2: {
        type: String,
        required: false
    },
    zip_code: {
        type: String,
        required: false
    },
    cvv: {
        type: String,
        required: false
    },
    expiration: {
        type: String,
        required: false
    },
    send_to: {
        type: String,
        required: false
    },
    bin_check_name: {
        type: String,
        required: false
    },
    card_type: {
        type: String,
        required: false
    },
    name_on_card: {
        type: String,
        required: false
    },
    created_at: {
        type: String,
        required: false
    },
    is_active: {
        type: Boolean,
        required: false
    },
    callback_url: {
        type: String,
        required: false
    },
    data: {
        type: Object,
        required: false
    },
    virtualCardEvent: {
        type: Object,
        required: false
    },
    shouldCharge: {
        type: Boolean,
        required: false
    },
    transactionFeesAmountDetails: {
        type: Object,
        required: true
    },
    originalAmount: {
        type: Number,
        required: false
    },
    totalTransactionAmount: {
        type: Number,
        required: false
    },
    // balanceForAdditionalCurrencies: {
    //     type: Array,
    //     required: false
    // },
    balanceForAdditionalCurrencies: 
    {
        type: [{
            country: String,
            balance: Number,
            currencyShortCode: String,
            currencySymbol: String
        }],
        required: false,
        default: [
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
    },
    meta: {
        type: Array,
        required: false
    },
    lastUpdated: {
        type: Date,
        required: false 
    },
    redemptionDate: {
        type: Date,
        required: false
    },
    transactionCurrency: {
        type: String,
        required: false
    },
    transactionParty: {
        type: String,
        required: false
    },
    secondPartyPhone: {
        type: String,
        required: false
    },
    secondPartyEmail: {
        type: String,
        required: false
    },
    mainBalanceAfterTransaction: {
        type: Number,
        required: false
    },
    mainBalanceBeforeTransaction: {
        type: Number,
        required: false
    },
    transactionDate: {
        type: Date,
        required: false
    },
    transactionLastUpdated: {
        type: Date,
        required: false
    }

})

const Transaction = mongoose.model('Transaction', TransactionSchema)

module.exports = Transaction;