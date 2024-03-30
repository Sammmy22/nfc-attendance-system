const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const cors = require("cors");
app.use(cors());

// Make sure to include the url in .env file
const uri = process.env.MONGO_URL;
let db, coll, students;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

server.listen(3000, "0.0.0.0", async () => {
  console.log("Socket listening on port 3000");

  await client.connect();
  db = client.db("class");
  coll = db.collection("students");
  students = await coll.find().toArray();

  students.map((student) => {
    student.attendance = false;
  });
});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("fetch", () => {
    // Emitting the response back to the client
    socket.emit("response", students);
  });
});

app.get("/class/:nuid", async (req, res) => {
  const nuid = req.params.nuid;

  if (!nuid) {
    return;
  }

  async function run() {
    try {
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );

      const student = students.filter((student) => student.nuid === nuid);

      const resObj = student[0];
      resObj.attendance = true;

      res.json(resObj);
      io.emit("mark", students);
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);
});
