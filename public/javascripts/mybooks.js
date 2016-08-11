var items = [];
var searchItems = [];
$(document).ready(function(){
	console.log('Ready');
	$.get('/api/mybook', function(result){
		if (result.errCode !== 0) {
			window.location = '/';
		}
		else {
			console.log(result);
			items = result.items;
			for (var i = 0; i < items.length; i++) {
			var str = 
				'<div class="elem">' +
					'<img src="' + items[i].thumbnail + '"/>' +
				'<a class="del" href="#"><i class="fa fa-times"></i></a>' +
				'</div>';
			$('#mybooks').append(str);
			}
		}
	});
	$(document).on('click', '.del', function(){
		var index = $(this).parent().index();
		var bookdiv = $(this).parent();
		console.log(index);
		$.post('/api/delbook', {
			bookId: items[index].bookId
		}, function(result){
			if (result.errCode !== 0) {
				alert(result.msg);
			}
			else {
				bookdiv.remove();
			}
		});
		return false;
	});
	$('#bookname').on('keyup', function(e){
		if (e.keyCode == 13) {
			$('#search').click();
		}
	})
	$('#search').click(function(){
		$(this).prop('disabled', true);
		var name = $('#bookname').val();
		if (name !== '') {
			$.get('/api/search?q=' + name, function(result){
				console.log(result);
				searchItems = result.items;
				$('#searchItem').html('');
				for (var i = 0; i < searchItems.length; i++){
					var str = 
					'<div class="elem">' +
						'<img src="' + searchItems[i].thumbnail + '"/>' +
					'<a class="add" href="#"><i class="fa fa-plus"></i></a>' +
					'</div>';
					$('#searchItem').append(str);
				}
				$('#search').prop('disabled', false);
			});
		}
	});
	$(document).on('click', '.add', function(){
		var index = $(this).parent().index();
		console.log(index);
		$.post('/api/addbook', {
			bookId: searchItems[index].bookId
		}, function(result){
			if (result.errCode !== 0) {
				alert(result.msg);
				console.log(result.result);
			}
			else {
				var str = 
					'<div class="elem">' +
						'<img src="' + searchItems[index].thumbnail + '"/>' +
					'<a class="del" href="#"><i class="fa fa-times"></i></a>' +
					'</div>';
					items.push(searchItems[index]);
					$('#mybooks').append(str);
			}
		});
		return false;
	});
});