const imageServiceCore = require('../../../core/imageService');

const serviceRequestSchema = require('../requests').service;

const common = require('./common');
const validateRequest = common.validateRequest;
const asyncWrap = common.asyncWrap;
const packError = common.packError;


var getImageUploadToken = async function(req, res) {
    try {
        await validateRequest(req, serviceRequestSchema.getImageUploadToken);
        if(!req.user.privileges.uploadImage) throw new Error("Bad privileges");
        let uploadToken = await imageServiceCore.generateImageUploadToken(req.query["fileName"], req.query["fileType"]);
        res.status(200).json(uploadToken);
    }
    catch (error) {
        var err = packError(error);
        res.status(400||error.status).json(err);
    }
};

module.exports = {
    getImageUploadToken: asyncWrap(getImageUploadToken)
};