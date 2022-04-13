// implement your posts router here
const express = require('express');
const router = express.Router();
const Posts = require('./posts-model');

//     GET     \\
router.get('/', (req, res) => {
    console.log(req.query);
    Posts.find(req.query)
        .then(post => {
            res.status(200).json(post);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "The posts information could not be retrieved"
            });
        });
});
router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist' });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(404).json({
                message: 'The post information could not be retrieved',
            });
        });
});
router.get('/:id/comments', (req, res) => {
    Posts.findCommentById(req.params.id)
        .then(post => {
            if (post.length > 0) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist' });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'The comments information could not be retrieved',
            });
        });
});

//     POST     \\
router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        Posts.insert(req.body)
            .then(post => {
                res.status(201).json(post);
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({
                    message: 'There was an error while saving the post to the database',
                });
            });
    }
});
//     PUT     \\
router.put('/:id', (req, res) => {


    if (!req.body.title) {
        res.status(400).json({ message: "Please provide title and contents for the post" });
        return;
    } else if (!req.body.contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" });
        return;
    }

    Posts.update(req.params.id, req.body)
        .then(post => {
            if (post == null) {
                res.status(404).json({ message: "The post with the specified ID does not exist" });
            } else {
                res.status(200).json(post);
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The post information could not be modified" });
        });
});

//     DELETE     \\
router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                res.status(200).json(post)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The post could not be removed" })
        })
})


module.exports = router;