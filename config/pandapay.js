const PANDAPAY = {};

// Development credentials visible as hard-coded strings
if (process.env.NODE_ENV !== 'production' && !process.env.PANDAPAY_TEST_PUBLISHABLE) {
  PANDAPAY.test = {
    public: 'pk_test_DGoDgSY4_9eNPYwXWQyNKg',
    private: 'sk_test_2ElhvVFwsUqON-dp1OXc1Q'
  }
  PANDAPAY.live = {
    public: 'pk_live_zEQoZMWAaebfAhAm1gOCMw',
    private: 'sk_live_YaBflYc3l6Fsq_Xo7N0QAg'
  }
}
// Production: credentials private as node environment variables
else {
  PANDAPAY.test = {
    public: process.env.PANDAPAY_TEST_PUBLISHABLE,
    private: process.env.PANDAPAY_TEST_SECRET
  }
  PANDAPAY.live = {
    public: process.env.PANDAPAY_LIVE_PUBLISHABLE,
    private: process.env.PANDAPAY_LIVE_SECRET
  }
}

// Src url to include PandaPay script (generating customer token)
PANDAPAY.src = 'https://d2t45z63lq9zlh.cloudfront.net/panda-v0.0.5.min.js';
PANDAPAY.fee = '47'; // Platform fee in credentials
PANDAPAY.currency = 'usd';

module.exports = PANDAPAY;
