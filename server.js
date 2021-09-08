// ******************************************
// INITIALIZATION
// ******************************************
// Server specific version of Zone.js for SSR
require('zone.js/dist/zone-node');
require("dotenv").config();
const response = require('./config/response')

// Dependencies
const express = require('express');
const ngUniversal = require('@nguniversal/express-engine');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Express and Port
const app = express();
const port = process.env.PORT || 3000;

// Server Bundle
const appServer = require('./dist-server/main.bundle');

// Connect to database via mongoose
mongoose.connect(config.database)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
const angular = require('./routes/angular');
const api = require('./routes/api');

// ******************************************
// MIDDLEWARE
// ******************************************
// Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// ******************************************
// ROUTES
// ******************************************
// Server side-rendering of root route
app.get('/', angular.serverRouter);

// API calls go here
app.use('/api', api);

// Serve static files
app.use(express.static(`${__dirname}/dist`));

// Configure Angular Express engine
app.engine('html', ngUniversal.ngExpressEngine({
    bootstrap: appServer.AppServerModuleNgFactory
}));
app.set('view engine', 'html');
app.set('views', 'dist');

// Direct all other routes to index.html
app.get('*', angular.serverRouter);

// ******************************************
// API ERROR HANDLER
// ******************************************
// Error handler for 404 - Page Not Found
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    return response.singleData(res, 404, "", err.message);
});

// Error handler for all other errors
app.use(function (err, req, res, next) {
    console.log(err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    return response.singleData(res, err.status || 500, "", err.message);
});

// ******************************************
// SERVER START
// ******************************************
app.listen(port, () => console.log(`Server started on port ${port}`));