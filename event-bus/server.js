const express = require("express");
const { randomBytes } = require("crypto");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");
const app = express();
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post("http://posts-clusterip-srv:9696/events", event); // posts
  axios.post("http://comments-srv:9656/events", event); // comments
  axios.post("http://query-srv:7777/events", event); // query
  axios.post("http://moderation:4567/events", event); // moderation

  res.send({ status: "ok" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

let port = 8888;
app.listen(port, () => {
  console.log(`event bus lives at ${port}`);
});
