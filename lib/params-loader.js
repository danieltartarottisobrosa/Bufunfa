'use strict';

function ParamsLoader() {
	var fs = require( 'fs' );

	this.load = function( server ) {
		var files = fs.readdirSync( './params' ),
			i = 0,
			len = files.length,
			param;

		for ( ; i < len; i++ ) {
			param = require( '../params/' + files[ i ] );
			param( server );
		}
	};
}

module.exports = new ParamsLoader();