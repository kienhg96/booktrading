var items = [];
$(document).ready(function(){
	$.get('/api/allbook', function(result){
		if (result.errCode === 0) {
			items = result.items
		}
		for (var i = 0; i < items.length; i++) {
			var str = 
				'<div class="elem">' +
					'<img src="' + items[i].thumbnail + '"/>';
			if (items[i].trade) {
				str += '</div>';
			}
			else {
				str += '<a class="trade" href="#"><i class="fa fa-retweet"></i></a>'
				'</div>';
			}
			$('.container').append(str);
		}
	});
	$(document).on('click', '.trade', function(){
		var index = $(this).parent().index();
		console.log(index);
		$.post('/api/maketrade', {
			bookId: items[index].bookId,
			user: items[index].user
		}, function(result){
			if (result.errCode === 0){
				$(this).remove();
			}
			else {
				alert(result.msg);
			}
		});
		return false;
	})
});