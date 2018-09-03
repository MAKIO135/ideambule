// Printer code
var CONFIG = require('./config/config.js');
const Printer = require( 'thermalprinter' );
const SerialPort = require( 'serialport' );
const _ = require('lodash');

//
// thermal printer configuration
//
const printerPort = new SerialPort( 
  CONFIG.printer.portName, {
  baudRate : CONFIG.printer.baudRate
});

printerPort.on( 'open', () => {
  console.log( '-> printerPort opened' );
  printer = new Printer( printerPort, CONFIG.printer.opts );
  printer.on( 'ready', () => {
    printer
    .printLine( 'printer ready' )
    .lineFeed( 4 )
    .print( () => {
      printerReady = true;
      console.log( '-> print done!' );
      console.log( '-> printer ready' );
    });
  });
});

//
// PrintShoppingList function
// Taking a random Item of rss Feed
//
function printShoppingList (shoppingList) {
  if(printerReady && shoppingList.ingredients){
    printerReady = false;

    console.log(shoppingList);
    _.each(shoppingList.ingredients, function(ingredient) {
      printer
        .printLine(ingredient.name + " : " + ingredient.quantity + (ingredient.unit ? ingredient.unit : ''));
    });

    printer
      .lineFeed(4)
      .print(function() {
      printerReady = true;
      console.log( '-> print done!' );
      console.log( '-> printer ready' );
    });

  } else {
    console.log( 'Waiting for printer' );
  }
}

// Api code
var http = require('http');
var express = require('express');

var app = express();
app.use(express.json());

//var bodyParser = require('body-parser')
//app.use(bodyParser.urlencoded());
//app.use(bodyParser.json());
//app.use(express['static'](__dirname ));

// create application/json parser
//var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Express route for incoming requests for a customer name
app.post('/shopping-list', function(req, res) {
  printShoppingList(req.body.shoppingList);
  res.status(200).send('Ok');
}); 

// Express route for any other unrecognised incoming requests
app.get('*', function(req, res) {
  res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, Something went wrong!');
  } else {
    next(err);
  }
});

app.listen(3000);
console.log('App Server running at port 3000');
