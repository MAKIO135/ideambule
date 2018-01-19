const SerialPort = require( 'serialport' );
const parsers = SerialPort.parsers;
const Printer = require( 'thermalprinter' );


// images paths
const baseImagesPath = __dirname + '/images/',
	startImagePath = baseImagesPath + 'start.jpg',
	endImagePath = baseImagesPath + 'end.jpg';


let printer,
	printerReady = false;

// thermal printer port
const printerPort = new SerialPort( '/dev/ttyS0', {
	baudRate : 19200
} );

printerPort.on( 'open', () => {
	console.log( '-> printerPort opened' );
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
		print( cat );
	}
	catch( e ){
		console.log( e );
	}
} );


// print function
function print( catNum ){
	if( printerReady ){
		printerReady = false;

		let cat = catNum == 0 ? 'm5' :
			catNum == 1 ? 'm15' :
			'p15';

	  	let n = catNum == 0 ? ~~( Math.random() * 5 ) :
			catNum == 1 ? ~~( Math.random() * 3 ) :
			~~( Math.random() * 3 );

		let imagePath = baseImagesPath + cat + '-' + n + '.jpg';
		console.log( imagePath );

		printer
			// .printImage( startImagePath )
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
