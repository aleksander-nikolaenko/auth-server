const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

global.basedir = __dirname;

const authRouter = require('./auth/router');

const { errorHandler } = require('./middleware');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('', authRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

module.exports = app;
