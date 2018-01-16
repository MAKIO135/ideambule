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
			timeout: 15000,
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
		getGeoloc();
	};
	connectSocket();

	const populate = ( data ) => {

	};


	const card = document.querySelector( '#card' );
	TweenMax.to( card, 0.5, {
		left: '-100vh',
		delay: 0.5,
		ease: Power3.easeInOut
	} );

	async function constructInterface(){
		let items = await fetch( 'data/data.json' )
			.then( res => res.json() )
			.catch( err => console.error( err ) )
			.then( response => response );
		return items;
	};
	constructInterface().then( items => console.log( items ) );
} );
