TwinBcrypt = require('./twin-bcrypt.min.js');
// progress appelé qu'à partir de 6.

//var a = TwinBcrypt.hash('password', 7, process, callback);

function process() {
    console.log('processing',arguments);
}

function callback(err, res) {
    console.log('Done : ', res);
}

	function string2utf8Bytes(s) {
		return unescape(encodeURIComponent(s)).split('').map(function(c){return c.charCodeAt(0);});
	}


console.log(string2utf8Bytes('héllo'));
