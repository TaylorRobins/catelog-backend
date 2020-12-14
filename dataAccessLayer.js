// TODO: "require" mongodb
// TODO: "requre" env file

const { query } = require("express");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
//TODO: read those env variables from the process.env.VAR_NAME
const url = process.env.MONGODB_URL;
const databaseName = process.env.MONGODB_DATABASE;

const collectionName = "posts";
const settings = {
  useUnifiedTopology: true,
};

let databaseClient;
let postCollection;

const connect = function () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, settings, (error, client) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      databaseClient = client.db(databaseName);
      postCollection = databaseClient.collection(collectionName);
      console.log("SUCCESSFULLY CONNECTED TO DATABASE!");
      resolve();
    });
  });
};

const insertOne = function (post) {
  return new Promise((resolve, reject) => {
    postCollection.insertOne(post, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log("SUCCESSFULLY INSERTED A NEW DOCUMENT");
      resolve();
    });
  });
};

const findAll = function () {
  const query = {};

  return new Promise((resolve, reject) => {
    postCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log(`SUCCESSFULLY FOUND ${documents.length} DOCUMENTS`);
      resolve(documents);
    });
  });
};

const findOne = function (query) {
  return new Promise((resolve, reject) => {
    postCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      if (documents.length > 0) {
        console.log("SUCCESSFULLY FOUND DOCUMENT!");
        const document = documents[0];
        resolve(document);
      } else {
        reject("No document found!");
      }
    });
  });
};

const updateOne = function (query, newPost) {
  const newPostQuery = {};

  if (newPost.name) {
    newPostQuery.name = newPost.name;
  }

  if (newPost.definition) {
    newPostQuery.definition = newPost.definition;
  }

  if (newPost.info) {
    newPostQuery.info = newPost.info;
  }

  if (newPost.resources) {
    newPostQuery.resources = newPost.resources;
  }

  return new Promise((resolve, reject) => {
    postCollection.updateOne(query, { $set: newPostQuery }, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      } else if (result.modifiedCount === 0) {
        console.log("No Document Found");
        reject("No Document Found");
        return;
      }
      console.log("SUCCESSFULLY UPDATED DOCUMENT!");
      resolve();
    });
  });
};

const deleteOne = function (query) {
  return new Promise((resolve, reject) => {
    postCollection.deleteOne(query, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      } else if (result.deletedCount === 0) {
        console.log("No Document Found");
        reject("No Document Found");
        return;
      }
      console.log("SUCCESSFULLY DELETED DOCUMENT!");
      resolve();
    });
  });
};

module.exports = { connect, insertOne, findAll, findOne, updateOne, deleteOne };

//TODO: Define all functions that talk to Database
/*
        -connect()
        
        finddAll() documents (Read - R from CRUD)
        -findOne() document (Read) optional
        -insertOne() document (Create - C from CRUD)
        -updateOne() document (UPDATE - U from CRUD)
        -deleteOne() document (DELETE - D from CRUD)
    */

// TODO: module.exports = {connect,...}
