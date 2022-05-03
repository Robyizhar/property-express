var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let ejs = require('ejs');
const bodyParser = require('body-parser');
var methodOverride = require('method-override')
const Swal = require('sweetalert2')

var app = express();

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'))
app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'app'));
app.set('layout', path.join(__dirname,'app/main'))
app.use('/assets',express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const requestSwal = function (req, res, next) {
  req.requestSwal = Date.now()
  next()
}

app.use(requestSwal)

const Swalert = function (req, res, next) {
  req.Swal = Swal
  next()
}

app.use(Swalert)
let thisMenu = function (req, res, next) {
  let listUri = req.originalUrl.split("/")
  const newUri = listUri.map(
    index => index.split("?")
  )
  req.thisMenu = newUri
  next()
}
app.use(thisMenu)

var indexRouter = require('./routes/index');
const Banner = require('./app/banner/router');

app.use('/', indexRouter);
app.use('/banners', Banner);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error/error');
});

module.exports = app;
