const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const passport = require('./config/passport');
const session = require('express-session');
const prisma = require('./config/prisma');

const webRouter = require('./routes/web');

const app = express();

app.use(session({secret: process.env.SESSION_SECRET || 'secret', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

// attach user to response locals
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(logger('dev'));

app.use('/', webRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
