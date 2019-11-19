var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

// Mongo
var db
var db
MongoClient.connect('mongodb://qweeeq:qweeeq1@ds157493.mlab.com:57493/kolunya', (err, client) => {
  if (err) return console.log(err);
  db = client.db('kolunya');
})

/* GET home page. */
router.get('/', function(req, res, next) {

  db.collection('day2day').find().sort({date:1}).toArray((err, result) => {
    if (err) console.log(err)
    res.render('index', { obj: result, headArr: headRow()});
    })
  })

module.exports = router;

function headRow() {
  let arr = []
  let hours = 0
  let str
  for(let i = 0; i < 48; i++){
    if(hours < 10){
      str = `0${hours}:`
    } else {
      str = `${hours}:`
    }
    if(i%2 == 0){
      str = str + "00"
    } else {
      str = str + "30"
      hours++
    }
    arr.push(str)
  }
return arr
}
