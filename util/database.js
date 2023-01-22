const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://aniketsaurav:Aniket%232486@cluster0.xxs8c7n.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Database Connected");
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect;
