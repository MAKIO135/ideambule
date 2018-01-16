const connectSocket = () => {
	const socket = io();

	socket.on( 'connected', data => {
		console.log( data );
	} );

	socket.on( 'content', data => {
		console.log( data );
	} );

	const getGeoloc = () => {
		let options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		};

		function success( pos ){
			let coords = pos.coords;

			console.log( 'Your current position is:' );
			console.log( `Latitude : ${ coords.latitude }` );
			console.log( `Longitude: ${ coords.longitude }` );
			console.log( `More or less ${ coords.accuracy } meters.` );
			socket.emit( 'located', { lat: coords.latitude, long: coords.longitude } );
		};

		function error( err ){
			console.warn( `ERROR(${ err.code }): ${ err.message }` );
		};

		navigator.geolocation.getCurrentPosition( success, error, options );
	};
	getGeoloc();
};

const populate = () => {

};

let data;

function preload(){
	data = loadJSON( 'data/data.json' );
}

function setup(){
	let canvas = createCanvas( windowWidth, windowHeight );
	canvas.parent( 'over' );

	connectSocket();
	poputlate();
}

function windowResized(){
	resizeCanvas( windowWidth, windowHeight );
}

function draw(){
	clear();
	ellipse( mouseX, mouseY, 50 );
}
