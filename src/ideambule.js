const Divercities = require( './divercities' ),
      fetch = require( 'node-fetch' ),
      LESS_THAN_5_MINUTES = 'm5',
      LESS_THAN_15_MINUTES = 'm15',
      MORE_THAN_15_MINUTES = 'p15';


const getContentFromLocation = (location) => {
  console.log('location', location );
  return Divercities
          .getCapsules(location, 30)
          .then( response => {
            const filteredCapsules = response.capsules.filter((capsule) => {
              return capsule.resource_types.length > 3;
            });
            // console.log('capsules', response.capsules.length, filteredCapsules.length);
            const rand = generateDifferentRandom(0, filteredCapsules.length, -1);
            const rand2 = generateDifferentRandom(0, filteredCapsules.length, rand);

            return Divercities.getCapsule(filteredCapsules[rand].id, location)
                          .then( function(capsule) {
                            // console.log('capsule', capsule);
                            categories = explodeCapsule(capsule, {});
                            return Divercities.getCapsule(filteredCapsules[rand2].id, location)
                                          .then( function(capsule) {
                                            // console.log('capsule', capsule);
                                            return explodeCapsule(capsule, categories);
                                          } );
                          } );
          } );
};

const explodeCapsule = (capsule, init) => {
  const items = capsule.capsule_items;
  // console.log('items', items);
  // categories = items.reduce(function(acc, v) {
  //   if (!acc[v.resource.resource_type]) {
  //     acc[v.resource.resource_type] = [];
  //   }
  //   duration = computeDuration(v);
  //   v.duration = duration;
  //   acc[v.resource.resource_type].push(v);
  //   return acc;
  // }, {});
  // console.log('categories', categories);
  timeCategories = items.reduce(function(acc, v) {
    timeCategory = getTimeCategory(computeDuration(v));
    if (!acc[timeCategory]) {
      acc[timeCategory] = [];
    }
    v.timeCategory = timeCategory;
    acc[timeCategory].push(v);
    return acc;
  }, init);
  if (!timeCategories[MORE_THAN_15_MINUTES]) {
    timeCategories[MORE_THAN_15_MINUTES] = [];
  }
  timeCategories[MORE_THAN_15_MINUTES].push({
    source: 'Divercities',
    timeCategory: MORE_THAN_15_MINUTES,
    resource: {
      id: capsule.id,
      resource_type: 'capsule',
      provider: 'Divercities',
      author: capsule.editorialist.name,
      title: capsule.title,
      cover: capsule.cover
    }
  });
  console.log('categories', timeCategories);
  return timeCategories;
};

const computeDuration = (item) => {
  switch(item.resource.resource_type) {
    case 'playlist':
      return item.resource.tracks.reduce(function(acc, v) {
        return acc + v.duration.seconds;
      }, 0);
      break;
    case 'article':
      return 5*60;
      break;
    case 'book':
      return 60*60;
      break;
    case 'comic':
      return 15*60;
      break;
    case 'music':
      return item.resource.duration.seconds;
      break;
    case 'photography':
      return 5*60;
      break;
    case 'podcast':
      return item.resource.duration.seconds;
      break;
    case 'video':
      return item.resource.duration.seconds;
      break;
    case 'video_game':
      return 10*60;
      break;
    case 'poi':
      return 40*60;
      break;
  }
};

const getTimeCategory = (duration) => {
  if (duration < 5*60) {
    return LESS_THAN_5_MINUTES;
  } else if (duration < 15*60) {
    return LESS_THAN_15_MINUTES;
  } else return MORE_THAN_15_MINUTES;
};

const generateDifferentRandom = (min, max, previous) => {
  rand = min + Math.floor(Math.random() * (max-min));
  while (previous==rand && max-min>1) {
    rand = min + Math.floor(Math.random() * (max-min));
  }
  return rand;
};

module.exports = {
  getContentFromLocation: getContentFromLocation,
  explodeCapsule: explodeCapsule
};
