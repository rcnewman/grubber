$(document).ready(function(){
	$('#sign-up-form').validate({
		rules: {
			name: { 
				required: true
			},
			email: {
				required: true,
				email: true
			},
			password: {
				minLength: 1, //todo: make this bigger
				required: true
			},
			confirmation: {
				equalTo: "#password"
			}
		},
		success: function(element) {
			element.text('OK!').addClass('valid')
		}
	});
});