const vendorService = require('./vendorService');
const cache = require('./cache');

const getCountryByIp = async (req, res) => {
    const { ip } = req.query;

    if (!ip) {
        return res.status(400).json({ error: 'IP address is required' });
    }

    // Check cache
    const cachedCountry = cache.get(ip);
    if (cachedCountry) {
        return res.json({ country: cachedCountry });
    }

    try {
        const country = await vendorService.getCountry(ip);
        cache.set(ip, country);
        return res.json({ country });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { getCountryByIp };
