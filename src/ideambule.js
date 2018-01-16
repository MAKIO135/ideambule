const Divercities = require( './divercities' ),
      fetch = require( 'node-fetch' );


const getContentFromLocation = (location) => {
  console.log('location', location );
  return Divercities
          .getCapsules(location)
          .then( response => {
            // console.log('capsules', response);
            const filteredCapsules = response.capsules.filter((capsule) => {
              return capsule.resource_types.length > 3;
            });
            const rand = Math.floor(Math.random() * filteredCapsules.length);
            // console.log( 'Success:', randomCapsule );

            return Divercities.getCapsule(filteredCapsules[rand].id, location)
                          .then( function(capsule) {
                            console.log('capsule', capsule);
                            return explodeCapsule(capsule);
                          } );
          } );
};

const explodeCapsule = (capsule) => {
  const items = capsule.capsule_items;
  // console.log('items', items);
  categories = items.reduce(function(acc, v) {
    if (!acc[v.resource.resource_type]) {
      acc[v.resource.resource_type] = [];
    }
    acc[v.resource.resource_type].push(v);
    return acc;
  }, {});
  console.log('categories', categories);
  return categories;
};


module.exports = {
  getContentFromLocation: getContentFromLocation,
  explodeCapsule: explodeCapsule
};