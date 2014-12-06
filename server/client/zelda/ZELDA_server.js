//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN


exports.init = function(app){
	app.get('/zelda', function (req, res) {
		res.sendfile(__dirname  + '/server/client/zelda/index.html');
	});
}




