require('dotenv').config({ path: '../../../../.env' })
const mongoose = require('mongoose');
const Transaction = require('../../../models/Transaction')
const {redeemTransactionForCron} = require('../../../functions/process')
const nodemailer = require('nodemailer')
const {log} = require('../../../functions/process')

const redeemTransactionFunctionForCron = async  () => {
  // console.log(process.env.EMAIL_FOOTER_BANNER, '------')
  // return
  try {
    mongoose.connect('mongodb+srv://admin:dangerman@cluster0.z9v9j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(()=>{
      console.log('Connected to db')
    }).catch((err)=>console.log(err))

    const currentDate = new Date();
    console.log(currentDate, '----')

     // Define start and end of the target day
     const startOfDay = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 0, 0, 0)); // Midnight UTC
     const endOfDay = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 23, 59, 59, 999)); // End of day UTC
 
     console.log(startOfDay, '--start of day (UTC)');
     console.log(endOfDay, '--end of day (UTC)');
 
     // Query transactions for the target date
     let transactions = await Transaction.find({
       transactionDate: {
         $gte: startOfDay,  // Greater than or equal to start of day
         $lte: endOfDay     // Less than or equal to end of day
       },
       status: 'locked'
     });

     log(transactions);

    if (transactions.length > 1) {
      transactions.forEach((transactionToRedeem) => {
        console.log('inside here ooo')
        redeemTransactionForCron(transactionToRedeem)
        
      });
    }else{
      console.log('Something went wrong in transaction first leg')
    }  
  } catch(error) {
    console.log(error);
  }
}

module.exports = {redeemTransactionFunctionForCron} 