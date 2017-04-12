const app = require('./app')

const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const path = require('path');
const expressValidator = require('express-validator');
const exphbs = require('express-handlebars');
const flash = require('express-flash');
const compression = require('compression');
const methodOverride = require('method-override');
const _ = require('lodash');

app.use(morgan('combined'));
app.use(compression());
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(flash());

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));

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
      if (!a) {
        return options.fn(this)
      }
      if (_.isObject(a) && _.isEmpty(a)) {
        return options.fn(this)
      }
      return options.inverse(this)
    }
  },
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
