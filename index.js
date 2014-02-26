'use strict';


var kraken = require('kraken-js'),
	express = require( 'express' ),
	db = require('./lib/database'),
	ParamsLoader = require('./lib/params-loader'),
	app = {};

require('./lib/helper-formatDate');
require('./util/date-util').init();

app.configure = function configure(nconf, next) {
    // Async method run on startup.
    db.config( nconf.get('databaseConfig') );
    next(null);
};


app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.
    server.use(express.methodOverride());
	server.use( express.basicAuth( 'danieltsobrosa', '112358' ) );
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