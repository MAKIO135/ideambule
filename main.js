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
		maxPrintingDots: 7,
		heatingTime: 200,
		heatingInterval: 2,
		commandDelay: 3
	};

	printer = new Printer( printerPort, opts );

	printer.on( 'ready', () => {
		printer
			.printImage( endImagePath )
			.print( () => {
				printerReady = true;
				console.log( '-> print done!' );
				console.log( '-> printer ready' );
				process.exit();
			} );
	} );
} );


// arduino port
const arduinoPort = new SerialPort( '/dev/ttyAMA0', {
	baudRate : 9600
} );
const parser = new parsers.Readline( {
	delimiter: '\n'
} );
arduinoPort.pipe( parser );
arduinoPort.on( 'open', () => {
	console.log( '-> arduinoPort opened' );
} );
parser.on( 'data', data => {
	console.log( 'Data:', data );
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

		printer
			// .printImage( startImagePath )
			.printImage( imagePath )
			.printImage( endImagePath )
			.print( () => {
				printerReady = true;
				console.log( '-> print done!' );
				console.log( '-> printer ready' );
				process.exit();
			} );
	}
	else{
		console.log( 'Waiting for printer' );
	}
}
