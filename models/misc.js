module.exports.generateRandomUrl = function() {
    return Math.floor((Math.random() * 10000000000) + 1).toString(36); //TODO: Finetune
};