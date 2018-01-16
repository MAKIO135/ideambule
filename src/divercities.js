const config = require( './config' ),
      fetch = require( 'node-fetch' );

const baseUrl_1dlab = 'https://api.divercities.eu/';

module.exports = {
  authentication_token: null,
  uuid_1dlab: null,

  createSession: function() {
    return fetch( baseUrl_1dlab + 'v2/session', {
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
        return { authentication_token_1dlab, uuid_1dlab };
      } );
  },

  getCapsules: function(location) {
    return fetch( baseUrl_1dlab + `v2/capsules?lat=${ location.lat }&long=${ location.long }&per_page=30`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'X-Auth-Token': authentication_token_1dlab,
              'X-User-Uuid': uuid_1dlab
          }
      } )
      .then( res => {return res.json()} )
      .catch( error => console.error( 'Error:', error ) ) // check 401
  }
};
