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

	app['delete']( '/groups/:group/delete-pattern/:pattern', function( req, res ) {
		var group = req.group,
			pattern = parseInt( req.params.pattern, 10 );

		group.patterns.splice( pattern, 1 );
		res.redirect( '/groups' );
	});

};