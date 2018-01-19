const SerialPort = require( 'serialport' );
const Printer = require( 'thermalprinter' );

// arduino and thermal printer ports
const arduinoPort = new SerialPort( '/dev/ttyAMA0', {
	baudRate : 9600,
	parser: SerialPort.parsers.readline( '\n' )
} );
const printerPort = new SerialPort( '/dev/ttyS0', {
	baudRate : 19200
} );

// images paths
const baseImagesPath = __dirname + '/images/',
	startImagePath = baseImagesPath + 'start.jpg',
	endImagePath = baseImagesPath + 'end.jpg';

let printer,
	printerReady = false;

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

arduinoPort.on( 'open', () => {
	arduinoPort.on('data', data => {
		console.log( 'Data:', data );
	} );
} );

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
				console.log( 'done' );
				process.exit();
			} );
	}
	else{
		console.log( 'Waiting for printer' );
	}
}
