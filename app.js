
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// test
var ses = require('node-ses')
  , client = ses.createClient({
    key: process.env.AWS_SES_KEY,
    secret: process.env.AWS_SES_SECRET,
    amazon: 'https://email.us-west-2.amazonaws.com'
  });

client.sendemail({
   // to: 'success@simulator.amazonses.com'
   to: 'bounce@simulator.amazonses.com'
   // to: 'complaint@simulator.amazonses.com'
   // to: 'ooto@simulator.amazonses.com'
   // to: 'suppressionlist@simulator.amazonses.com'
   // to: 'wu.chingting@gmail.com'
 , from: 'service@q-box.co'
 , subject: 'greetings'
 , message: 'your <b>message</b> goes here'
 , altText: 'plain text'
}, function (err, data, res) {
  if (err) return console.log(err)
  console.log(data)
  console.log(res.body)
});