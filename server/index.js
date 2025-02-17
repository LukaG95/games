const path = require('path');
const app = require('./app');

require('./startup/routes')(app);
require('./startup/db')();

const port = 3000;
const server = require('./startup/socket')(app, port);

module.exports = server;