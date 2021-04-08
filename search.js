const findCloudWatchLogs = require('./src/findCloudWatchLogs.js')

// Main processing.
// Get log groups and keywords from arguments.
if (process.argv.length < 3)
  throw new Error('There is no log group name in the argument.');

// Search log.
(async () => {
  const logs = await findCloudWatchLogs({
    logGroupName: process.argv[2],
    keyword: process.argv[3] || undefined
  });
})();