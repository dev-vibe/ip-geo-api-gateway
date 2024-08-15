const axios = require('axios');
const VendorAdapter = require('../vendors/vendorAdapter');

class IpinfoAdapter extends VendorAdapter {
    constructor(apiKey) {
        super('ipinfo', 'https://ipinfo.io', apiKey);
    }

    async getCountry(ip) {
        try {
            console.info(`Getting country from ${this.name} for IP ${ip}`);
            const response = await axios.get(`${this.url}/${ip}/json?token=${this.apiKey}`);
            
            return response.data.country;
        } catch (error) {
            console.error(`Error with ${this.name}: ${error.message}`);
            throw error;
        }
    }
}

module.exports = { IpinfoAdapter };
