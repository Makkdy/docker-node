const express = require('express');
const mongoose = require('mongoose');
const { 
  MONGO_USER, 
  MONGO_PASSWORD, 
  MONGO_IP, 
  MONGO_PORT,
} = require('./config/config');
const postRouter = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes")
const app = express();

app.use(express.json())

app.get("/", (req,res) => {
    res.send(`<h2>inside compose saying exposed port is ${process.env.PORT} not changing</h2>`)
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


//localhost:3000/posts
app.use("/api/v1/posts", postRouter)

app.use("/api/v1/users", userRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on ${port}`))