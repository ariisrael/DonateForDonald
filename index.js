if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

var express = require('express')
var morgan = require('morgan')
var favicon = require('serve-favicon')
var path = require('path')
var expressValidator = require('express-validator');
var exphbs = require('express-handlebars');
var flash = require('express-flash');
var compression = require('compression');
var methodOverride = require('method-override');

var app = express()
// Once we export this, it can be imported by any other file
module.exports = exports = app

// morgan has pretty nice logging
app.use(morgan('combined'));

app.use(compression());
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.set('port', (process.env.PORT || 5000));

app.set('views', './views')
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    ifeq: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    toJSON : function(object) {
      return JSON.stringify(object);
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// import the config
require('./config/web')
require('./routes')

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
