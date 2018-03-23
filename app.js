var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var pug = require('pug');
var stylus = require('stylus');
var nib = require('nib');

function compile(str, path) {
	return stylus(str)
		.set('filename', path)
		.set('compress', true)
		.use(nib());
}
app.use(stylus.middleware({
	src: __dirname + '/stylus',
	dest: __dirname + '/public',
	compile: compile
}));

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');

server.listen(process.env.PORT || 3000);
console.log("Server listening on port 3000...");

app.get('/', function(req, res) {
	res.render('index');
});

io.on('connection', function (socket) {
	console.log(socket.id);
	socket.emit('init', socket.id);
	socket.on('move', function (data) {
		console.log(data);
		socket.broadcast.emit('others move', data);
	});
	socket.on('disconnect', function(data){
		console.log(socket.id);
		socket.broadcast.emit('delete', socket.id);
	});
});
