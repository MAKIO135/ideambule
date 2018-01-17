addEventListener( 'load', e => {
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
		}
	};

	const connectSocket = () => {
		const socket = io();

		socket.on( 'connected', data => {
			console.log( data );
		} );

		socket.on( 'content', data => {
			console.log( data );
		} );
		getGeoloc();
	};
	connectSocket();
} );
