'use strict';

var layouts = [
        { id: 'itau', label: 'Itaú' },
        { id: 'caixa', label: 'Caixa Econômica Federal' },
        { id: 'sicredi', label: 'Sicredi' }
    ],
    Entry = require( '../models/entry' );

module.exports = function ( app ) {

	app.get( '/import', function ( req, res ) {
		res.render( 'import', {
			layouts: layouts
		});
	});

	app.post( '/import', function( req, res ) {
        var model = {
                layouts: layouts
            },
            parser = require( '../models/file-parsers/' + req.body.layout + '-parser' );

        Entry.importFile( req.files.file, parser, function( err ) {
            if ( err ) {
                model.error = true;

            } else {
                model.success = true;
            }

            res.render( 'import', model );
        });
	});

};