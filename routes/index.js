
/*
 * GET home page.
 */

var fs = require('fs');

exports.index = function(req, res){
	var stream = fs.createReadStream(__dirname + '/../src/index.html');
	stream.pipe(res);
};