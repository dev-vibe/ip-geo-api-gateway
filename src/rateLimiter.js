const NodeCache = require('node-cache');

// Initialize NodeCache
const rateLimitCache = new NodeCache();

// Define rate limits for each vendor from environment variables
const rateLimits = {
    ipstack: { limit: parseInt(process.env.IPSTACK_RATE_LIMIT, 10) || 1000 },
    ipinfo: { limit: parseInt(process.env.IPINFO_RATE_LIMIT, 10) || 50000 },
};

// Helper function to get the current timestamp in milliseconds
const getCurrentTimestamp = () => Date.now();

function rateLimitExceeded(vendorName) {
    const vendorTimestampsKey = `${vendorName}:timestamps`;
    let timestamps = rateLimitCache.get(vendorTimestampsKey) || [];

    // Filter out timestamps that are older than 1 hour (3600000 ms)
    const oneHourAgo = getCurrentTimestamp() - 3600000;
    timestamps = timestamps.filter(timestamp => timestamp > oneHourAgo);

    // Update the cache with the filtered timestamps
    rateLimitCache.set(vendorTimestampsKey, timestamps);

    if (timestamps.length >= rateLimits[vendorName].limit) {
        return true;
    }

    // If the rate limit is not exceeded, record the new request
    timestamps.push(getCurrentTimestamp());
    rateLimitCache.set(vendorTimestampsKey, timestamps);
    
    return false;
}

function resetRateLimitCache() {
    rateLimitCache.flushAll();
}

module.exports = { rateLimitExceeded, resetRateLimitCache };