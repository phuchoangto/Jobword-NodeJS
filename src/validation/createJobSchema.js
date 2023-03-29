const Joi = require('joi');
const { JobType } = require('@prisma/client');

const createJobSchema = Joi.object().options({ abortEarly: false }).keys({
    title: Joi.string().required(),
    categoryId: Joi.string().required(),
    jobType: Joi.string().valid(...Object.values(JobType)).required(),
    address: Joi.string().required(),
    provinceId: Joi.string().required(),
    currency: Joi.string().required(),
    minSalary: Joi.number().integer().min(0).allow(null).optional(),
    maxSalary: Joi.number().integer().min(0).allow(null).optional(),
    skills: Joi.string().allow('').optional(),
    description: Joi.string().required(),
    experienceYears: Joi.number().integer().min(0).allow(null).optional(),
    vacancies: Joi.number().integer().min(0).allow(null).optional(),
    deadline: Joi.date().required(),
});

module.exports = createJobSchema;