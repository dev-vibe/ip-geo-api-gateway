const axios = require('axios');
const VendorAdapter = require('../vendors/vendorAdapter');

class IpstackAdapter extends VendorAdapter {
    constructor(apiKey) {
        super('ipstack', 'http://api.ipstack.com', apiKey);
    }

    async getCountry(ip) {
        try {
            console.info(`Getting country from ${this.name} for IP ${ip}`);
            const response = await axios.get(`${this.url}/${ip}?access_key=${this.apiKey}`);
            
            return response.data.country_code;
        } catch (error) {
            console.error(`Error with ${this.name}: ${error.message}`);
            throw error;
        }
    }
}

module.exports = { IpstackAdapter };
