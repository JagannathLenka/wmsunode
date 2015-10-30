module.exports = {
	serviceUrl : function() {
		var app = require('../app.js')
		if ( app.get('env') === 'development' ) {
   			return 'http://localhost:3001'	 
		}
		else{
			return 'http://wmsservice.herokuapp.com'
		}
	}
}