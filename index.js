const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const session = require("express-session")
const redis = require("redis")
let RedisStore = require("connect-redis").default

const { 
  MONGO_USER, 
  MONGO_PASSWORD, 
  MONGO_IP, 
  MONGO_PORT,
  REDIS_PORT,
  SESSION_SECRET,
  REDIS_URL,
} = require('./config/config');
const postRouter = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes")
const app = express();


let redisClient = redis.createClient({
  socket: {
    port: REDIS_PORT,
    host: REDIS_URL
  }
});
    
redisClient.connect().catch(console.error)

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient
})

app.get("/api/v1", (req,res) => {
    res.send(`<h2>inside compose saying exposed port is ${process.env.PORT} not changing</h2>`)
    console.log("yeah it ran and working")
})

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
// console.log(mongoURL)

const connectWithRetry = () => {
  mongoose.connect(mongoURL)
  .then(() => console.log('succesfully connected to DB'))
  .catch((e) => { 
    console.log(e)
    setTimeout(connectWithRetry, 5000)
  });
}
connectWithRetry();

app.enable("trust proxy") // all this is saying that trust the header add by our proxy(nginx), ex: to access IP address
app.use(cors())
app.use(session({
  store: redisStore,
  secret: SESSION_SECRET,
  cookie: {
    secure: false,
    resave: false,
    saveUnitialized: false,
    httpOnly: true,
    maxAge: 3000000,
  }
}))

app.use(express.json())
//localhost:3000/posts
app.use("/api/v1/posts", postRouter)

app.use("/api/v1/users", userRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on ${port}`))