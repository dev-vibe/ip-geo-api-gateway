require('dotenv').config();
const express = require('express');
const apiController = require('./apiController');

const app = express();
app.use(express.json());

app.get('/getCountryByIp', apiController.getCountryByIp);

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
