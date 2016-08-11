var outcomings = [];

$(document).ready(function(){
	$.get('/api/outcomingtrade', function(result){
		if (result.errCode !== 0) {
			window.location = '/';
		}
		else {
			outcomings = result.trades;
			for (var i = 0; i < outcomings.length; i++) {
				var str = 
					'<div class="around">' +
						'<span class="label">' + outcomings[i].title + 
						' - to ' + outcomings[i].to + '</span>'+
						'<button class="btn btn-danger">Cancel</button>' +
					'</div>'
				$('.container').append(str);
			}
		}
	});
	$(document).on('click', '.btn-danger', function(){
		var index = $(this).parent().index();
		var parent = $(this).parent();
		$.post('/api/cancel', {
			tradeId: outcomings[index].tradeId
		} ,function(result){
			if (result.errCode === 0) {
				parent.remove();
				outcomings.splice(index, 1);
			}
			else {
				alert(result.msg);
			}
		})
	});
});