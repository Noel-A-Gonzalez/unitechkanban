var express = require('express');
    path = require('path');
    favicon = require('serve-favicon');
    logger = require('morgan');
    cookieParser = require('cookie-parser');
    bodyParser = require('body-parser');
    cons = require('consolidate');
    session = require('express-session');
    passport = require('passport');
    google = require('googleapis');

var routes = require('./routes/index');
var rsesion = require('./routes/rsesion');
var rstatus = require('./routes/rstatus');
var ritem = require('./routes/ritem');

require("./public/config-social/passport.js")(passport);

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('html', cons.handlebars);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Indicamos que use sesiones, para almacenar el objeto usuario
// y que lo recuerde aunque abandonemos la página
app.use(session({
          secret: "esteeselsecreto",
          saveUnintialized: true,
          resave:true,
          cookie:{_expires : 30000000},
        })
      );

//Se inicia passport y le decimos que sea él quien maneje la sesion
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/rstatus', rstatus);
app.use('/ritem', ritem);
app.use('/rsesion', rsesion);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('error404.html');
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //res.render('error.html');
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
