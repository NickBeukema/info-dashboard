var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// set our port
var port = process.env.PORT || 3000;

// set the static files location 
app.use(express.static(__dirname + '/public'));

// setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/routes')(app); // configure our routes

// startup our app at http://localhost:3000
app.listen(port);


// expose app
exports = module.exports = app;
