const express = require('express');
const app = express();
const request = require('request');
const response = require('response');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://kolimayurs:29031991@cluster0-onizc.mongodb.net';


app.get('/img', (req, res) => {
	MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) {
            return res.send(err);
        }
        var dbo = db.db("myDB");
        var myobj = { URL: req.query.url};
        dbo.collection("ImageImpression").insertOne(myobj, function(err, result) {
            if (err) {
                return res.send(err);
            }
            request.get(req.query.url)
		    .on('response', response => {
		      res.setHeader('Content-Type', 'image/png');

		      // pipe response to res 
		      // since response is an http.IncomingMessage
		      response.pipe(res);
		    });
            db.close();
        });
    });
    
});
app.get('/count', (req, res) => {
MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) {
            return res.send(err);
        }
        var dbo = db.db("myDB");
        var myobj = { URL: req.query.url };
        dbo.collection("ImageImpression").find(myobj).toArray(function(err, result) {
    if (err) throw err;
    res.send('count: '+result.length);
    db.close();
  });
    });
});

/*
app.get('/',(req,res) => {


	res.setHeader('Content-Type', 'image/png');
	res.send('<img src="https://in.bmscdn.com/mailers/images//170501promotion/visa_pn1.jpg" />');
})*/
const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
	console.log('Port listen to '+PORT);
})