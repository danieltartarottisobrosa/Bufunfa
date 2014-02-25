'use strict';

var Entry = require( '../models/entry' ),
	Group = require( '../models/group' ),
	_ = require( 'lodash'),
	ModelUtil = require( '../util/model-util' ),
	DateUtil = require( '../util/date-util' ),
	FilterUtil = require( '../util/filter-util' );

module.exports = function ( app ) {

	app.get( '/summary', function ( req, res ) {
		var model = ModelUtil.createModel( req, res );
		model.groups = [];
		
		function calcSum( sum, value ) {
			return sum + value;
		}
		
		function requestEnd() {
			Entry.find().where( 'group' ).equals( null ).exec( function( err, entries ) {
				var onlyValues = _.pluck( entries, 'value' );
				
				model.groups.push({
					name: 'Sem grupo',
					entries: entries,
					total: _.reduce( onlyValues, calcSum )
				});
				
				res.render( 'summary', model );
			});
		}
		
		function groupEntriesReceived( group, i, len ) {
			return function( err, entries ) {
				var onlyValues = _.pluck( entries, 'value' );
				group.entries = entries;
				
				group.total = _.reduce( onlyValues, calcSum );
				
				// Finaliza o request
				if ( i === len - 1 ) {
					requestEnd();
				}
			};
		}
		
		Group.find().sort( 'name' ).exec( function( err, groups ) {
			var i = 0,
				len = groups.length;
			
			for ( ; i < len; i++ ) {
				var group = groups[ i ],
					periodFilter = FilterUtil.getFilter( req, 'period' );
				
				model.groups.push( group );
				
				if ( !periodFilter.from ) {
					periodFilter.from = DateUtil.month.firstDate.toString();
				}
				
				if ( !periodFilter.to ) {
					periodFilter.to = DateUtil.month.lastDate.toString();
				}
				
				// Monta a query das entries
				var query = Entry.find( { group: group.id } )
						.where( 'date' ).gte( DateUtil.stringToDate( periodFilter.from ).toFirstMoment() )
						.where( 'date' ).lte( DateUtil.stringToDate( periodFilter.to ).toLastMoment() );
				
				query.exec( groupEntriesReceived( group, i, len ) );
			}
		});
	});

};