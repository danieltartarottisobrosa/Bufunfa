'use strict';

var Entry = require( '../models/entry' ),
	Group = require( '../models/group' ),
	_ = require( 'lodash');

module.exports = function ( app ) {

	app.get( '/summary', function ( req, res ) {
		var model = {
			groups: []
		};
		
		function requestEnd() {
			res.render( 'summary', model );
		}
		
		function groupEntriesReceived( group, i, len ) {
			return function( err, entries ) {
				var onlyValues = _.pluck( entries, 'value' );
				group.entries = entries;
				
				group.total = _.reduce( onlyValues, function( sum, value ) {
					return sum + value;
				});
				
				// Finaliza o request
				if ( i === len - 1 ) {
					requestEnd();
				}
			};
		}
		
		Group.find( {}, function( err, groups ) {
			var i = 0,
				len = groups.length;
			
			for ( ; i < len; i++ ) {
				var group = groups[ i ];
				model.groups.push( group );
				
				Entry.find( { group: group.id }, groupEntriesReceived( group, i, len ) );
			}
		});
	});

};