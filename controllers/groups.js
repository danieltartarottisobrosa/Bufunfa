'use strict';
var Group = require( '../models/group' );

module.exports = function ( app ) {
	
	app.get( '/groups', function ( req, res ) {
		var query = Group.find().sort( 'name' );

		query.exec( function( err, groups ) {
			res.render( 'groups', {
				groups: groups
			});
		});
	});

};