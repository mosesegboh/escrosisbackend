const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionFeeSchema = new Schema({
    transactionType: String,
    email: String,
    amount: Number,
    reference: String,
    currency: String,
    balance: Number,
    transactionDate: Date,
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
})

const TransactionFee = mongoose.model('TransactionFee', TransactionFeeSchema)

module.exports = TransactionFee;
