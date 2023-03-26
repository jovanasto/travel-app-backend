const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { auth } = require('express-oauth2-jwt-bearer');
const { Server } = require("socket.io");

const db = require('../db/connection');
const users = db.get('users');
users.createIndex('username', { unique: true });

const router = express.Router();

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

const jwtCheck = auth({
  audience: 'http://localhost:3000',
  issuerBaseURL: 'https://dev-603ry3fk1jddplf5.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

app.use(jwtCheck);

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

const io = new Server(server, {
    cors: {
      origin: 'http://localhost:8080',
      // origin: 'http://YOUR_HOST_IP:8080',
    },
  })



io.on("connection", (socket) => {
  socket.on('messageFromClient', msg => {
    console.log(msg)
    io.emit('messageFromServer', msg);
  });
      
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});



const restaurantsSchema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  images: Joi.array(), 
  location: Joi.string().required(),
});

router.get("/", (req, res, next) => {
    restaurants.find().then((ac) => {
    res.json(ac);
  });
});
router.post("/", (req, res, next) => {
  //check if available at selected time
  console.log(req.body)
  const result = Joi.validate(req.body, restaurantsSchema);
 
  restaurants.insert({
    user: req.user._id,
    name: result.value.name,
    description: result.value.description,
    images: result.value.images,
    location: result.value.location,
    user_id: req.user._id,
    created_at: new Date(),
  });
  res.json({ success: true });
});
router.delete('/:id', (req, res, next) => {
  restaurants.remove({ _id: req.params.id }).then((ac) => {
  res.json(ac);
});
});


router.get("/:id", (req, res, next) => {
    restaurants.find({ _id: req.params.id }).then((ac) => {
    res.json(ac);
  });
});
module.exports = router;