var cron = require('node-cron');
var shell = require('shelljs');
const {redeemTransactionFunctionForCron} = require('./functions/redeemTransactionsForCron');
require('dotenv').config({ path: '../../../.env' })

cron.schedule('0,30 * * * * *', () => {
  // console.log(process.env.EMAIL_FOOTER_BANNER, '--ppp')
  console.log('running a task every  minute');
  redeemTransactionFunctionForCron();
  //COMMAND - node services/cron/cronjobs.js
  //OR CD INTO THE DIR AND RUN node cronjobs.js
});