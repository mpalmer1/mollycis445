//Sample Rest API Calls
//Molly Palmer


var express = require('express');
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Get a review by ID
app.get('/reviews/:reviewid', function(req, res) {
  let reviewid = req.params.reviewid;
  res.json({"reviewid": reviewid});
});


//Get random reviews by number of stars
app.get('/reviews/:n/:stars', function(req, res) {
  let n = req.params.n;
  let stars = req.params.stars;
  res.json({"product type": n,
            "number of stars": stars});
});


//Get random reviews by date
app.get('/reviews/:n/:from_date/:to_date', function(req, res) {
  let n = req.params.n;
  let from_date = req.params.from_date;
  let to_date = req.params.to_date;
  res.json({"product type": n,
            "start date": from_date,
            "end date": to_date});
});


//Post a new review by ID
app.post('/reviews', function (req, res) {
  var newReview = {
    reviewid : req.body.reviewid
  };
  res.json(newReview);
});


//Update a review
app.put('/reviews/:reviewid', function (req, res) {
  let reviewid = req.params.reviewid;
  res.json({"reviewid": reviewid,
            "old rating": 3,
            "new rating": 4});
});


//Delete a review by ID
app.delete('/reviews/:reviewid', function(req, res) {
  let reviewid = req.params.reviewid;
  res.json({"deleted id": reviewid});
});
app.listen(8080);

