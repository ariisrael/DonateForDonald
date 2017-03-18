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

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();

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

app.set('port', (process.env.PORT || 5000));

app.set('views', './views');
const hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    ifeq(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    toJSON(object) {
      return JSON.stringify(object);
    },
  },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// import the config
require('./config/web');
require('./routes');

app.listen(app.get('port'), () => `Node app is running on port ${app.get('port')}`);
