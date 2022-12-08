var cron = require('node-cron');
var shell = require('');

cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});