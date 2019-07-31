'use strict';

const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const {
    check,
    validationResult
} = require('express-validator');
const request = require('request');
const config = require('config');

// @route       GET api/profile/me
// @desc        Get current user profile
// @access      Private
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(404).json({
                msg: 'There is no profile for this user'
            });
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


// @route        POST or PUT api/profile
// @desc        create or update the user profile
// @access      Private
router.post('/', [authenticateToken, [
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skill is required').not().isEmpty()
]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubUserName,
            skills,
            social
        } = req.body;

        //build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubUserName) profileFields.githubUserName = githubUserName;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (skills && Array.isArray(skills)) profileFields.skills = skills;
        else if (skills && typeof skills === 'string') profileFields.skills.splice(',').map(skill => skill.trim());

        if (social) profileFields.social = social;

        try {
            let profile = await Profile.findOne({
                user: req.user.id
            });
            if (profile) {
                //update 
                profile = await Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                        $set: profileFields
                    }, {
                        new: true
                    });
                return res.json(profile);
            } else {
                profile = new Profile(profileFields);
                await profile.save();
                return res.json(profile);
            }
        } catch (error) {
            console.error(error.message)
            res.status(500).send("Server error");
        }
    });

//@route        GET api/profile
// @desc        fetch all user profile
// @access      public
router.get('/', async (req, res) => {
    try {
        let profiles = await Profile.find().populate('user', ['name', 'avatar']);
        if (!profiles) {
            return res.status(404).json({
                msg: "No profile Exist"
            });
        }

        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//@route        GET api/profile/user/:userid
// @desc        fetch profile by userid
// @access      private
router.get('/user/:user_id', authenticateToken, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(404).json({
                msg: "No Profile exist for the user"
            });
        }

        res.json(profile);
    } catch (error) {
        if (error.kind == 'ObjectId') {
            return res.status(404).json({
                msg: "No Profile exist for the user"
            });
        }
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route       delete api/profile/:user_id
// @desc        delete user, profile, post
// @access      private
router.delete('/', authenticateToken, async (req, res) => {
    try {
        // Remove User Post
        await Post.deleteMany({
            user: req.user.id
        });
        // Remove Profile
        await Profile.findOneAndRemove({
            user: req.user.id
        });
        //Remove User
        await User.findByIdAndRemove(
            req.user.id
        );

        res.json({
            msg: "User deleted"
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route       put api/profile/experience
// @desc        update experience in the user profile
// @access      private
router.put('/experience', [authenticateToken, [
    check('title', 'title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('fromDate', 'fromDate is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            errors: errors.array()
        })
    }

    const {
        title,
        company,
        location,
        fromDate,
        toDate,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        current,
        description
    };
    if (fromDate) newExp.fromDate = new Date(fromDate);
    if (toDate) newExp.toDate = new Date(toDate);
    try {

        const profile = await Profile.findOne({
            user: req.user.id
        });

        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('SERVER ERROR');
    }
});

// @route       delete api/profile/experience
// @desc        delete experience in the user profile
// @access      private
router.delete('/experience/:exp_id', authenticateToken, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        // Get remove index
        let exp = profile.experience.filter(exp => exp.id !== req.params.exp_id);
        profile.experience = exp;
        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("SERVER ERROR");
    }
});

// @route       put api/profile/education
// @desc        update education in the user profile
// @access      private
router.put('/education', [authenticateToken, [
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldOfStudy', 'fieldOfStudy is required').not().isEmpty(),
    check('fromDate', 'fromDate is required').not().isEmpty(),
    check('toDate', 'toDate is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            errors: errors.array()
        })
    }

    const {
        school,
        degree,
        fieldOfStudy,
        fromDate,
        toDate,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldOfStudy,
        fromDate,
        toDate,
        description
    };
    if (fromDate) newEdu.fromDate = new Date(fromDate);
    if (toDate) newEdu.toDate = new Date(toDate);
    try {

        const profile = await Profile.findOne({
            user: req.user.id
        });

        profile.education.unshift(newEdu);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('SERVER ERROR');
    }
});

// @route       delete api/profile/education
// @desc        delete education in the user profile
// @access      private
router.delete('/education/:edu_id', authenticateToken, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        // Get remove index
        let edu = profile.education.filter(edu => edu.id !== req.params.edu_id);
        profile.education = edu;
        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("SERVER ERROR");
    }
});

// @route       Get api/profile/github/:userName
// @desc        get user repos from github
// @access      public
router.get('/github/:userName', async (req, res) => {
    try {
        const options = {
            uri: `https://api/github.com/users/${req.params.userName}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecret')}`,
            method: 'GET',
            headers: {
                'user-agent': 'node.js'
            }
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                res.status(404).json({
                    msg: 'No Github profile found'
                });
            }

            res.json(JSON.parse(body));
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("SERVER ERROR");
    }
});
module.exports = router;