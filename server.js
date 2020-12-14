const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const dataAccessLayer = require("./dataAccessLayer");
const { request } = require("http");
const { response } = require("express");
const { ObjectId, ObjectID } = require("mongodb");
dataAccessLayer.connect();

//Create Server
const app = express();

//TODO: add in middleware: cors, body-parser
app.use(cors());
app.use(bodyParser.json());

//TODO: add the endpoints: app.get('/path', () )
app.get("/api/posts/:id", async (request, response) => {
  const postId = request.params.id;

  if (!ObjectID.isValid(postId)) {
    response.status(400).send(`PostID ${postId} is incorrect.`);
    return;
  }

  const postQuery = {
    _id: new ObjectId(postId),
  };
  let post;
  try {
    post = await dataAccessLayer.findOne(postQuery);
  } catch (error) {
    response.status(404).send(`Post with id ${postId} not found!`);
    return;
  }

  response.send(post);
});

app.get("/api/posts", async (request, response) => {
  const posts = await dataAccessLayer.findAll();

  response.send(posts);
});

app.post("/api/posts", async (request, response) => {
  const body = request.body;

  if (!body.name || !body.definition || !body.resources) {
    response
      .status(400)
      .send(
        "Bad Request. Validation Error. Missing name, definition, or resources!"
      );
    return;
  }

  if (typeof body.name !== "string") {
    response.status(400).send("The name parameter must be of type string.");
    return;
  }

  if (typeof body.definition !== "string") {
    response.status(400).send("The definition parameter must be of type string.");
    return;
  }

  if (typeof body.resources !== "array") {
    response.status(400).send("The resources parameter must be of type array.");
    return;
  }

  await dataAccessLayer.insertOne(body);

  response.status(201).send();
});

app.put("/api/posts/:id", async (request, response) => {
  const postId = request.params.id;
  const body = request.body;

  if (!ObjectID.isValid(postId)) {
    response.status(400).send(`PostID ${postId} is incorrect.`);
    return;
  }

  if (body.name && typeof body.name !== "string") {
    response.status(400).send("The name parameter must be of type string.");
    return;
  }

  if (body.definition && typeof body.definition !== "string") {
    response.status(400).send("The definition parameter must be of type string.");
    return;
  }

  if (body.resources && typeof body.resources !== "array") {
    response.status(400).send("The resources parameter must be of type string.");
    return;
  }

  const postQuery = {
    _id: new ObjectId(postId),
  };

  try {
    await dataAccessLayer.updateOne(postQuery, body);
  } catch (error) {
    response.status(404).send(`Post with id ${postId} not found!`);
    return;
  }

  response.send();
});

app.delete("/api/posts/:id", async (request, response) => {
  const postId = request.params.id;

  if (!ObjectID.isValid(postId)) {
    response.status(400).send(`PostID ${postId} is incorrect.`);
    return;
  }

  const postQuery = {
    _id: new ObjectId(postId),
  };

  try {
    await dataAccessLayer.deleteOne(postQuery);
  } catch (error) {
    response.status(404).send(`Post with id ${postId} not found!`);
    return;
  }

  response.send();
});
//Starting server
const port = process.env.PORT ? process.env.PORT : 3005;
app.listen(port, () => {
  console.log("API STARTED!");
});