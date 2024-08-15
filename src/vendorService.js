const { IpstackAdapter } = require('./vendors/ipstackAdapter');
const { IpinfoAdapter } = require('./vendors/ipinfoAdapter');
const { rateLimitExceeded } = require('./rateLimiter');

const vendors = [
    new IpstackAdapter(process.env.IPSTACK_API_KEY),
    new IpinfoAdapter(process.env.IPINFO_API_KEY),
];

async function getCountry(ip) {
    for (const vendor of vendors) {
        if (rateLimitExceeded(vendor.name)) {
            console.error(`Rate limit exceeded for ${vendor.name}`);
            continue;
        }

        try {
            const country = await vendor.getCountry(ip);
            if (country) {
                return country;  // Early return if successful and country is found
            } else {
                console.error(`No country found for IP ${ip} using ${vendor.name}`);
            }
        } catch (error) {
            console.error(`Error retrieving country from ${vendor.name}:`, error.message);
            continue; // Continue to the next vendor if one fails
        }
    }

    throw new Error('Rate limit exceeded for all vendors or all vendors failed');  // Early error return
}

module.exports = { getCountry };
