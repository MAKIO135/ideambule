const SerialPort = require( 'serialport' );
// const serialPort = new SerialPort( 'COM8', { baudRate : 19200 } ); // windows
const serialPort = new SerialPort( '/dev/ttyACM0', { baudRate : 19200 } ); // raspberry pi
const Printer = require( 'thermalprinter' );

let path = __dirname + '/images/plan.png';

serialPort.on( 'open', () => {
	let opts = { maxPrintingDots: 10, heatingTime: 100, heatingInterval: 3, commandDelay: 3 };
	let printer = new Printer( serialPort, opts );
	printer.on( 'ready', () => {
		printer
			// .indent( 10 )
			// .horizontalLine( 16 )
			// .bold( true )
			// .indent( 10 )
			// .printLine( 'first line' )
			// .bold( false )
			// .inverse( true )
			// .big( true )
			// .right()
			// .printLine( 'second line')
			.printImage( path)
			.print( () => {
				console.log( 'done' );
				process.exit();
			} );
	} );
} );
