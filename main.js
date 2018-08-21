const SerialPort = require( 'serialport' );
const parsers = SerialPort.parsers;
const Printer = require( 'thermalprinter' );
var feed = {}
// @TODO : Put this in a config file !
const contentType = "image"; // "rss"


// images paths
const baseImagesPath = __dirname + '/images/',
	startImagePath = baseImagesPath + 'start.jpg',
	endImagePath = baseImagesPath + 'end.jpg';


let printer,
	printerReady = false;

// RSS Parser
let Parser = require('rss-parser');
let rssParser = new Parser();

(async () => {
  // @TODO : Put this URL in a config file !
  feed = await rssParser.parseURL('https://www.erasme.org/spip.php?page=backend&id_rubrique=285');
  console.log(feed.title);
 
  feed.items.forEach(item => {
    console.log('\n*' + item.title + '*:\n' + item.link)
    // console.log('\guid : ' + item.guid + '\n')
    // console.log('\nDescription : ' + item.description + '\n')
    // console.log("\ndc:date : " + item['dc:date'])
    // console.log("\ndc:format : " + item['dc:format'])
    // console.log("\ndc:language : " + item['dc:language'])
    // console.log("\ndc:creator : " + item['dc:creator'])
    console.log('\ncontentSnippet : ' + item.contentSnippet + '\n')
    //console.log("==========>   " + item['content:encoded'])
  });
})();


// thermal printer port
// @TODO : Put this const in a config file !
const printerPort = new SerialPort( '/dev/ttyS0', {
	baudRate : 19200
} );

printerPort.on( 'open', () => {
	console.log( '-> printerPort opened' );
	// @TODO : Put these options in a config file !
	let opts = {
		maxPrintingDots: 10,
		heatingTime: 200,
		heatingInterval: 2,
		commandDelay: 3
	};

	printer = new Printer( printerPort, opts );
	printer.on( 'ready', () => {
		printer
			.printLine( 'printer ready' )
			.lineFeed( 5 )
			.print( () => {
				printerReady = true;
				console.log( '-> print done!' );
				console.log( '-> printer ready' );
			} );
	} );
} );


// arduino port
// @TODO : Put this arduinoPort in a config file !
const arduinoPort = new SerialPort( '/dev/ttyACM0', {
	baudRate : 9600
} );
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
		if (contentType == "image") {
			print( cat );
		} else {
			printRssItem (catNum);
		}
	}
	catch( e ){
		console.log( e );
	}
} );


// print function
function print( catNum ){

		let cat = catNum == 0 ? 'm5' :
			catNum == 1 ? 'm15' :
			'p15';

	  	let n = catNum == 0 ? ~~( Math.random() * 5 ) :
			catNum == 1 ? ~~( Math.random() * 3 ) :
			~~( Math.random() * 3 );

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

// PrintRssItem function
function printRssItem (catNum) {
	var nbItems = feed.items.length;
  	let n = ~~( Math.random() * nbItems );
  	console.log(n);

	printer
		//.indent(10)
		.horizontalLine(16)
		.center()
		.big(true)
		.bold(true)
		//.indent(10)
		.printLine(feed.items[n].title)
		.bold(false)
		.big(false)
		//.inverse(true)
		.right()
		.printLine(feed.items[n].contentSnippet)
		//.printImage(path)
		.lineFeed( 3 )
		.print(function() {
			console.log('done');
			process.exit();
	});
}
