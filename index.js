// Packages

var path = require("path");

var express = require("express");
var ytdl = require("ytdl-core");

// Global variables

var songs = [];

// Express settings

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Express routing

app.use(express.static('public'));

app.get('/', function(request, response) {
	response.render("index");
});

var i = 0;

app.get('/stream/:id', function(request, response) {
	response.setHeader("Content-Description", "File Transfer");
	response.setHeader("Content-Type", "audio/m4a");

	var downloader = ytdl('https://www.youtube.com/watch?v='+request.params.id, {filter: 'audioonly'});

	downloader.on("info", function(info, formats){
		response.setHeader("Content-Disposition", "attachment; filename=\""+(++i)+"_"+info.title+".m4a\"");

		downloader.on("data", function(data){
			response.write(data);
		});

		downloader.on("end", function(data){
			response.end();
		});
	});
});

app.listen(app.get('port'), function () {
	console.log('Started web server on port: ' + app.get('port'));
});

