const UrlShortenerController = require('../controllers/UrlShortenerController');

module.exports = app => {
    // Get long URL with Short Url
    app.get('/shortener/', UrlShortenerController.getUrl)
    // Create new Short URL
    app.post('/shortener', UrlShortenerController.createShortUrl)
}; 