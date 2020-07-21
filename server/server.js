// const path = require('path');
const express = require('express');

const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const PORT = process.env.PORT || 4000;

app.use(express.json());

// import controllers
const chatController = require('./controllers/chatController');
const cookieController = require('./controllers/cookieController');
const userController = require('./controllers/userController');
const chatRouter = require('./routes/chats');
const userRouter = require('./routes/users');

// catch-all route handler for any requests to an unknown route

app.use('/chat', chatRouter);
app.use('/user', userRouter);

app.get('/test', (req, res) => res.status(200).send('hello'));

app.use((req, res) => res.sendStatus(404));

/**
 * express error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
 */
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

// start server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
