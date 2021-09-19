var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Add Start ISI)todo #1
var checkRouter = require('./routes/check');
// Add End ISI)todo #1

// Add Start ISI)todo #2
var initRouter = require('./routes/init');
var stockRouter = require('./routes/stock');
// Add End ISI)todo #2

// Add Start ISI)todo #4
var purchaseRouter = require('./routes/purchase');
// Add End ISI)todo #4


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Add Start ISI)todo #1
app.use('/check', checkRouter);
// Add End ISI)todo #1

// Add Start ISI)todo #2
app.use('/init', initRouter);
app.use('/stock', stockRouter);
// Add End ISI)todo #2

// Add Start ISI)todo #4
app.use('/purchase', purchaseRouter);
// Add End ISI)todo #4

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
