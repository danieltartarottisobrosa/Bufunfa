'use strict';
var DateUtil = require( '../util/date-util' );

module.exports = function ( app ) {
	
	app.post( '/filters/period/set', function( req, res ) {
		req.session.filters.period.from = req.body.from;
		req.session.filters.period.to = req.body.to;
		
		res.redirect( req.body.redirectTo );
	});
};