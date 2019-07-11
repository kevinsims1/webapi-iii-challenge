const express = require('express');

const userDB = require('./userDb.js')

const postDB = require('../posts/postDb.js')

const router = express.Router();
// router.use(validateUserId)
// router.use(validatePost)
// router.use(validateUser)

router.get('/', async (req, res) => {
    try {
        const users = await userDB.get()
        res.status(200).json(users)
    } catch(error){
         // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the hubs',
    });
    }
});

router.get('/:id', validateUserId, async (req, res) => {
    try {
        const user = await userDB.getById(req.params.id);
    
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: 'user not found' });
        }
      } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
          message: 'Error retrieving the user',
        });
      }
});

router.get('/:id/posts', validateUserId, (req, res) => {
    userDB
    .getUserPosts(req.user)
    .then(posts => {
        res.status(200).json(posts)
    })
});

router.delete('/:id',validateUserId, (req, res) => {
    userDB
    .remove(req.user)
    .then(user => {
        console.log(user)
        res.status(204).end()
    })
    .catch(error => {
        res.status(500).json({message: 'bad request'})
    })
});

router.put('/:id', (req, res) => {
    const user = req.body
    userDB
    .update(req.user, user)
    .then(user => {
        res.status(201).json(user)
    })
});

router.post('/', validateUser, (req, res) => {
    userDB
    .insert(req.body)
    .then(user => {
        res.status(201).json(user)
    })
    .catch(error => {
        res.status(500).json(error)
    })
});

router.post('/:id/posts', validatePost,  (req, res) => {
    postDB
    .insert(req.body)
    .then(post => {
        console.log(post)
        res.status(201).json(post)})
    .catch(error => {
        res.status(500).json({message: 'error'})
    })
});
//custom middleware

function validateUserId(req, res, next) {
    userDB.getById(req.params.id)
    .then( user => {
        if(user){
            req.user = req.params.id
            next()
        } else {
            res.status(404).json({ message: "Invalid User ID" })
        } 
    })
    .catch(error => {
        res.status(500).json(error)
    });
};

function validateUser(req, res, next) {
    const user = req.body
    const name = req.body.name
    if(!user) {
        res.status(404).json({ message: "missing user data" })
    } else 
    if(!name){
        res.status(400).json({ message: "missing required name field" })
        
    }else{
       
        next();
    }
};


function validatePost(req, res, next) {
    const post = req.body
    const text = post.text
    if(!post){
        res.status(400).json({message: "Missing Post Data"})
    }else 
    if(!text){
        res.status(400).json({ message: "missing required text field" })
        
    }else{

        next();
    }
};

module.exports = router;
