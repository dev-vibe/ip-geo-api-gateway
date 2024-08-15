// I would probably use Typescript interfaces here on a larger project, but 
// will use a class based approach for this example to avoid any typescript setup issues
class VendorAdapter {
    constructor(name, url, apiKey) {
        this.name = name;
        this.url = url;
        this.apiKey = apiKey;
    }

    async getCountry(ip) {
        throw new Error('Method getCountry() must be implemented.');
    }
}

module.exports = VendorAdapter;
