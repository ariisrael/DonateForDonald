/**
  The worker will run a small script on a cron task
  We don't really care when it runs, we'll set it up to run
  every 10 minutes or every hour.

  It'll grab the latest tweets, upsert them into the database and then
  it will look through each new tweet to see if there are any triggers in it.

  Most of this will take place in the worker folder
**/

// if this is not production, load up the config from the .env file
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const createLogger = require('logging').default;
const log = createLogger('worker');


require('./workers')
