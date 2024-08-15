// Only for POC. Usually I would use Redis cluster or whatever 
// solution we use for server-independent key/value store

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // Cache items for 1 hour

const get = (key) => cache.get(key);
const set = (key, value) => cache.set(key, value);

module.exports = { get, set };
