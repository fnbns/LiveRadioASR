var express = require('express');
var app = express();
var port = process.env.PORT || 11001;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var bson = require('bson');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

//============================ DB Connection =============================================
mongoose.connect(configDB.url);

require('./config/passport.js')(passport);
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });
app.use(morgan('dev')); // Log everything to console 
app.use(cookieParser());
app.use(bodyParser()); // Get information from html forms
app.use(express.static(__dirname + '/assets'));
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'speedDev' })); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//============================== Routes Config ===========================================

require('./app/routes.js')(app, passport);

//============================== Server start ============================================
app.listen(port);
console.log("Server running on " + port);
