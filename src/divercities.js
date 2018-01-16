const fetch = require( 'node-fetch' );
let config = null;
if( ! process.env.heroku ) config = require( './config' );

const baseUrl_1dlab = 'https://api.divercities.eu/';

Divericities = {
  authentication_token: null,
  uuid: null,

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
        this.authentication_token = response.authentication_token;
        this.uuid = response.uuid;

        console.log( { authentication_token: this.authentication_token, uuid: this.uuid } );
        return { authentication_token: this.authentication_token, uuid: this.uuid };
      } );
  },

  getCapsules: function(location) {
    let params = {lat: location.lat, long: location.long, per_page: 30};
    return this._requestApi('v2/capsules', params)
      .then( res => {return res.json()} )
      .catch( error => console.error( 'Error:', error ) ) // check 401
  },

  getCapsule: function(id, location) {
    let params = {lat: location.lat, long: location.long};
    return this._requestApi(`v2/capsules/${id}`, params)
      .then( res => {return res.json()} )
      .catch( error => console.error( 'Error:', error ) ) // check 401
  },

  _requestApi: function(path, params={}) {
    let queryString = Object.entries(params).map((k,i) => `${k[0]}=${k[1]}`);
    return fetch( baseUrl_1dlab + `${ path }?${ queryString.join('&') }`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'X-Auth-Token': this.authentication_token,
              'X-User-Uuid': this.uuid
          }
      } )
  }
};


module.exports = Divericities;