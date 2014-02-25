'use strict';

var Entry = require( '../models/entry' ),
	Group = require( '../models/group' ),
	ModelUtil = require( '../util/model-util' ),
	DateUtil = require( '../util/date-util' ),
	FilterUtil = require( '../util/filter-util' );

module.exports = function ( app ) {

	function redirectDetailed( req, res, model ) {
		var entriesQuery = Entry.find().sort({ 'date': -1 }),
			groupsQuery = Group.find().sort( 'name' ),
			periodFilter = FilterUtil.getFilter( req, 'period' );

		if ( !periodFilter.from ) {
			periodFilter.from = DateUtil.month.firstDate.toString();
		}
		
		if ( !periodFilter.to ) {
			periodFilter.to = DateUtil.month.lastDate.toString();
		}
		
		entriesQuery = entriesQuery.where( 'date' ).gte( DateUtil.stringToDate( periodFilter.from ).toFirstMoment() );
		entriesQuery = entriesQuery.where( 'date' ).lte( DateUtil.stringToDate( periodFilter.to ).toLastMoment() );
		
		entriesQuery.exec( function( err, entries ) {
			groupsQuery.exec( function( err, groups ) {
				model.entries = entries;
				model.groups = groups;
				res.render( 'detailed', model );
			});
		});
	}

	app.get( '/detailed', function ( req, res ) {
		redirectDetailed( req, res, ModelUtil.createModel( req, res ) );
	});

	app.post( '/detailed/save-changes', function ( req, res ) {
		var entriesCount = 0,
			readyCount = 0;

		function doYouCanRedirect() {
			if ( readyCount === entriesCount ) {
				var model = ModelUtil.createModel( req, res );
				model.success = true;
				redirectDetailed( req, res, model);
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
			var model = ModelUtil.createModel( req, res );
			model.error = true;
			redirectDetailed( req, res, model );
		}
	});
};