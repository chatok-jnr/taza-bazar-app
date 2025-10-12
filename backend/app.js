const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const farmerRouter = require('./routes/farmerRoutes');
const consumerRouter = require('./routes/consumerRoutes');
const buyerRouter = require('./routes/buyerRoutes');
const farmerBidRouter = require('./routes/farmerBidRoutes');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/farmer', farmerRouter);
app.use('/api/v1/consumer', consumerRouter);
app.use('/api/v1/buyer', buyerRouter);
app.use('/api/v1/farmerBid', farmerBidRouter); //http://127.0.0.1:8000/api/v1/farmerBid

module.exports = app;