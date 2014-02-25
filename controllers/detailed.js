'use strict';

var Entry = require( '../models/entry' ),
	Group = require( '../models/group' );

module.exports = function ( app ) {

	function redirectDetailed( req, res, model ) {
		var entriesQuery = Entry.find().sort({ 'date': -1 }),
			groupsQuery = Group.find().sort( 'name' );

		entriesQuery.exec( function( err, entries ) {
			groupsQuery.exec( function( err, groups ) {
				model.entries = entries;
				model.groups = groups;
				res.render( 'detailed', model );
			});
		});
	}

	app.get( '/detailed', function ( req, res ) {
		redirectDetailed( req, res, {} );
	});

	app.post( '/detailed/save-changes', function ( req, res ) {
		var entriesCount = 0,
			readyCount = 0;

		function doYouCanRedirect() {
			if ( readyCount === entriesCount ) {
				redirectDetailed( req, res, { success: true });
			}
		}

		function updateEntryGroup( entryId, groupId ) {
			Entry.findOne( { _id: entryId }, function( err, entry ) {
				entry.group = ( groupId === '' ? null : groupId );

				entry.save( function( err ) {
					readyCount++;
					doYouCanRedirect();
				});
			});
		}

		function countEntries() {
			var key;

			entriesCount = 0;

			for ( key in req.body ) {
				if ( key.indexOf( 'entry-' ) !== -1 && key.indexOf( '-changed' ) === -1 ) {
					entriesCount++;
				}
			}
		}

		function processData() {
			var key,
				currentEntryId,
				currentGroupId,
				aux;

			for ( key in req.body ) {
				aux = key.split( '-' );

				if ( aux[ 0 ] !== 'entry' ) {
					continue;
				}

				if ( aux.length === 3 && aux[ 2 ] === 'changed' ) {
					// flag
					if ( req.body[ key ] === 'true' ) {
						updateEntryGroup( currentEntryId, currentGroupId );
					} else {
						readyCount++;
						doYouCanRedirect();
					}

				} else {
					// grupo
					currentEntryId = aux[ 1 ];
					currentGroupId = req.body[ key ];
				}
			}
		}

		try {
			countEntries();
			processData();

		} catch ( catchErr ) {
			redirectDetailed( req, res, { error: true });
		}
	});
};