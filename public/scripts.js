var socket = io.connect('/');
var userId = '';
var otherUsers = [];

socket.on('init', function (data) {
	userId = data;
	$(document).mousemove(function(e){
		var widthRatio = e.clientX * 100 / window.innerWidth;
		var heightRatio = e.clientY * 100 / window.innerHeight;
		widthRatio = widthRatio.toFixed(2);
		heightRatio = heightRatio.toFixed(2);
		socket.emit('move', {
			id: userId,
			top: heightRatio,
			left: widthRatio
		});
	});
});

socket.on('others move', function (data) {
	if (otherUsers.indexOf(data.id) === -1){
		otherUsers.push(data.id);
		var element = '<div class="cursor fa fa-mouse-pointer"';
		element += 'id="' + data.id + '"';
		element += 'style="top:' + data.height + '%;';
		element += 'left:' + data.width + '%;"></div>';
		$('#art-board').append(element);
	}else{
		$('#' + data.id)
			.css('top', data.top + '%')
			.css('left', data.left + '%');
	}
});

socket.on('delete', function (data) {
	$('#' + data).remove();
	var i = otherUsers.indexOf(data);
	otherUsers.splice(i, 1);
});
