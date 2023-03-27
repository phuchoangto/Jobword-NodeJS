const Joi = require('joi');

module.exports = Joi.object().options({ abortEarly: false }).keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    provinceId: Joi.string().required(),
    bio: Joi.string().optional(),
    skillIds: Joi.any().optional(),
    profilePic: Joi.any().optional(),
});