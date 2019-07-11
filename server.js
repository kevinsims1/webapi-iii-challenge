const express = require('express');

const userRouter = require('./users/userRouter')
const postRouter = require('./posts/postRouter')

const helmet = require('helmet')
const server = express();

//custom middleware

function logger(require, res, next) {
  console.log(`${require.method} to ${require.path}`)

  next()
};

//global middleware
server.use(logger)
server.use(helmet())
server.use(express.json())



server.use('/api/users', userRouter )
server.use('/posts', postRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});



module.exports = server;
