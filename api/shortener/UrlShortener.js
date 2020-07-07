function createShortId() {
    const letters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
    const min = 0;
    const max = letters.length - 1;
    var counter = 0;
    var idString = '';

    while (counter < 5) {
        idString = idString + letters[Math.floor(Math.random() * (max - min) + min)];
        counter++;
    }

    return idString;
}

module.exports = {
    createShortId,
}