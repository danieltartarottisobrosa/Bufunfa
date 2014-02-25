'use strict';
var mongoose = require('mongoose'),
	fs = require( 'fs' ),
	Group = require( './group' );

function entryModel() {
	
	var entrySchema = new mongoose.Schema({
		raw: { type: String, required: true },
		date: { type: Date, required: true },
		description: { type: String, required: true },
		value: { type: Number, required: true },
		group: mongoose.Schema.ObjectId
	});

	entrySchema.static( 'importFile', function( file, parser, callback ) {
		var that = this,
			data = fs.readFileSync( file.path, { encoding: 'UTF-8' }),
			entries = parser.parseFile( data ),
			i, len, entry,
			saveCount = 0,
			patternMap = {};

		// Cria o mapeamento pattern: group
		function createPatternMapping( groups ) {
			var group, i, gLen,
				pattern, j, pLen;

			for ( i = 0, gLen = groups.length; i < gLen; i++ ) {
				group = groups[ i ];

				for ( j = 0, pLen = group.patterns.length; j < pLen; j++ ) {
					pattern = group.patterns[ j ];
					patternMap[ pattern ] = group;
				}
			}
		}

		function saveEntry( entry ) {
			return function( err, dbEntry ) {
				saveCount++;

				if ( !dbEntry ) {
					entry.save();
				}

				if ( saveCount === entries.length ) {
					callback();
				}
			};
		}

		function findGroup( entry ) {
			var pattern,
				regex;

			for ( pattern in patternMap ) {
				regex = new RegExp( pattern );

				if ( regex.test( entry. description ) ) {
					return patternMap[ pattern ].id;
				}
			}

			return null;
		}

		Group.find( {}, function( err, groups ) {
			createPatternMapping( groups );

			for ( i = 0, len = entries.length; i < len; i++ ) {
				entry = entries[ i ];
				entry.group = findGroup( entry );

				that.findOne( { raw: entry.raw }, saveEntry( entry ) );
			}
		});
	});

	return mongoose.model( 'Entry', entrySchema );
}

module.exports = entryModel();