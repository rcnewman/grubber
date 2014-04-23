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

	$("#order").attr('disabled',true);

	$("#restaurant").autocomplete({
		source: function( req, res ) {
			$.ajax({
				type: "GET",
				url: "/foursquare/restaurants/",
				success: function(data) {
					results = jQuery.parseJSON( data.replace('\\','') );
					results = results.filter(function(elem){
						return (elem['value'].toLowerCase().indexOf(req.term.toLowerCase()) > -1);
					});
					res( results );
				},
				error: function(data) {
					res("error");
				}
			});
		},
		select: function( event , ui ) {
			$("#order").attr('disabled',false);
			secondary_url = "/foursquare/menus?venueId=" + ui.item.venueId;
			$("#order").autocomplete("option", "source", function( req, res ) {
					$.ajax({
					type: "GET",
					url: secondary_url,
					success: function(data) {
						results = jQuery.parseJSON( data.replace('\\','') );
						results = results.filter(function(elem){
							return (elem['value'].toLowerCase().indexOf(req.term.toLowerCase()) > -1);
						});
						res( results );
					},
					error: function(data) {
						res("error");
					}
				});
			});
		},
		minLength: 1

	});

	$("#order").autocomplete({
		source: "",
		minLength: 1
	});

});
