# cloudwatch-logs-search

This is sample logic that filters and retrieves logs from Amazon CloudWatch.

## Reference
- https://wp-kyoto.net/get-cloudwatchlogs-data-by-javascript/
- https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/awscloudtrail-ug.pdf
- https://business.ntt-east.co.jp/content/cloudsolution/column-try-28.html#section-04

## Getting Started

Install package.  

```sh
npm i cloudwatch-logs-search;
```

Install dependent packages.  

```sh
cd cloudwatch-logs-search;
npm i;
```

Add your Amazon CloudWatch Logs credentials to your environment variables.  

.env:  

```text
NODE_ENV=development
AWS_CLOUD_WATCH_LOGS_REGION=ap-northeast-1
AWS_CLOUD_WATCH_LOGS_ACCESS_KEY=****
AWS_CLOUD_WATCH_LOGS_SECRET_KEY=********
```

Search logs.  

The log group name is an exact match search and the log stream name is an fuzzy search.  

```sh
node search.js 'Log group name' 'Log stream name';
```

## Usage

How to use search.js.  

Gets all logs from the stream that contains the specified log stream name..  

```sh
node search.js 'Log group name' 'Log stream name';
```

Gets the log that matches the keyword from the stream that contains the specified log stream name..  

```sh
node search.js 'Log group name' 'Log stream name' 'keyword';
```

## License

[MIT licensed](./LICENSE.txt)