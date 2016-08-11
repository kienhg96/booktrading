$(document).ready(function(){
	$(document).on('click', ".dropdown-toggle", function(){
		var isOpen = $(this).parent().hasClass('open');
		$(".dropdown").removeClass('open');
		if (!isOpen){
			$(this).parent().addClass('open');
		}
		return false;
	});
	$(document).on('click', function (e) {
	    if (!$('.dropdown').is(e.target) 
	        && $('.dropdown').has(e.target).length === 0 

	    ) {
	        $('.dropdown').removeClass('open');
	    }	
	});
	$(document).on('click', '#btnLogin', function(){
		$(this).prop('disabled', true);
		btnLogin = $(this);
		var username = $(this).parent().find('.username').val();
		var password = $(this).parent().find('.password').val();
		$.post('/users/login', {
			username: username,
			password: password}, function(result){
				if (result.errCode ===  0) {
					window.location.reload();
				}
				else {
					btnLogin.prop('disabled', false);
					alert('Username or password invalid');
				}
			});
	});
	$(document).on('keyup', '.password', function(e){
		if (e.keyCode == 13) {
			$(this).parent().find('.btn').click();
		}
	});
	$(document).on('keyup', '.username', function(e){
		if (e.keyCode == 13) {
			$(this).parent().find('.btn').click();
		}
	});
	$(document).on('keyup', '#repPassword', function(e){
		if (e.keyCode == 13) {
			$(this).parent().find('.btn').click();
		}
	});
	$(document).on('click', '#btnLogout', function(){
		$(this).prop('disabled', true);
		$.get('/users/logout', function(result){
			window.location.reload();
		})
	});
	$(document).on('click', '#btnSignup', function(){
		$(this).prop('disabled', true);
		btnSignup = $(this);
		var username = $(this).parent().find('.username').val();
		var password = $(this).parent().find('.password').val();
		var repPassword = $(this).parent().find('#repPassword').val();
		if ((username === '') || (password === '')) {
			return alert('Username and Password cannot empty');
		}
		if (password !== repPassword) {
			return alert('Password and re-type Password mismatch');
		}
		$.post('/users/signup', {username: username, password: password}, function(result){
			if (result.errCode !== 0) {
				btnSignup.prop('disabled', false);
				alert(result.msg);
			}
			else {
				window.location.reload();
			}
		})
	});
});