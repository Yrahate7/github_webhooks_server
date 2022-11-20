const config = require('./config');
const express = require('express');

const webserver = express();
webserver.use(express.json());

webserver.post("/", async (request, response) => {
    console.log(request.body);
    response.json();
});


webserver.listen(config.PORT, () => {
    console.log("Listening on port " + config.PORT);
});
