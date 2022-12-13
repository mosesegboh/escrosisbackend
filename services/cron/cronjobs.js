var cron = require('node-cron');
var shell = require('');

cron.schedule('*/30 * * * *', () => {
  console.log('running a task every 30  minute');
  //COMMAND - node services/cron/cronjobs.js
  //OR CD INTO THE DIR AND RUN node cronjobs.js
});