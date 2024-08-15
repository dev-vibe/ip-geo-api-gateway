# IP Geo API Gateway

This project is a simple API gateway server that provides the country name associated with an IP address. The server is designed to be easily extendable and scalable, allowing for the addition of new vendors or features with minimal changes to the codebase.

## Features

- Fetches the country name based on IP address using multiple vendors (`ipstack` and `ipinfo.io`).
- Implements naive caching for previously requested IP addresses to reduce API calls and improve performance.
- Global rate limits per vendor with fallback to other vendors if a limit is exceeded.
- Proper error handling to ensure the system remains robust even in cases of vendor failures or exceeded rate limits.
- Easily extendable to support additional vendors or custom logic in the future.

## Installation

### Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ip-geo-api-gateway.git
   cd ip-geo-api-gateway
   ```
2. **Install dependencies:** 
   ```bash
   npm install
   ```
3. **Create a .env file:** 
   Copy the .env.example file and rename it to .env. Update the values as needed.
   ```bash
    cp .env.example .env
    ```

## Running the Server

To start the server, run the following command:
```bash
npm start
```

The server will start on the port specified in the .env file (default: 3000).

## API Usage

### Get Country by IP
- Endpoint:
    ```bash
    GET /getCountryByIp?ip=IP_ADDRESS
    ```
- Query Parameters:
    - ip: The IP address you want to look up.

- Response:
    - On success:
        ```json
        {
            "country": "US"
        }
        ```
    - On error (e.g., missing IP or rate limit exceeded):
        ```json
        {
            "error": "Error message explaining the issue"
        }

        ```

- Example Request
    ```bash
    curl http://localhost:3000/getCountryByIp?ip=8.8.8.8
    ```

## Testing
Run the tests using Jest:
```bash
npm test
```

This will run the automated tests located in the **tests/** directory to ensure that all functionality is working as expected.

## Extending the API

The API is designed to be easily extendable using the Adapter pattern. To add a new vendor:
1. Create a new adapter that extends the `VendorAdapter` class (found in `src/vendorAdapter.js`).
2. Implement the `getCountry` method in the new adapter to handle the vendor-specific API response.
3. Add the new adapter to the `vendors` array in `src/vendorService.js`.
4. Update the rate limits configuration as necessary.

