addEventListener( 'load', e => {
	let socket;

	const getGeoloc = callback => {
		let options = {
			enableHighAccuracy: true,
			timeout: 20000,
			maximumAge: 0
		};

		function success( pos ){
			let coords = pos.coords;

			console.log( 'Your current position is:' );
			console.log( `Latitude : ${ coords.latitude }` );
			console.log( `Longitude: ${ coords.longitude }` );
			console.log( `More or less ${ coords.accuracy } meters.` );
			callback( coords );
		}

		function error( err ){
			console.warn( `ERROR(${ err.code }): ${ err.message }` );
		};

		navigator.geolocation.getCurrentPosition( success, error, options );
	};

	const connectSocket = () => {
		socket = io();

		socket.on( 'connected', data => {
			console.log( data );
			getGeoloc( coords => {
				socket.emit( 'located', { lat: coords.latitude, long: coords.longitude } );
			} );

			getGeoloc( coords => {
				socket.emit( 'capsule', {
					capsuleId: 419, //ressource.capsuleId
					itemId: 12645, //ressource.id
					location: {
						lat: coords.latitude,
						long: coords.longitude
					}
				} );
			} );
		} );

		socket.on( 'content', data => {
			console.log( data );
		} );

		socket.on( 'item', data => {
			console.log( data );
		} );
	};
	connectSocket();
} );
