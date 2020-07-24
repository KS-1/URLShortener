const crypto = require('crypto');
const hash = crypto.createHash('sha512');

/*
*   Truncates a sha512 string of the passed urlString to 7 digits. This is still cryptographically secure
*   since it doesn't tamper with the hash creation algorithm instead it truncates the final hash to a 7
*   character string starting from a random index within the generated hash. This will keep the general
*   cryptographically secure nature of the generated hash but increases the likelyhood of collisions
*   due to the shorter final string.
*/
function createShortId(urlString) {
    console.log('creating hash');
    var data = hash.update(urlString, 'utf-8');
    // Create hash string for the urlString passed
    var gen_hash = data.digest('hex');

    // consts for random sectioning of the hash
    // lenght - 8 to ensure we have enough space for a complete 7 digit string
    const min = 0;
    const max = gen_hash.length - 8;

    // get random index value 
    var hash_index = Math.floor(Math.random() * (max - min) + min);

    // get 7 characters from random start location in gen_hash
    var short_hash = gen_hash.substr(hash_index, 7);

    return short_hash;
}

module.exports = {
    createShortId,
}