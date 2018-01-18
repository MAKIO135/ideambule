const SerialPort = require( 'serialport' );
// const printerPort = new SerialPort( 'COM8', { baudRate : 19200 } ); // windows
const arduinoPort = new SerialPort( '/dev/ttyACM0', { baudRate : 9600 } ); // raspberry pi
const printerPort = new SerialPort( '/dev/ttyS0', { baudRate : 19200 } ); // raspberry pi
const Printer = require( 'thermalprinter' );

let baseImagesPath = __dirname + '/images/';
let startImagePath = baseImagesPath + 'start.jpg';
let endImagePath = baseImagesPath + 'end.jpg';

let printer;
let printerReady = false;
printerPort.on( 'open', () => {
	let opts = {
		maxPrintingDots: 10,
		heatingTime: 200,
		heatingInterval: 2,
		commandDelay: 3
	};

	printer = new Printer( printerPort, opts );

	printer.on( 'ready', () => {
		printerReady = true;
		print( 1 );
	} );
} );

arduinoPort.on( 'open' () => {
	
} );

function print( n ){
	if( printerReady ){
		printerReady = false;

		let cat = n == 0 ? 'm5' :
				  n == 1 ? 'm15' :
				  'p15';

		// let imagePath = baseImagesPath + cat + '-' + ~~( Math.random() * 3 ) + '.jpg';
		let imagePath = baseImagesPath + cat + '-' + ~~( Math.random() * 0 ) + '.jpg';

		printer
			.printImage( startImagePath )
			.printImage( imagePath )
			.printImage( endImagePath )
			.print( () => {
				printerReady = true;
				console.log( 'done' );
				process.exit();
			} );
	}
	else{
		console.log( 'Waiting for printer' );
	}
}
