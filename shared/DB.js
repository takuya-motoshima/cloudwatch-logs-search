const mysql = require('mysql');

/**
 * DB class.
 */
module.exports =  new class {
  /**
   * Generate DB connection instance.
   */
  constructor() {
    this.conn = mysql.createConnection({
      host: process.env.RDS_HOST,
      user: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DATABASE
    });
  }

  /**
   * Connect to DB.
   */
  async connect() {
    return new Promise((resolve, reject) => {
      this.conn.connect(err => {
        if (err)
          return void reject(new Error(`DB connection error: ${err.stack}`));
        console.log(`Connected as id ${this.conn.threadId}`);
        resolve();
      });
    });
  }

  /**
   * Disconnect DB.
   */
  async disconnect() {
    return new Promise((resolve, reject) => {
      if (!this.conn)
        return void reject(new Error('Not connected to DB.'));
      this.conn.end(err => {
        // The connection is terminated now 
        if (err)
          return void reject(new Error(`DB disconnect error: ${err.stack}`));
        console.log('Connection ended');
        resolve();
      });
    });
  }

  /**
   * Execute a query and return the result.
   */
  async select(query) {
    console.log(`SQL: ${query}`);
    return new Promise((resolve, reject) => {
      this.conn.query(query, (err, results) => {
        // // When done with the connection, release it.
        // this.conn.release();

        // Handle error after the release.
        if(err) return void reject(err);
        resolve(Object.values(JSON.parse(JSON.stringify(results))));
      });
    });
  }
}