var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));

var io = require('socket.io')(server);

function isQuestion(msg) {
	return msg.match(/\?$/);
}

function askingTime(msg) {
	return msg.match(/time/i)
}

function askingWeather(msg) {
	return msg.match(/weather/i)
}

function getWeather(callback) {
	var request = require('request');
	request.get('https://www.metaweather.com/api/location/4118/', function(error, res) {
		console.log(res.statuscode)
		// if (!error && res.statuscode == 200) {
			
			var data = JSON.parse(res.body)
			console.log(data.consolidated_weather[0].weather_state_name)
			callback(data.consolidated_weather[0].weather_state_name)
		// }
	})
}

function call(weather) {
    		console.log('work')
    		io.emit('message', weather)
    	}

io.on('connection', function (socket) {
  
  socket.on('message', function (msg) {
    console.log('Received Message: ', msg);
    if (isQuestion(msg)) {
    	io.emit('message', msg);
    } else if(askingTime(msg)) {
    	io.emit('message', new Date)
    } else if (askingWeather(msg)) {
    	getWeather(call)
    }
  });
});

server.listen(5000, function() {
  console.log('Chat server running');
});