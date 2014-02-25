'use strict';

var Group = require( '../../models/group' );

module.exports = function( app ) {

	app.get( '/helper/groups/create/:name', function( req, res ) {
		new Group( req.params ).save();
		res.send( 'created' );
	});

	app.get( '/helper/groups/retrieve/:group', function( req, res ) {
		res.json( req.group );
	});

	app.get( '/helper/groups/list', function( req, res ) {
		var query = Group.find().sort( 'date' );
		
		query.exec( function( err, groups ) {
			res.json({ error: err, entries: groups });
		});
	});

	app.get( '/helper/groups/delete/:group', function( req, res ) {
		req.group.remove();
		res.send( 'removed' );
	});

	app.get( '/helper/groups/delete-all', function( req, res ) {
		Group.remove( {}, function(){} );
		res.send( 'all removed' );
	});

	app.get( '/helper/groups/list', function( req, res ) {
		var query = Group.find().sort( 'date' );
		
		query.exec( function( err, groups ) {
			res.json({ error: err, groups: groups });
		});
	});

	app.get( '/helper/groups/create-pattern/:group/:regex', function( req, res ) {
		var group = req.group,
			pattern = req.params.regex;

		group.patterns.push( pattern );
		group.save();

		res.send( 'pattern added' );
	});

	app.get( '/helper/groups/delete-pattern/:group/:regex', function( req, res ) {
		var group = req.group,
			i = group.patterns.indexOf( req.params.regex );

		group.patterns.splice( i, 1 );
		group.save();

		res.send( 'pattern deleted' );
	});

	app.get( '/helper/groups/delete-all-patterns/:group', function( req, res ) {
		var group = req.group;

		group.patterns = [];
		group.save();

		res.send( 'all patterns deleted' );
	});
};