var Q = require('q');
var assert = require('chai').assert;
var aws = require('aws-sdk');
var mime = require('mime-types')

var S3_BUCKET = "jvent-media";
var urlCore = require('../url');

module.exports.generateImageUploadToken = function(fileName, fileType) {
    var generateFileName = function() {
        return `${Date.now()}-${urlCore.generateRandomUrl(6)}.${mime.extension(fileType)}`;
    };
    return Q.fcall(function() {
        var deferred = Q.defer();
        var s3 = new aws.S3({signatureVersion: 'v4', region: 'us-east-2'});
        if(!fileType) fileType = mime.lookup(fileName);
        assert.include(["image/png", "image/jpeg"], fileType, "Bad file type");
        var s3Params = {
            Bucket: S3_BUCKET,
            Key: generateFileName(),
            Expires: 60,
            ContentType: fileType,
            ACL: 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, function(err, data) {
            if(err) throw deferred.reject(err);
            return deferred.resolve({
                signedRequest: data,
                url: `https://${S3_BUCKET}.s3.amazonaws.com/${generateFileName()}`
            });
        });
        return deferred.promise;
    });
};