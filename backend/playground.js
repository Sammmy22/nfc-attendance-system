const { MongoClient, ServerApiVersion } = require("mongodb");

// Replace the placeholder with your Atlas connection string
const uri =
  "mongodb+srv://sambhavc225:T949thGOXXFmzIlN@attendance-app.lsgbgfh.mongodb.net/?retryWrites=true&w=majority&appName=attendance-app";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const db = client.db("class");
    const coll = db.collection("students");
    // console.log(coll);

    const resArr = await coll.find({ nuid: "2C3387A3" }).toArray();
    // console.log(resArr);

    for (let i = 0; i < resArr.length; i++) {
      console.log(resArr[i]);
    }

    // await coll.updateOne(
    //   { email: "sean_bean@gameofthron.es" },
    //   { $set: { name: "sambhav" } }
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
