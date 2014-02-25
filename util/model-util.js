'use strict';

function ModelUtil() {
	var that = this;
	
    that.createModel = function( req, res ) {
        var model = {};

        model.session = req.session;
        model.cookies = req.cookies;

        return model;
    };
    
};

module.exports = new ModelUtil();