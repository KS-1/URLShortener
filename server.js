const express = require('express')
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const ShortUrl = require('./api/models/UrlShortenerModel');
const bodyParser = require('body-parser');

//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongo:27017/ShortUrldb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set home page with form for shortening code
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/api/views/index.html');
});

var routes = require('./api/routes/UrlShortenerRoutes');
routes(app);

app.listen(port);

console.log('Server started on: ' + port);