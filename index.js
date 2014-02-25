'use strict';


var kraken = require('kraken-js'),
    db = require('./lib/database'),
    ParamsLoader = require('./lib/params-loader'),
    app = {};

require('./lib/helper-formatDate');

app.configure = function configure(nconf, next) {
    // Async method run on startup.
    db.config( nconf.get('databaseConfig') );
    next(null);
};


app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
    // Run before any routes have been added.
};


app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
    ParamsLoader.load( server );
};


if (require.main === module) {
    kraken.create(app).listen(function (err) {
        if (err) {
            console.error(err);
        }
    });
}


module.exports = app;