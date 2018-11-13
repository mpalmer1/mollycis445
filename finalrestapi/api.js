var express = require('express');
var app = express();

const mongoClient = require('mongodb').MongoClient; // initializes the mongodb library and gets a client objec


mongoClient.connect("mongodb://omega.unasec.info", function(err, client) {

    if(!err){
        const collection = client.db('amazon').collection('reviews');
        
        console.log("We are connected to mongodb...");
        
        
        //********** Gets a review by ID **********//
        app.get('/review/:reviewid', function(req, res){
    
            let review_id = req.params.reviewid;
            console.log("ID for review: " + review_id);
            
            collection.aggregate([
                {$limit: 100},
                {
                    $match: {"review.id" : review_id}
                }
                ]).toArray(function(err, results){
                    if(!err){
                        for(var i = 0; i < results.length; i++){
                            console.log(results[i]);
                        }
                    }
                    else{
                        console.log(err);
                    }
            });
        client.db.close();
        });
        
        
        
        //********** Gets a random review by stars **********//
        app.get('/review/random/:n/:stars', function(req, res){
           
            let review_stars = req.params.review_stars;
            console.log("Stars for review: " + review_stars);
           
            collection.aggregate([
                {
                    $limit: 100
                },
                {
                   $match: {"review.star_rating" : review_stars}
                }
            ]).toArray(function(err, results){
                if(!err){
                    for(var i = 0; i < results.length; i++){
                        console.log(results[i]);
                    }
                }
                else{
                    console.log(err);
                }
            });
        client.db.close();
        });
        
        
        
        //********** Gets a random review by date **********//
        app.get('/review/:n/:from_date/:to_date', function(req, res){
            
            let to_date = req.params.to_date;
            let from_date = req.params.from_date;
           
            let to = new Date(to_date);
            let from = new Date(from_date);
            
            collection.aggregate([
                {$limit: 10},
                {
                    $match: {
                        "review.date" : {$gt:  from},
                        "review.date" : {$lt:  to}
                    }
                }
            ]).toArray(function(err, results){
                if(!err){
                    for(var i = 0; i < results.length; i++){
                        console.log(results[i]);
                    }
                }
                else{
                    console.log(err);
                }
            });
        client.db.close();
        });
        
        
        
        //********** Add a random review **********//
        app.post('/review/:reviewid', function(req, res){
            let review_id = req.params.reviewid;
            
            let newReview = {
                "day" : 5,
                "marketplace" : "US",
                "customer_id" : "02121997",
                "vine" : "N",
                "verified_purchase" : "Y",
                "review" : {
                        "id" : review_id,
                        "headline" : "Five Stars",
                        "body" : "Kept me warm in the winter",
                        "star_rating" : 5,
                        "date" : "ISODate(\"2018-11-12T00:00:00Z\")"
                },
                "product" : {
                        "id" : "B01234567",
                        "parent" : "994364774",
                        "title" : "Fuzzy Socks",
                        "category" : "Apparel"
                },
                "votes" : {
                        "helpful_votes" : 0,
                        "total_votes" : 0
                }
            };
            
            collection.insertOne(newReview, function(err, response){
                if(!err){
                    console.log("Added review for: " + review_id);
                }
                else{
                    console.log(err);
                }
            });
        client.db.close();
        });
        
        
        
        //********** Update a random review **********//
        app.put('/review/:reviewid', function(req, res){
            let review_id = req.params.reviewid;
            
            collection.updateOne(
                {
                    "review.id" : "$review_id"
                },
                {
                    $set:
                    {
                        "$review.headline" : "This pair of socks is even better"
                    }
                },
                function(err, response){
                    if(!err){
                        console.log("Updated a review for: " + review_id);
                    }
                    else{
                        console.log(err);
                    }
                }
            );
        client.db.close();
        });
        
    
        //********** Deleted a random review **********//
        app.delete('/review/:reviewid', function(req, res){
            let review_id = req.params.reviewid;
    
            collection.deleteOne(
                {
                    "review.id" : review_id
                },
                function(err, response){
                    if(!err){
                        console.log("Deleted a review for: " + review_id);
                    }
                    else{
                        console.log(err);
                    }
                }
            );
        client.db.close();
        });
        
        
        
        
        
        
        //*********************** ADDITIONAL QUERIES ***********************//
        app.get('/review/avg/:from/:to', function(req, res) {
            let to = req.params.to;
            let from = req.params.from;
           
            let to_date = new Date(to);
            let from_date = new Date(from);
            
            collection.aggregate([
                {$limit: 100},
                 {
                    $match: {
                        "review.date" : {$gt:  from_date},
                        "review.date" : {$lt:  to_date}
                    }
                },
                {
                    $group:{
                        _id: null,
                        avgHelpful: {$avg: "$review.star_rating"}
                    }
                }
            ]).toArray(function(err, results){
                if(!err){
                    for(var i = 0; i < results.length; i++){
                        console.log(results[i]);
                    }
                }
                else{
                    console.log(err);
                }
            });
        client.db.close();
        });
        
        
        app.get('/review/helpful/product/id/:prodid', function(req, res) {
            let product_id = req.params.prodid;
            
            collection.aggregate([
                {
                    $limit: 100
                },
                {
                    $group:
                    {
                        _id: product_id,
                        avgVotes : {$avg: "$votes.helpful_votes"}
                    }
                }
            ]).toArray(function(err, results){
                if(!err){
                    for(var i = 0; i < results.length; i++){
                        console.log(results[i]);
                    }
                }
                else{
                    console.log(err);
                }
            });
        client.db.close();
        });
        
    }
    
});
app.listen(8080);        
        