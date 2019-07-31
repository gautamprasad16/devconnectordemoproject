'use strict';

const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {
    check,
    validationResult
} = require('express-validator');
const authenticateToken = require('../../middleware/auth');

// @route       api/posts
// @desc        create a new post
// @access      Private
router.post('/', [authenticateToken, [check('text', 'text is required').not().isEmpty()]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.array()
        });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');

        let newPost = new Post({
            text: req.body.text,
            name: user.name,
            user: req.user.id,
            avatar: user.avatar
        });
        const post = await newPost.save();

        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('SERVER ERROR');
    }
});

// @route       Get api/posts
// @desc        get all post
// @access      Private

router.get('/', authenticateToken, async (req, res) => {
    try {
        let posts = await Post.find();
        if (!posts) {
            res.status(404).json({
                msg: 'No Post exist'
            });
        }
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('SERVER ERROR');
    }
});


// @route       Get api/posts/:post_id
// @desc        get post by id
// @access      Private
router.get('/:post_id', authenticateToken, async (req, res) => {
    try {
        let apost = await Post.findById(req.params.post_id);

        if (!apost) {
            res.status(404).json({
                msg: "No post exist"
            })
        }

        res.json(apost);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            res.status(404).json({
                msg: "No post exist"
            })
        }
        console.error(error.message);
        res.status(500).send('SERVER ERROR');
    }
});

// @route       DELETE api/posts/:post_id
// @desc        Delete post by id
// @access      Private 
router.delete('/:post_id', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) {
            return res.status(404).json({
                msg: 'Post Not found'
            })
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json('User not authorised');
        }

        await Post.findOneAndRemove({
            _id: req.params.post_id
        });

        res.send("Post Deleted");

    } catch (error) {
        if (error.kind = 'ObjectId') {
            return res.status(404).json({
                msg: 'Post Not found'
            })
        }
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

// @route       PUT api/posts/like/:post_id
// @desc        like or unlike the post
// @access      Private 
router.put('/like/:post_Id', authenticateToken, async (req, res) => {
    try {
        let post = await Post.findById(req.params.post_Id);
        if (!post) {
            res.status(404).json({
                msg: "Post not found"
            });
        }

        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({
                msg: "Already liked the post"
            });
        }

        post.likes.unshift({
            user: req.user.id
        });

        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// @route       PUT api/posts/unlike/:post_id
// @desc        like or unlike the post
// @access      Private 
router.put('/unlike/:post_Id', authenticateToken, async (req, res) => {
    try {
        let post = await Post.findById(req.params.post_Id);
        if (!post) {
            return res.status(404).json({
                msg: 'Post not found'
            })
        }

        function sameUser(e) {
            return e.user.toString() === req.user.id;
        }
        let index = -1;
        let removeFlag = false;
        if (post.likes.length > 0) {
            index = post.likes.findIndex(sameUser);
            if (index !== -1) {
                removeFlag = true;
            }
        }

        if (removeFlag) {
            post.likes.splice(index, 1);
            await post.save();
            return res.json(post.likes);
        } else {
            return res.status(400).json({
                msg: 'User has not liked the post'
            })
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send("SERVER MESSAGE")
    }
});

// @route       api/posts/comment/:post_Id
// @desc        create a new post
// @access      Private
router.post('/comment/:post_Id', [authenticateToken, [check('text', 'text is required').not().isEmpty()]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.array()
        });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.post_Id);
        let newComment = {
            commentText: req.body.commentText,
            commentName: user.name,
            user: req.user.id,
            commentAvatar: user.avatar
        };
        post.comments.unshift(newComment);
        post.save();

        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('SERVER ERROR');
    }
});

// @route       DELETE api/posts/comment/:post_id/:comment_id
// @desc        Delete post by id
// @access      Private 
router.delete('/comment/:post_id/:comment_id', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) {
            return res.status(404).json({
                msg: 'Post Not found'
            })
        }

        let removeFlag = false;
        let index = -1;

        if (post.comments.length > 0) {
            index = post.comments.findIndex(sameUser);
            if (index !== -1) {
                removeFlag = true;
            }
        }

        function sameUser(e) {
            return e.user.toString() === req.user.id;
        }
        if (!removeFlag) {

            return res.status(404).json({
                msg: 'comment Not found'
            })
        }

        if (post.comments[index].user.toString() !== req.user.id) {
            return res.status(401).json('User not authorised');
        }

        post.comments.splice(index, 1);
        await post.save();
        return res.json('Comment Deleted');

    } catch (error) {
        if (error.kind = 'ObjectId') {
            return res.status(404).json({
                msg: 'Post Not found'
            })
        }
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});



module.exports = router;