'use strict';

var Entry = require( '../entry' );

function parseDate( strDate ) {
	var aux = strDate.split( '/' ),
		day = parseInt( aux[ 0 ], 10 ),
		month = parseInt( aux[ 1 ], 10 ) - 1,
		year = parseInt( aux[ 2 ], 10 );

	return new Date( year, month, day );
}

function itauParser() {
	return {
		parseFile: function( data ) {
			var rows = data.split( '\r\n' ),
				i, len, row, fields,
				entry, entries,
				value;

			entries = [];
			
			for ( i = 0, len = rows.length; i < len; i++ ) {
				row = rows[ i ];

				if ( row.length === 0 ) {
					continue;
				}

				fields = row.split( ';' );
				value = fields[ 2 ].replace( ',', '.' );

				entry = new Entry({
					raw: row,
					date: parseDate( fields[ 0 ] ),
					description: fields[ 1 ],
					value: parseFloat( value, 10 )
				});

				entries.push( entry );
			}

			return entries;
		}
	};
}

module.exports = itauParser();