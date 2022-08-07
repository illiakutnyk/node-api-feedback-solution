const mongoose = require('mongoose');

async function clearData() {
  const collections = Object.keys(mongoose.connection.collections);
  const promises = collections.map(
    collection => mongoose.connection.collections[collection].deleteMany({}));

  await Promise.all(promises);
}

module.exports = clearData;
