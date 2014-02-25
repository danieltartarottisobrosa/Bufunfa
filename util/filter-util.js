'use strict';

function FilterUtil() {
	var that = this;
	
	function initFilter( req, filterName ) {
		if ( !req.session.filters ) {
			req.session.filters = {};
		}
		
		if ( !req.session.filters[ filterName ] ) {
			req.session.filters[ filterName ] = {};
		}
	}
	
	that.getFilter = function( req, filterName ) {
		initFilter( req, filterName );
		return req.session.filters[ filterName ];
	};
	
};

module.exports = new FilterUtil();