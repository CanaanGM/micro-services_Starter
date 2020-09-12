const express = require("express");
const { randomBytes } = require("crypto");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const axios = require("axios");
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(bodyParser.json());
app.use(cors());

const posts = {};

let port = process.env.PORT || 9696;

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  let title = req.body.title;
  posts[id] = {
    id,
    title: req.body.title,
  };

  await axios.post("http://event-bus-srv:8888/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });
  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Event => ", req.body.type);

  res.send({});
});

app.listen(port, () => {
  console.log("v50");
  console.log(`Posts lives at ${port}`);
});
