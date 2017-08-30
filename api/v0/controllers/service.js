const Q = require('q');

const imageServiceCore = require('../../../core/imageService');

const serviceRequestSchema = require('../requests').service;

const common = require('./common');
const validateRequest = common.validateRequest;
const packError = common.packError;


module.exports.getImageUploadToken = function(req, res) {
    var checkCreateMediaPrivilege = (req)=> {
        return Q.fcall(()=> {
            if(!req.user.privileges.uploadImage) throw new Error("Bad privileges");
            return;
        });
    };
    Q.fcall(()=> {
        return validateRequest(req, serviceRequestSchema.getImageUploadToken);
    })
    .then(()=> {
        return checkCreateMediaPrivilege(req);
    })
    .then(()=> {
        return imageServiceCore.generateImageUploadToken(req.query["fileName"], req.query["fileType"]);
    })
    .then((uploadToken)=> {
        res.status(200).json(uploadToken);
    })
    .catch((error)=> {
        var err = packError(error);
        res.status(400).json(err);
    });
};