const request = require('supertest');
const app = require('../src/index');
const { resetRateLimitCache } = require('../src/rateLimiter');

describe('GET /getCountryByIp', () => {
    beforeEach(() => {
        resetRateLimitCache();
    });

    it('should return the country name for a valid IP', async () => {
        const res = await request(app).get('/getCountryByIp').query({ ip: '134.201.250.155' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('country');
    });

    it('should return 400 if IP is not provided', async () => {
        const res = await request(app).get('/getCountryByIp');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should fallback to the second vendor after the first vendor hits its rate limit', async () => {
        const logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        // Make 3 requests with different IPs to hit the ipstack rate limit
        for (let i = 1; i <= 3; i++) {
            const ip = `134.201.250.${150 + i}`;
            const res = await request(app).get('/getCountryByIp').query({ ip });
            expect(res.statusCode).toBe(200);  // Expect success for all 3 requests
            expect(res.body).toHaveProperty('country');
        }

        // The next request with a new IP should trigger the fallback to ipinfo as ipstack's rate limit is exceeded
        const fallbackIp = '134.201.250.160';
        const fallbackRes = await request(app).get('/getCountryByIp').query({ ip: fallbackIp });
        expect(fallbackRes.statusCode).toBe(200);  // Expect success as ipinfo should be used
        expect(fallbackRes.body).toHaveProperty('country');

        // Ensure that the log message indicates that the ipstack rate limit was exceeded
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Rate limit exceeded for ipstack'));

        logSpy.mockRestore();
    });

    it('should fail with specific error after both rate limits are hit', async () => {
        const logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        // Make 3 requests with different IPs to hit the ipstack rate limit
        for (let i = 1; i <= 3; i++) {
            const ip = `134.201.250.${160 + i}`;
            const res = await request(app).get('/getCountryByIp').query({ ip });
            expect(res.statusCode).toBe(200);  // Expect success for all 3 requests
            expect(res.body).toHaveProperty('country');
        }

        // Make 3 more requests with different IPs to hit the ipinfo rate limit (fallback)
        for (let i = 1; i <= 3; i++) {
            const ip = `134.201.250.${170 + i}`;
            const res = await request(app).get('/getCountryByIp').query({ ip });
            expect(res.statusCode).toBe(200);  // Expect success for all 3 requests
            expect(res.body).toHaveProperty('country');
        }

        // The 7th request with a new IP should fail as both rate limits are exceeded
        const finalIp = '134.201.250.180';
        const finalRes = await request(app).get('/getCountryByIp').query({ ip: finalIp });
        expect(finalRes.statusCode).toBe(500);  // Expect failure
        expect(finalRes.body).toHaveProperty('error', 'Rate limit exceeded for all vendors or all vendors failed');

        // Ensure that the log messages indicate that both rate limits were exceeded
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Rate limit exceeded for ipstack'));
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Rate limit exceeded for ipinfo'));

        logSpy.mockRestore();
    });
});