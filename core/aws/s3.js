var Q = require('q');
var assert = require('chai').assert;
var aws = require('aws-sdk');
var mime = require('mime-types')

var S3_BUCKET = "jvent-media";
var S3_REGION = "us-east-2"
var urlCore = require('../url');

module.exports.generateImageUploadToken = function(fileName, fileType) {
    var generateFileName = function() {
        return `${Date.now()}-${urlCore.generateRandomUrl(6)}.${mime.extension(fileType)}`;
    };
    return Q.fcall(function() {
        var deferred = Q.defer();
        var s3 = new aws.S3({signatureVersion: 'v4', region: S3_REGION});
        if(!fileType) fileType = mime.lookup(fileName);
        assert.include(["image/png", "image/jpeg"], fileType, "Bad file type");
        var awsFileName = generateFileName();
        var s3Params = {
            Bucket: S3_BUCKET,
            Key: awsFileName,
            Expires: 60,
            ContentType: fileType,
            ACL: 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, function(err, data) {
            if(err) throw deferred.reject(err);
            return deferred.resolve({
                signedRequest: data,
                url: `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${awsFileName}`
            });
        });
        return deferred.promise;
    });
};