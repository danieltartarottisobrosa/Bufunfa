'use strict';

var Entry = require( '../models/entry' ),
	Group = require( '../models/group' );

module.exports = function ( app ) {

	app.get( '/summary', function ( req, res ) {
		
		Group.find( {}, function( err, groups ) {
			
			
			res.render( 'summary', {} );
		});
	});

};