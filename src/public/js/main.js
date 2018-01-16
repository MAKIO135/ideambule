const card = {
	lastTouch: Date.now(),
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

	setCardPos( width, 0, width, height );

	connectSocket();
}

function windowResized(){
	resizeCanvas( windowWidth, windowHeight );
}

function draw(){
	clear();

	// card
	if( card.display ){
		push();
		translate( card.x, card.y );

		noStroke();
		fill( '#3a2f64' );
		rect( 0, 0, card.w, card.h );
		pop();
	}

	// timer
	push();
	stroke( 255 );
	noFill();
	ellipse( 50, height/2, 50 );
	pop();
}

function mousePressed(){
	toggleCard();
}

function setCardPos( x, y, w, h ){
	card.x = x;
	card.y = y;
	card.w = w;
	card.h = h;
}

function toggleCard(){
	let ts = Date.now();

	if( ts - card.lastTouch > 1000 ){
		card.display = !card.display;
		if( !card.display ){
			TweenMax.to( card, 0.3, {
				x: 0,
			} );
		}
		else{
			TweenMax.to( card, 0.3, {
				x: width
			} );
		}
	}
}
