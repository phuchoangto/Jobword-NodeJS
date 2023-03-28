const Joi = require('joi');

module.exports = Joi.object().options({ abortEarly: false }).keys({
    profilePic: Joi.string().allow('').optional(),
    name: Joi.string().required(),
    description: Joi.string().allow('').optional(),
    website: Joi.string().allow('').optional(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    provinceId: Joi.string().required(),
});