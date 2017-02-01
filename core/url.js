module.exports.generateRandomUrl = function(length) {
    var min = Math.pow(36,(length-1));
    var max = (Math.pow(36,length))-1;
    return Math.floor(Math.random()*(max-min+1)+min).toString(36);
};

//TODO: function to make sure that URL is unique

//TODO: Organize/Rename/Relocate/Do something about this file.