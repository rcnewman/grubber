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

$("#restaurant").autocomplete({
		source: function( request, response ) {
			$.ajax({
				datatype: "json",
				type: "GET",
				url: "/foursquare/restaurants/",
				success: function(data) {
					response($.map(data , function (value, key) {
						return (key === 'id' ? {id: value} : null);
					}));
				},
				error: function(data) {
					$("#restaurant").val("ERROR");
				}
			});
		},
		select: function( event , ui ) {

		},
		minLength: 0

	});