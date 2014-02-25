'use strict';
require( 'date-utils' );

function DateUtil() {
	var that = this;
	
	that.init = function() {
		Date.prototype.toString = 
			Date.prototype.toLocaleString = 
				Date.prototype.toDateString = function() {
			return that.dateToString( this );
		};
		
		Date.prototype.toFirstMoment = function() {
			return that.firstMoment( this );
		};
		
		Date.prototype.toLastMoment = function() {
			return that.lastMoment( this );
		};
		
	};
	
	that.month = {};
	
	Object.defineProperty( that.month, 'firstDate', {
		get: function() {
			var now = new Date();
			return new Date( now.getFullYear(), now.getMonth(), 1 );
		}
	});
	
	Object.defineProperty( that.month, 'lastDate', {
		get: function() {
			var now = new Date(),
				year = now.getFullYear(),
				month = now.getMonth();
			
			return new Date( year, month, Date.getDaysInMonth( year, month ) );
		}
	});
	
	that.firstMoment = function( date ) {
		date.setHours( 0 );
		date.setMinutes( 0 );
		date.setSeconds( 0 );
		date.setMilliseconds( 0 );
		return date;
	};
	
	that.lastMoment = function( date ) {
		date.setHours( 23 );
		date.setMinutes( 59 );
		date.setSeconds( 59 );
		date.setMilliseconds( 9999 );
		return date;
	};
	
	that.stringToDate = function( strDate ) {
		var aux = strDate.split( '-' ),
			year = parseInt( aux[ 0 ], 10 ),
			month = parseInt( aux[ 1 ], 10 ) - 1,
			date = parseInt( aux[ 2 ], 10 );
		
		return new Date( year, month, date );
	};
	
	that.dateToString = function( date ) {
		return date.getFullYear() + '-' + to2Digits( date.getMonth() + 1 ) + '-' + to2Digits( date.getDate() );
	};
	
	function to2Digits( strNum ) {
		var str = "" + strNum;
		
		while ( str.length < 2 ) {
			str = "0" + str;
		}
		
		return str;
	}
};

module.exports = new DateUtil();