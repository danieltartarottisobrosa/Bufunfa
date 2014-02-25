'use strict';
var Entry = require( '../models/entry' );

module.exports = function( server ) {

    server.param( 'entry', function( req, res, next, id ) {
    	Entry.findOne( { _id: id }, function( err, entry ) {
    		req.entry = entry;
    		next();
    	});
    });
};