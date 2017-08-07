var Q = require('q');
var aws = require('aws-sdk');

module.exports.generateImageUploadToken = function(fileName, fileType) {
    return Q.fcall(function() {
        var deferred = Q.defer();
        var S3_BUCKET = "jvent-media";
        var s3 = new aws.S3({signatureVersion: 'v4', region: 'us-east-2'});
        var s3Params = {
            Bucket: S3_BUCKET,
            Key: fileName,
            Expires: 60,
            ContentType: fileType,
            ACL: 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, function(err, data) {
            if(err) throw deferred.reject(err);
            return deferred.resolve({
                signedRequest: data,
                url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
            });
        });
        return deferred.promise;
    });
};