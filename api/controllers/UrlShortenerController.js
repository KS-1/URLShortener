const mongoose = require('mongoose');
const UrlShorten = mongoose.model('UrlShortener');
const validUrl = require('valid-url');
const shortCode = require('../shortener/UrlShortener');
const cache = require('../cache/cache');

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
            // Check if the URL is already in the cache
            //urlData = await cache.getFromCache('orginalUrl', JSON.stringify(originalUrl));

            // Check if the URL is already in db
            if(!urlData) {
                urlData = await UrlShorten.findOne({ "originalUrl": originalUrl });
            }
            // Url exists in cache or in db return already shortened url
            if (urlData) {
                res.status(200).json(urlData);
            } else {
                // URL doesn't exist in Cache or in DB
                // Create new short url
                const urlCode = shortCode.createShortId(originalUrl);
                shortUrl = 'http://www.' + urlCode + '.com';
                const urlToBeSaved = { originalUrl, shortUrl, urlCode };

                // Add URL to db
                const url = new UrlShorten(urlToBeSaved);
                await url.save();

                //Add URL to cache
                cache.addToCache('originalUrl', JSON.stringify(originalUrl), urlToBeSaved);

                return res.status(200).json(urlToBeSaved);
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