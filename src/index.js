const Divercities = require( './divercities' ),
	Ideambule = require( './ideambule' ),
	fetch = require( 'node-fetch' ),
	express = require( 'express' ),
	app = express(),
	server = require( 'http' ).Server( app ),
	io = require( 'socket.io' ).listen( server );


let authentication_token_1dlab = null,
	uuid_1dlab = null;

// 1DLab authentication
Divercities.createSession().then(function(res) {
	let {authentication_token_1dlab, uuid_1dlab} = res;
});

// Server
server.listen( process.env.PORT || 8080, '0.0.0.0' );

app.use( express.static( __dirname + '/public' ) );
app.get( '/', ( req, res ) => {
    res.sendfile( 'index.html' );
} );

// Sockets.io communication
io.on( 'connection' , socket => {
  socket.emit( 'connected', { authentication_token_1dlab, uuid_1dlab } );

	socket.on( 'located', location => {
		Ideambule
			.getContentFromLocation(location)
			.then(function(capsules) {
				socket.emit( 'content', capsules );
				console.log('content sent');
			});
	} );
} );
