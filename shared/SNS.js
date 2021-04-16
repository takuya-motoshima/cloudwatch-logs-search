const AWS = require('aws-sdk');

/**
 * SNS notification client.
 */
module.exports = new class {
  /**
   * Generate a SNS client instance.
   */
  constructor() {
    this.client = new AWS.SNS({apiVersion: '2010-03-31'});
  }

  /**
   * Send a message to SNS.
   */
  async postMessage(message) {
  // async postMessage(subject, message) {
    return new Promise((resolve, reject) => {
      this.client.publish({
        // Subject: subject,
        Message: message,
        TopicArn: process.env.SNS_TOPIC_ARN
      })
        .promise()
        .then(data => {
          console.log(`Message "${message.length > 30 ? message.slice(0, 30) + '...' : message}" sent to the topic ${process.env.SNS_TOPIC_ARN}`);
          console.log(`MessageID is ${data.MessageId}`);
          resolve(data);
        })
        .catch(err => reject(err));
    });
  }
}