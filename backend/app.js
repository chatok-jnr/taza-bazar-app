const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const farmerRouter = require('./routes/farmerRoutes');
const consumerRouter = require('./routes/consumerRoutes');
const buyerRouter = require('./routes/buyerRoutes');
const farmerBidRouter = require('./routes/farmerBidRoutes');
const farmAlert = require('./routes/farmAlertRoutes');
const consumerAlert = require('./routes/consumerAlertRoutes');
const latestProducts = require('./routes/latestProductsRoutes');
const latestRequest = require('./routes/latestRequestRoutes');

//Admin
const adminRoutes = require('./routes/adminRoutes');
const app = express();

app.use(
  cors({
    origin: ['https://taza-bazar-app-4l7i.onrender.com', 'http://localhost:5173', 'http://localhost:3000', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400 // Cache preflight request for 24 hours
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/farmer', farmerRouter);
app.use('/api/v1/consumer', consumerRouter);
app.use('/api/v1/buyer', buyerRouter);
app.use('/api/v1/farmerBid', farmerBidRouter); //https://taza-bazar-admin.onrender.com/api/v1/farmerBid
app.use('/api/v1/farmAlert', farmAlert);
app.use('/api/v1/consumerAlert', consumerAlert);
app.use('/api/v1/latestProducts', latestProducts)
app.use('/api/v1/latestRequest', latestRequest)

//Admin Routes
app.use('/api/v1/admin', adminRoutes);

// Health check (useful for deployment platforms)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
module.exports = app;