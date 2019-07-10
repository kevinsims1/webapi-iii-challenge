const express = require('express');
const postDB = require('./postDb')

const router = express.Router();

router.get('/',  (req, res) => {
    postDB
    .get()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(() => {
        res.status(500).json({message: "Error Cant Get Post"})
    })
});

router.get('/:id',  (req, res) => {
    postDB
    .getById(req.params.id)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(() => {
        res.status(404).json({message: "ERROR NO USER"})
    })
});

router.delete('/:id', (req, res) => {
    postDB
    .remove(req.params.id)
    .then(() => postDB.get())
    .then(posts => {
        console.log(posts)
        res.status(200).json(posts)})
    .catch(error => {
        res.status(400).json({message: "COULDNT GET POST"})
    })
    
});

router.put('/:id', validatePostId, (req, res) => {
    const post = req.body
    const id = req.params.id
    postDB
    .insert(id, post)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(error => {
        res.status(500).json(error)
    })
});

// custom middleware

function validatePostId(req, res, next) {
    const id = req.params.id
    postDB
    .getById(id)
    .then(post => {if(!post){
        res.status(404).json({error: "ID NOT FOUND"})
    }{
        next();
    }})
    .catch(error => {
        res.status(500).json({error: "ERROR"})
    })
};

module.exports = router;