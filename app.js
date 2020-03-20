var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');

var home = require('./routes/index');
var aboutus = require('./routes/aboutus');
var contactus = require('./routes/contactus');
var login = require('./routes/login');

// login page
var app = express();

var port = 8080;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname+'/views/layouts'}))
app.set('view engine', 'hbs');
app.set('view engine', 'pug');

// /* route to handle login and registration */
// app.post('/api/register', registerController.register);
// app.post('/api/authenticate', authenticateController.authenticate);

// use
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', home);
app.use('/about', aboutus)
app.use('/contactus', contactus)
app.use('/login', login)

// port
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function errorHandler(err, req, res, next) {
  if (typeof (err) === 'string') {
      // custom application error
      return res.status(400).json({ message: err });
  }

  if (err.name === 'ValidationError') {
      // mongoose validation error
      return res.status(400).json({ message: err.message });
  }

  if (err.name === 'UnauthorizedError') {
      // jwt authentication error
      return res.status(401).json({ message: 'Invalid Token' });
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
