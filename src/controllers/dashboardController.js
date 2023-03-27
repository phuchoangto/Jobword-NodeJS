const passport = require('../config/passport');
const registerSchema = require('../validation/registerSchema');
const updateJobSeekerProfileSchema = require('../validation/updateJobSeekerProfileSchema');
const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const {Role} = require('@prisma/client');

async function getSkills() {
    const skills = await prisma.skill.findMany();
    return skills;
}

async function getProvinces() {
    const provinces = await prisma.province.findMany();
    return provinces;
}

module.exports = {
    index: (req, res, next) => {
        res.render('dashboard/index', {title: 'Dashboard'});
    },

    profile: async (req, res, next) => {
        if (req.user.role === Role.JOB_SEEKER) {
            const jobSeeker = await prisma.jobSeeker.findUnique({
                where: {userId: req.user.id},
                include: {
                    JobSeekerSkill: true,
                },
            });
            console.log(jobSeeker);
            res.render('dashboard/job_seeker/profile', {
                title: 'Profile',
                jobSeeker,
                skills: await getSkills(),
                provinces: await getProvinces()
            });
        }
    },


    updateProfile: async (req, res, next) => {
        if (req.user.role === Role.JOB_SEEKER) {
            const {error} = updateJobSeekerProfileSchema.validate(req.body);

            if (error) {
                res.render('dashboard/job_seeker/profile', {
                    title: 'Profile',
                    errors: error.details,
                    jobSeeker: req.body,
                    skills: await getSkills(),
                    provinces: await getProvinces()
                });
                return;
            }

            const {provinceId, skillIds, ...data} = req.body;
            await prisma.jobSeekerSkill.deleteMany({
                where: {
                    jobSeekerId: req.user.jobSeekerId
                }
            });
            const jobSeeker = await prisma.jobSeeker.upsert({
                where: {userId: req.user.id},
                update: {
                    user: {
                        connect: {id: req.user.id}
                    },
                    ...data,
                    province: {
                        connect: {id: parseInt(provinceId)}
                    },
                    JobSeekerSkill: {
                        deleteMany: {},
                        create: skillIds ? skillIds.map(skillId => {
                            return {
                                skill: {
                                    connect: {id: parseInt(skillId)}
                                }
                            }
                        }) : []
                    }
                },
                create: {
                    user: {
                        connect: {id: req.user.id}
                    },
                    ...data,
                    province: {
                        connect: {id: parseInt(provinceId)}
                    },
                    JobSeekerSkill: {
                        create: skillIds ? skillIds.map(skillId => {
                            return {
                                skill: {
                                    connect: {id: parseInt(skillId)}
                                }
                            }
                        }) : []
                    }
                }
            });

            res.render('dashboard/job_seeker/profile', {
                title: 'Profile',
                jobSeeker,
                skills: await getSkills(),
                provinces: await getProvinces()
            });
        } else {
            res.redirect('/dashboard/profile');
        }
    }
};
