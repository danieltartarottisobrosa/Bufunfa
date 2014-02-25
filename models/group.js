'use strict';
var mongoose = require('mongoose');

function groupModel() {
	var groupSchema;
	
	groupSchema = new mongoose.Schema({
		name: { type: String, required: true },
		patterns: [ String ]
	});

	return mongoose.model( 'Group', groupSchema );
}

module.exports = groupModel();