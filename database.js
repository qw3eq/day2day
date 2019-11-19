// MongoDB 
var MongoClient = require('mongodb').MongoClient;

var db

MongoClient.connect('mongodb://qweeeq:qweeeq1@ds157493.mlab.com:57493/kolunya', (err, client) => {
  if (err) return console.log(err);
  db = client.db('kolunya');
  console.log("DB is connected");
})

module.exports = db;