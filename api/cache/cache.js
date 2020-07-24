const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

client.on('error', function(err) {});

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');

    return this;
};

mongoose.Query.prototype.exec = async function() {
    if(!this.useCache) {
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name,
        }),
    );

    // See if we have a value for key in redis
    const cacheValue = await client.hget(this.hashKey, key);
    
    // If we do return it
    if(cacheValue) {
        const doc = JSON.parse(cacheValue);
        return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.moel(doc);
    }

    // Otherwise issue the query and store the results in redis
    const result = await exec.apply(this, arguments);
    client.hset(this.hashKey, key, JSON.stringify(result));

    return result;
};

// deletes hashKey from redis client
function clearCache(hashKey) {
    client.del(JSON.stringify(hashKey));
}

// adds hashkey to redis client
function addToCache(hashKey, key, result) {
    client.hset(hashKey, key, JSON.stringify(result));
}

function clearField(hashKey) {
    client.del(hashKey);
}

// returns url from cache
async function getFromCache(hashKey, key) {
    const cacheValue = await client.hget(hashKey, key);

    // If cacheValue exists reurn the parsed result
    if(cacheValue) {
        const result = JSON.parse(cacheValue);
        return result;
    }
    // If not return null
    return null
}

module.exports = {
    clearCache,
    addToCache,
    clearField,
    getFromCache,
};