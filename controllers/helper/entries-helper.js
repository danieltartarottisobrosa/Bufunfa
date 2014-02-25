'use strict';

var Entry = require( '../../models/entry' );

module.exports = function( app ) {

	app.get( '/helper/entries/retrieve/:entry', function( req, res ) {
		res.json( req.entry );
	});

	app.get( '/helper/entries/list', function( req, res ) {
		var query = Entry.find().sort( 'date' );
		
		query.exec( function( err, entries ) {
			res.json({ error: err, entries: entries });
		});
	});

	app.get( '/helper/entries/delete/:entry', function( req, res ) {
		req.entry.remove();
		res.send( 'removed' );
	});

	app.get( '/helper/entries/delete-all', function( req, res ) {
		Entry.remove( {}, function(){} );
		res.send( 'all deleted' );
	});

	app.get( '/helper/entries/list', function( req, res ) {
		var query = Entry.find().sort( 'date' );
		
		query.exec( function( err, entries ) {
			res.json({ error: err, entries: entries });
		});
	});
};