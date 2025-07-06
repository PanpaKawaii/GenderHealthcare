require('dotenv').config(); 
const mongoose = require('mongoose');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Route import
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const accountRoutes = require('./routes/account');
const customerRoutes = require('./routes/customer');
const counselorRoutes = require('./routes/counselor');
const bookingRouter = require('./routes/consultationBooking');
const scheduleRoutes = require('./routes/consultationSchedule');



var app = express();

// MongoDB connection
const uri= process.env.MONGO_URI;
mongoose.connect(uri)
.then(()=>{
  console.log("Connected");
})
.catch((err) => {
console.error("Connection error:",err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/accounts', accountRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/bookings',bookingRouter);

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
