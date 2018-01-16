const Divercities = require( './divercities' ),
	Ideambule = require( './ideambule' ),
	fetch = require( 'node-fetch' ),
	express = require( 'express' ),
	app = express(),
	server = require( 'http' ).Server( app ),
	io = require( 'socket.io' ).listen( server );


// Server
server.listen( process.env.PORT || 8080, '0.0.0.0' );

app.use( express.static( __dirname + '/public' ) );
app.get( '/', ( req, res ) => {
    res.sendfile( 'index.html' );
} );


// 1DLab authentication
Divercities.createSession()
	.then(() => {
		// Sockets.io communication
		io.on( 'connection' , socket => {
		  socket.emit( 'connected', { authentication_token: Divercities.authentication_token, uuid: Divercities.uuid } );

			socket.on( 'located', location => {
				console.log('located', location);
				Ideambule
					.getContentFromLocation(location)
					.then(function(content) {
						socket.emit( 'content', content );
					});
			} );
		} );
	});
