var incomings = [];

$(document).ready(function(){
	//console.log('Ready');
	$.get('/api/incomingtrade', function(result){
		if (result.errCode !== 0) {
			window.location = '/';
		}
		else {
			incomings = result.trades;
			for (var i = 0; i < incomings.length; i++) {
				var str = 
					'<div class="around">' +
						'<span class="label">' + incomings[i].title + ' - from ' + incomings[i].from + '</span>';
				if (!incomings[i].accept) {
					str += '<button class="btn btn-primary">Accept</button>';
				}
						 str+=
						'<button class="btn btn-danger">Cancel</button>' +
					'</div>'
				$('.container').append(str);
			}
		}
	});
	$(document).on('click', '.btn-primary', function(){
		var index = $(this).parent().index();
		var btnAccept = $(this);
		console.log(index);
		$.post('/api/accept', {
			tradeId: incomings[index].tradeId
		}, function(result){
			if (result.errCode === 0) {
				btnAccept.remove();
			}
			else {
				alert(result.msg);
			}
		});
	});
	$(document).on('click', '.btn-danger', function(){
		var index = $(this).parent().index();
		console.log(index);
		var parent = $(this).parent();
		$.post('/api/cancel', {
			tradeId: incomings[index].tradeId
		}, function(result) {
			if (result.errCode === 0) {
				parent.remove();
				incomings.splice(index, 1);
			}
			else {
				alert(result.msg);
			}
		})
	});
});