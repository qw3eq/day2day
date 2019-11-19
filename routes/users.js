var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

// Mongo
var db
MongoClient.connect('mongodb://qweeeq:qweeeq1@ds157493.mlab.com:57493/kolunya', (err, client) => {
  if (err) return console.log(err);
  db = client.db('kolunya');
  console.log("DB is connected");
})

// Middleware 

var inputTimeConversion = (req, res, next) => {
  let hours = Number(req.body.time.substring(0,2))
  let minutes = Number(req.body.time.substring(3))
  if(minutes == 30){
    hours += 0.5
  }
  hours *= 2
  req.dbInputTime = hours
  
  next()
} 

var cellsToFill = async (req, res, next) => {
  const result = await db.collection('day2day').findOne({date: req.body.date})   
    try {
    if(!result){
      console.log("Assigning newDay")
      req.newDay = true
      req.cellToFill = 47
    } else {
      req.cellToFill = req.dbInputTime
    }
    
    db.collection('day2day').findOne({}, {sort:{date:-1}}, (err,result) => {
      let index = req.cellToFill - result.type.length + 1
      
      let arr = []
      for(let i = 0; i < index; i++){
        arr.push(req.body.type)
      }

        db.collection('day2day').findOneAndUpdate(
          {_id: result._id},
          {$push: {type: {$each: arr } } }
        )
        console.log(`${req.body.type} is added ${index} times to the same day`)
        
    })
  } catch(err) {
    next(e)
  }  
  next()
}


var nextDay = async (req, res, next) => {
if(req.newDay){
  let arr = []
  for(let i = 0; i <= req.dbInputTime; i++){
    arr.push(req.body.type)
  }
  console.log(`${req.body.type} is added ${req.cellToFill + 1} times to the new date`)
  const result = await db.collection('day2day').insertOne({
    date: req.body.date,
    type: arr  
  })
  try {
    next()
} catch(e) {
  next(e)
} 
}
}

router.use(inputTimeConversion);
router.use(cellsToFill);
router.use(nextDay);


// POST to /addtime
router.post('/', function(req, res, next) {
  console.log("Data added")
  res.redirect('../')
});

module.exports = router;
