const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

// MongoDB Connection

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1lp5l5h.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const dbConnect = async (req, res) => {
  try {
    const resourceCollection = client.db("Person_DB").collection("resources");

    app.post("/people", async (req, res) => {
      const resource = req.body;
      const query = {
        firstName: resource.firstName,
        lastName: resource.lastName,
        age: resource.age,
        email: resource.email,
      };
      const existed = await resourceCollection.find(query).toArray();
      if (existed.length) {
        const message = `You have already added ${resource.firstName}`;
        return res.send({ acknowledged: false, message });
      }
      const result = await resourceCollection.insertOne(resource);
      res.send(result);
    });

    app.get("/people", async (req, res) => {
      const result = await resourceCollection.find({}).toArray();
      res.send(result);
    });
  } finally {
  }
};
dbConnect().catch((error) => console.log(error.message));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is listening in port: ${port}`);
});
