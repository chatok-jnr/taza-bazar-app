const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const farmerRouter = require('./routes/farmerRoutes');

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/farmer', farmerRouter);

module.exports = app;

