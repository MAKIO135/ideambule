const card = {
	display: false,
	x: -1,
	y: -1,
	w: 0,
	h: 0
};

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

const populate = ( data ) => {

};

function preload(){
	let data = loadJSON( 'data/data.json' );
	console.log( data );
	populate( data );
}

function setup(){
	let canvas = createCanvas( windowWidth, windowHeight );
	canvas.parent( 'over' );

	connectSocket();
}

function windowResized(){
	resizeCanvas( windowWidth, windowHeight );
}

function draw(){
	clear();

	// card
	push();
	translate( card.x, card.y );

	noStroke();
	fill( '#3a2f64' );
	rect( 0, 0, card.w, card.h );
	pop();

	// timer
	push();
	stroke( 255 );
	noFill();
	ellipse( 50, height/2, 50 );
	pop();
}

function mousePressed(){
	if( !card.display ){
		TweenMax.fromTo( card, 0.3, {
			x: width,
			y: 0,
			w: width,
			h: height,
		}, {
			x: 0,
			onComplete: toggleCard
		} );
	}
	else{
		TweenMax.fromTo( card, 0.3, {
			x: 0,
			y: 0,
			w: width,
			h: height,
		}, {
			x: width,
			onComplete: toggleCard
		} );
	}
}

function toggleCard(){
	card.display = !card.display;
}
