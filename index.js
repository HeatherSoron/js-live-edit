const PORT = 37981;

const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const fs = require('fs');

app.use(express.static("public"));


io.on('connection', (socket) => {
	console.log("got connection")
	socket.emit('hello', 'initializing...');
});

{
	var watching = false;
	fs.watch('./iframe_public', {persistent: true}, (type, filename) => {
		if (watching) {
			return false;
		}

		if (filename.match(/\.html$/)) {
			watching = true;
			setTimeout(() => {
				fs.readFile(`./iframe_public/${filename}`, function(err, raw) {
					io.emit('update', {filename, src: raw.toString()});
				});
				watching = false;
			}, 100);
		}
	})
}


server.listen(PORT, function() {
	console.log('Listening on port ' + PORT);
})
