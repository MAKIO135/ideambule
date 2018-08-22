var CONFIG        = require('./config/config.js');

const SerialPort = require( 'serialport' );
const parsers = SerialPort.parsers;
const Printer = require( 'thermalprinter' );
var feed = {}


// images paths
const baseImagesPath = __dirname + '/images/',
	startImagePath = baseImagesPath + 'start.jpg',
	endImagePath = baseImagesPath + 'end.jpg';


let printer,
	printerReady = false;

// RSS Parser
let Parser = require('rss-parser');
let rssParser = new Parser();

//
// RSS feeding if app is configured for this feature
//
if (CONFIG.app.contentType == "rss") {
	(async () => {
	  feed = await rssParser.parseURL(CONFIG.app.rssServer);
	  console.log("reading rss feed");
	 
	  // feed.items.forEach(item => {
	  //   console.log('\n*' + item.title + '*:\n' + item.link)
	  //   console.log('\guid : ' + item.guid + '\n')
	  //   console.log('\nDescription : ' + item.description + '\n')
	  //   console.log("\ndc:date : " + item['dc:date'])
	  //   console.log("\ndc:format : " + item['dc:format'])
	  //   console.log("\ndc:language : " + item['dc:language'])
	  //   console.log("\ndc:creator : " + item['dc:creator'])
	  //   console.log('\ncontentSnippet : ' + item.contentSnippet + '\n')
	  //   console.log("==========>   " + item['content:encoded'])
	  // });
	})();
}

//
// thermal printer configuration
//
// @TODO : Put this const in a config file !
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
			} );
	} );
} );


//
// arduino configuration
// 
const arduinoPort = new SerialPort( 
	CONFIG.arduino.portName, {
	baudRate : CONFIG.arduino.baudRate
	});
const parser = new parsers.Readline( {
	delimiter: '\n'
} );
arduinoPort.pipe( parser );
arduinoPort.on( 'open', () => {
	console.log( '-> arduinoPort opened' );
} );
parser.on( 'data', str => {
	console.log( str );
	try{
		let cat = parseInt( str );
		console.log( { cat } );
		if (CONFIG.app.contentType == "image") {
			print( cat );
		} else {
			printRssItem ();
		}
	}
	catch( e ){
		console.log( e );
	}
} );

//
// print function
// function that prints image contents
//
function print( catNum ){
	if( printerReady ){
		printerReady = false;

		let cat = catNum == 0 ? 'm5' : catNum == 1 ? 'm15' : 'p15';
	  	let n = catNum == 0 ? ran(5) : catNum == 1 ? ran(3) : ran(3);
		let imagePath = baseImagesPath + cat + '-' + n + '.jpg';
		console.log( imagePath );

		printer
			.printImage( imagePath )
			.printImage( endImagePath )
			.lineFeed( 5 )
			.print( () => {
				printerReady = true;
				console.log( '-> print done!' );
				console.log( '-> printer ready' );
			} );
	}
	else{
		console.log( 'Waiting for printer' );
	}
}

//
// PrintRssItem function
// Taking a random Item of rss Feed
//
function printRssItem () {
  	let n = ran(feed.items.length);
	console.log("Printing RSS item #" + n);
	if( printerReady ){
		printerReady = false;

		printer
			.horizontalLine(32)
			.bold(true)
			.big(true)
			.center()
			.printLine("" + feed.items[n].title)
			.big(false)
			.bold(false)
			.small(true)
			.left()
			.printLine("    " + feed.items[n].contentSnippet)
			.lineFeed(4)
			.print(function() {
			printerReady = true;
				console.log( '-> print done!' );
				console.log( '-> printer ready' );
			} );
	}
	else{
		console.log( 'Waiting for printer' );
	}
}


//
// Function that gives a random int frm 0 to max
//
function ran(max){
	return ~~( Math.random() * max);
}
