const Cloudwatch = require('./shared/Cloudwatch');

// Main processing.
// Get log groups and keywords from arguments.
if (process.argv.length < 4)
  throw new Error('The log group name and log stream name of the argument are required.');

// Search log.
(async () => {
  // Find logs from cloudwatch.
  const logs = await Cloudwatch.find({
    logGroupName: process.argv[2],
    logStreamName: process.argv[3],
    keyword: process.argv[4] || undefined,
    debug: true
  });
  for (let log of logs) console.log(log);
})();