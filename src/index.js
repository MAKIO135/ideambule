const fetch = require( 'node-fetch' ),
	express = require( 'express' ),
	app = express(),
	server = require( 'http' ).Server( app ),
	io = require( 'socket.io' ).listen( server );

let config = null;
if( ! process.env.heroku ) config = require( './config' );

let authentication_token_1dlab = null,
	uuid_1dlab = null;

// 1DLab authentication
let baseUrl_1dlab = 'https://api.divercities.eu/';
fetch( baseUrl_1dlab + 'v2/session', {
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json',
	    },
	    body: JSON.stringify( config || {
	        "email": process.env.email,
	        "password": process.env.pwd,
	        "lat": process.env.lat,
	        "long": process.env.long
	    } )
	} )
	.then( res => res.json() )
	.catch( error => console.error( 'Error:', error ) )
	.then( response => {
		console.log( 'Success:', response );
		authentication_token_1dlab = response.authentication_token;
		uuid_1dlab = response.uuid;

		console.log( { authentication_token_1dlab, uuid_1dlab } );
	} );


// Server
server.listen( process.env.PORT || 8080 );

app.use( express.static( __dirname + '/public' ) );
app.get( '/', ( req, res ) => {
    res.sendfile( 'index.html' );
} );

// Sockets.io communication
io.on( 'connection' , socket => {
    socket.emit( 'connected', { authentication_token_1dlab, uuid_1dlab } );

	socket.on( 'located', location => {
		console.log( location );
		fetch( baseUrl_1dlab + `v2/capsules?lat=${ location.lat }&long=${ location.long }&per_page=30`, {
		    method: 'GET',
		    headers: {
		        'Accept': 'application/json',
		        'X-Auth-Token': authentication_token_1dlab,
		        'X-User-Uuid': uuid_1dlab
		    }
		} )
		.then( res => res.json() )
		.catch( error => console.error( 'Error:', error ) ) // check 401
		.then( response =>{
			console.log( 'Success:', response );
			socket.emit( 'content', response );
		} );
	} );
} );
