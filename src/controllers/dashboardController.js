const passport = require('../config/passport');
const registerSchema = require('../validation/registerSchema');
const updateJobSeekerProfileSchema = require('../validation/updateJobSeekerProfileSchema');
const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const { Role } = require('@prisma/client');
const upload = require('../config/upload');

async function updateJobSeekerSkill(jobSeekerId, skillIds) {
    const jobSeeker = await prisma.jobSeeker.update({
        where: {id: jobSeekerId},
        data: {
            JobSeekerSkill: {
                set: skillIds.map(skillId => ({ skillId: parseInt(skillId) })),
            }
        }
    });
}

module.exports = {
    index: (req, res, next) => {
        res.render('dashboard/index', {title: 'Dashboard'});
    },

    profile: async (req, res, next) => {
        if (req.user.role === Role.JOB_SEEKER) {
            res.render('dashboard/job-seeker/profile', {
                title: 'Profile',
                jobSeeker: await prisma.jobSeeker.findUnique({ where: { userId: req.user.id }, include: { JobSeekerSkill: true } }),
                provinces: await prisma.province.findMany(),
                skills: await prisma.skill.findMany(),
            });
        }
    },


    updateProfile: async (req, res, next) => {
        let { profilePic, firstName, lastName, email, bio, provinceId, address, phone, skillIds } = req.body;

        const validation = updateJobSeekerProfileSchema.validate({ profilePic, firstName, lastName, email, bio, provinceId, address, phone, skillIds });

        if (validation.error) {
            console.log(validation.error.details);
            res.status(400).json({ message: 'Invalid data', errors: validation.error.details });
        }

        else {

            // if skillIds is empty, set it to an empty array
            if (!skillIds) {
                skillIds = [];
            }

            if (req.file) {
                // Upload the profile picture to S3
                try {
                    const uploadResult = await upload(`profile-pics/${req.user.id}.${req.file.mimetype.split('/')[1]}`, req.file.buffer);
                    profilePic = uploadResult.Location;
                } catch (err) {
                    console.log(err);
                    res.status(500).json({message: 'Error uploading profile picture', errors: err});
                }
            }

            // Check if the user already has a JobSeeker profile
            let jobSeeker = await prisma.jobSeeker.findFirst({
                where: { userId: req.user.id }
            });

            if (jobSeeker) {
                await prisma.jobSeeker.update({
                    where: { id: jobSeeker.id },
                    data: {
                        firstName,
                        lastName,
                        email,
                        bio,
                        profilePic,
                        provinceId: parseInt(provinceId),
                        address,
                        phone,
                    }
                });

                // Delete existing JobSeekerSkill associations
                await prisma.jobSeekerSkill.deleteMany({
                    where: { jobSeekerId: jobSeeker.id }
                });

                // Create new JobSeekerSkill associations
                for (const skillId of skillIds) {
                    await prisma.jobSeekerSkill.create({
                        data: {
                            jobSeekerId: jobSeeker.id,
                            skillId: parseInt(skillId)
                        }
                    });
                }
            } else {
                // If the profile doesn't exist, create a new one
                jobSeeker = await prisma.jobSeeker.create({
                    data: {
                        firstName,
                        lastName,
                        email,
                        bio,
                        profilePic,
                        provinceId: parseInt(provinceId),
                        address,
                        phone,
                        user: {
                            connect: { id: req.user.id }
                        }
                    }
                });

                // Create JobSeekerSkill associations for the new profile
                for (const skillId of skillIds) {
                    await prisma.jobSeekerSkill.create({
                        data: {
                            jobSeekerId: jobSeeker.id,
                            skillId: parseInt(skillId)
                        }
                    });
                }
            }

            res.status(200).json({ message: 'Profile updated successfully' });
        }
    }
};
