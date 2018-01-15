( () => {
	const socket = io();

	socket.on( 'connected', data => {
		console.log( data );
	} );
} )();
