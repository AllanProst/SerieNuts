var express   = require('express');
var app = express();


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var fileUpload = require("express-fileupload");

var Trello = require("trello");
var trello = new Trello("9603bc7c9a3c59641cbd504787ab613e", "7df626b71b4cb849b6d1f70ef7dc890d72d1c84eb054cd4c6fb509fdc5981515");

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(fileUpload());

//// CONNECTION DB MLAB
var mongoose = require("mongoose");
var options = { server: { socketOptions: { connectTimeoutMS: 30000 } },  };

mongoose.connect(
  "mongodb://cowboys:serienuts@ds121534.mlab.com:21534/serienuts",
  {useMongoClient: true},
  function(err) {
    if (err) {
      console.log("erreur : " + err);
    } else {
      console.log("bien connecté à DB Mlab serie_nuts");
    }
  }
);

// schemas
var nutSchema = mongoose.Schema({
  nutFromDB_id: Number, 
});

// models
var NutModel = mongoose.model("nuts", nutSchema);


app.get('/', function(req, res) {
  res.render('index');
});

app.get("/findnuts", function(req, res) {
  var nutIDsFromDB = [];
  NutModel.find(function(err, nuts) {
    //console.log('dans find');
    var nutFromDB;
    for (var i = 0; i < nuts.length; i++) {
      nutIDfromDB = nuts[i].nutFromDB_id;
      nutIDsFromDB.push(nutIDfromDB);
    }
    res.json(nutIDsFromDB);
  })
});

app.post('/addfav', function(req, res) {
 
  var newNut = new NutModel({
    nutFromDB_id: req.body.nut_id,
  });

  newNut.save(function(error, nut) {
    if (error) {
      console.log(error);
    } else {
      console.log("save DB ok : " + nut);
      res.json(nut);
    }

  });


});

app.post('/delfav', function(req, res) {
  console.log('id to delete : ' + req.body.nut_id)

});





var port = process.env["PORT"] || 8080;

app.listen(port, function() {
  console.log("Server listening on port 8080");
});
