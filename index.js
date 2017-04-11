const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const path = require('path');
const expressValidator = require('express-validator');
const exphbs = require('express-handlebars');
const flash = require('express-flash');
const compression = require('compression');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const _ = require('lodash');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();

app.set('port', (process.env.PORT || 5000));
if (process.env.NODE_ENV !== 'production') {
  app.set('base_url', 'localhost:' + app.get('port'))
} else if (process.env.BASE_URL) {
  app.set('baseUrl', process.env.BASE_URL)
} else {
  app.set('base_url', 'https://hackthecyber.herokuapp.com/')
}

module.exports = app;

app.use(morgan('combined'));
app.use(compression());
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.set('views', './views');
const handlebars = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    ifeq: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    toJSON: function(object) {
      return JSON.stringify(object);
    },
    if_not: function(a, options) {
      if (!a || _.isEmpty(a)) {
        return options.fn(this)
      }
    }
  },
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// import the config
require('./config/web');
require('./routes');

app.listen(app.get('port'), () => `Node app is running on port ${app.get('port')}`);
