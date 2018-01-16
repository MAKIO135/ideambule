const config = require( './config' ),
      Divercities = require( './divercities' ),
      fetch = require( 'node-fetch' );

module.exports = {
  getContentFromLocation: location => {
    console.log('location', location );
    return Divercities
            .getCapsules(location)
            .then( response => {
              console.log( 'Success:', response );
              return response;
            } );
  }
};