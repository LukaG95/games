const helmet = require('helmet');
const compression = require('compression');
const xss = require('xss-clean');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet({
    contentSecurityPolicy: false,
  }));
app.use(compression());
app.use(xss());

module.exports = app;