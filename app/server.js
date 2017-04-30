/**
* Separate out the server so that the app and associated
* utilities can be imported by the worker without starting the server
**/

const createLogger = require('logging').default;
const log = createLogger('app/server');

var app = require('./app')

// import the config
require('../config/web');
require('../routes');

app.listen(app.get('port'), () => `Node app is running on port ${app.get('port')}`);
