const Q = require('q');

const imageServiceCore = require('../../../core/imageService');

const serviceRequestSchema = require('../requests').service;

const common = require('./common');
const validateRequest = common.validateRequest;
const packError = common.packError;


module.exports.getImageUploadToken = function(req, res) {
    var checkCreateMediaPrivilege = function(req) {
        return Q.fcall(function() {
            if(!req.user.privileges.uploadImage) throw new Error("Bad privileges");
            return;
        });
    };
    Q.fcall(function() {
        return validateRequest(req, serviceRequestSchema.getImageUploadToken);
    })
    .then(function() {
        return checkCreateMediaPrivilege(req);
    })
    .then(function() {
        return imageServiceCore.generateImageUploadToken(req.query["fileName"], req.query["fileType"]);
    })
    .then(function(uploadToken) {
        res.status(200).json(uploadToken);
    })
    .catch(function(error) {
        var err = packError(error);
        res.status(400).json(err);
    });
};