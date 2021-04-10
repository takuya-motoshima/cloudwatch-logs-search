const AWS = require('aws-sdk')
const moment = require('moment')

/**
 * Find logs from cloudwatch.
 * 
 * @param  {string} options.logGroupName: Log group name you want to find.
 * @param  {string} options.keyword: Keywords for filtering logs.
 * @param  {number} options.startTime: Search period start date. UnixTime milliseconds.The default is yesterday's 00:00:00.
 * @param  {number} options.endTime: Search period end date. UnixTime milliseconds.The default is yesterday at 23:59:59.
 */
module.exports = async (options = {}) => {
  try {
    // Initialize options.
    options = Object.assign({
      logGroupName: undefined,
      logStreamName: undefined,
      keyword: undefined,
      startTime: moment().add(-1, 'days').startOf('day').valueOf(),
      endTime: moment().add(-1, 'days').endOf('day').valueOf(),
      debug: false
    }, options);

    // assign AWS credentials here in following way.
    const result = require('dotenv').config({path: '.env'})
    if (result.error) throw result.error
    const credentials = result.parsed;
    AWS.config.update({
      accessKeyId: credentials.AWS_CLOUD_WATCH_LOGS_ACCESS_KEY,
      secretAccessKey: credentials.AWS_CLOUD_WATCH_LOGS_SECRET_KEY,
      region: credentials.AWS_CLOUD_WATCH_LOGS_REGION
    });

    // CloudWatch Logs instance.
    const cloudwatchlogs = new AWS.CloudWatchLogs({apiVersion: '2014-03-28'});

    // Get LogStreams.
    let streams = await (new Promise((resolve, reject) => {
      cloudwatchlogs.describeLogStreams({logGroupName: options.logGroupName}, (err, data) => {
        // an error occurred
        if (err) return void reject(err);
        // successful response
        resolve(data.logStreams);
      });
    }));

    // Get the start and end times of the previous day.
    console.log(`Start: ${moment(options.startTime).format('YYYY-MM-DD HH:mm:ss')}`);
    console.log(`End: ${moment(options.endTime).format('YYYY-MM-DD HH:mm:ss')}`);

    // Find the Nginx access log from a day ago.
    streams = streams.filter(stream => {
      // Filter by log stream name.
      if (options.logStreamName && stream.logStreamName.indexOf(options.logStreamName) === -1)
        return false;

      // Filtering by period.
      return !(stream.firstEventTimestamp < options.startTime && stream.lastEventTimestamp < options.startTime);
    });

    // End if there is no log of the previous day.
    if (!streams.length) return void console.log('There is no access log of the previous day.');

    // Debug found log stream.
    if (options.debug) {
      for (let {logStreamName, firstEventTimestamp, lastEventTimestamp} of streams) {
        console.log('==================================================');
        console.log(`logStreamName: ${logStreamName}`);
        console.log(`firstEventTimestamp: ${moment(firstEventTimestamp).format('YYYY-MM-DD HH:mm:ss')}`);
        console.log(`lastEventTimestamp: ${moment(lastEventTimestamp).format('YYYY-MM-DD HH:mm:ss')}`);
        console.log('==================================================');
      }
    }

    // Filter logs by keyword.
    let events = await (new Promise((resolve, reject) => {
      cloudwatchlogs.filterLogEvents({
       logGroupName: options.logGroupName,
       logStreamNames: streams.map(stream => stream.logStreamName),
       filterPattern: options.keyword ? `"${options.keyword}"` : undefined,
       limit: 10000,
       startTime: options.startTime,
       endTime: options.endTime
      }, (err, data) => {
        // an error occurred
        if (err) return void reject(err);
        // successful response
        resolve(data.events);
      });
    }));

    // // Debug found events.
    // for (let {timestamp, message} of events)
    //   console.log(`${moment(timestamp).format('YYYY-MM-DD HH:mm:ss')} -> message: ${message}`);

    // Return event log.
    return events.map(event => event.message);
  } catch (e) {
    console.error(e);
  }
}