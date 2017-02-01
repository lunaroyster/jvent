module.exports.generateRandomUrl = function(length) {
    var min = 36**(length-1);
    var max = (36**length)-1;
    return Math.floor(Math.random()*(max-min+1)+min).toString(36);
};

//TODO: Organize/Rename/Relocate/Do something about this file.