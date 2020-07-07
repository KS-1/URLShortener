const mongoose = require('mongoose');
const UrlShorten = mongoose.model('UrlShortener');
const validUrl = require('valid-url');
const shortCode = require('../shortener/UrlShortener');

async function getUrl (req, res) {
    try {
        const shortUrl = req.query.shortUrl;
        const url = await UrlShorten.findOne({ "shortUrl": shortUrl });
        // check if url already exists
        if (url) {
            // redirect to original url link
            return res.redirect(url.originalUrl);
        } else {
            // Let know Short URL is bad
            return res.status(404).json('Invalid Short URL');
        }
    } catch (error) {
        return res.status(404).json('Could not process');
    }
}

async function createShortUrl (req, res) {
    var originalUrl = req.body;
    originalUrl = originalUrl.originalUrl;

    // Check if URL is valid
    if (validUrl.isUri(originalUrl)) {
        // Set urlData variable
        let urlData;
        // Creation logic
        try {
            // Check if the URL is already in db
            urlData = await UrlShorten.findOne({ "originalUrl": originalUrl });
            if (urlData) {
                res.status(200).json("ShortUrl: " + urlData.shortUrl);
            } else {
                // Create new short url
                const urlCode = shortCode.createShortId();
                shortUrl = 'http://www.' + urlCode + '.com';
                const urlToBeSaved = { originalUrl, shortUrl, urlCode };

                // Add Item to db
                const url = new UrlShorten(urlToBeSaved);
                await url.save();
                return res.status(200).json("ShortUrl: " + shortUrl);
            }
        } catch (error) {
            res.status(403).json('Could not create short url');
            console.log(error);
        }
    } else {
        return res.status(404).json('Invalid URL');
    }
}

module.exports = {
    getUrl,
    createShortUrl,
 };