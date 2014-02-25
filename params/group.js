'use strict';
var Group = require( '../models/group' );

module.exports = function( server ) {

    server.param( 'group', function( req, res, next, id ) {
    	Group.findOne( { _id: id }, function( err, group ) {
    		req.group = group;
    		next();
    	});
    });
};