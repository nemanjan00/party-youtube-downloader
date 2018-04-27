#!/usr/bin/env node

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

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response) {
	response.render("index");
});

var i = 0;

var encode =  function(data){
	data = data
		.replace("š", "s")
		.replace("đ", "dj")
		.replace("č", "c")
		.replace("ć", "c")
		.replace("ž", "z")
		.replace("Š", "S")
		.replace("Đ", "Dj")
		.replace("Č", "C")
		.replace("Ć", "Ć")
		.replace("Ž", "Ž")
		.replace(/[^\x00-\x7F]/g, "");

	return data;
}

app.get('/download/:id', function(request, response) {
	response.setHeader("Content-Description", "File Transfer");
	response.setHeader("Content-Type", "audio/m4a");

	var downloader = ytdl('https://www.youtube.com/watch?v='+request.params.id, {filter: 'audioonly'});

	downloader.on("info", function(info, formats){
		response.setHeader("Content-Disposition", "attachment; filename=\""+(++i)+"_"+encode(info.title)+".m4a\"");

		downloader.on("error", function(data){
			response.end();
		});

		downloader.on("data", function(data){
			response.write(data);
		});

		downloader.on("end", function(data){
			response.end();
		});
	});

	downloader.on("error", function(data){
		console.log(data);
	});
});

app.get('/stream/:id', function(request, response) {
	response.setHeader("Content-Description", "File Transfer");
	response.setHeader("Content-Type", "audio/m4a");

	var downloader = ytdl.getInfo('https://www.youtube.com/watch?v='+request.params.id, {filter: 'audioonly'}, function(err, info){
		console.log(err);

		for(i = 0; i < info.formats.length; i++){
			if(info.formats[i].resolution === null){
				response.redirect(info.formats[i].url);
				break;
			}
		}
	});

	/*downloader.on("info", function(info, formats){
		console.log(formats);

		response.redirect(formats.url);
	});*/
});

app.listen(app.get('port'), function () {
	console.log('Started web server on port: ' + app.get('port'));
});

module.exports = {};

