const config = require( './config' ),
	fetch = require( 'node-fetch' ),
	express = require( 'express' ),
	app = express(),
	server = require( 'http' ).Server( app ),
	io = require( 'socket.io' ).listen( server );

let authentication_token_1dlab = null,
	uuid_1dlab = null;

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


// fetch( baseUrl + 'v2/capsules/57?lat=45.7515&long=4.9025', {
//     method: 'GET', // or 'PUT'
//     headers: {
//         'Accept': 'application/json',
//         'X-Auth-Token': 'gCbNNFkJ8zyHkPEkQfHH',
//         'X-User-Uuid': 'c0e59bf9-30cd-42c5-a1d8-f03b4f0e4a13'
//     }
// } )
// .then(res => res.json())
// .catch(error => console.error('Error:', error))
// .then( response2 => console.log('Success:', response2));

// session au démarrage du serveur
//+ surveiller on error pour redemander des tokens/uuids


// Server
server.listen( process.env.PORT || 80 );

app.use( express.static( __dirname + '/public' ) );
app.get( '/', ( req, res ) => {
    res.sendfile( 'index.html' );
} );

// Sockets.io communication
io.on( 'connection' , socket => {
    socket.emit( 'connected', { authentication_token_1dlab, uuid_1dlab } );
} );
