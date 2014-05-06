$.ui.autocomplete.prototype._renderItem = function (ul, item) { 
	if(item.hasOwnProperty('desc')){
		return $( '<li">' )
			.append( item.label + '<br><a><span class="smalltext">&nbsp&nbsp&nbsp' + item.desc + '</span><br></a>')
			.appendTo( ul );	
	} else {
		return $( '<li><a>' )
			.append( item.label + '</a>')
			.appendTo( ul );	
	}
};

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


	$.widget( "custom.catcomplete" , $.ui.autocomplete, {
		_renderMenu: function ( ul, items ) {
			var self = this,
			currentCategory = "";
			$.each(items, function(index, item ){
				if( item.category != currentCategory ) {
					ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
					currentCategory = item.category;
				}
				self._renderItemData( ul, item );
			});		
		}
	});

	$("#restaurant").autocomplete({
		source: function( req, res ) {
			$.ajax({
				type: "GET",
				url: "/foursquare/restaurants/",
				success: function(data) {
					results = jQuery.parseJSON( data.replace('\\','') );
					results = results.filter(function(elem){
						if(elem.hasOwnProperty('value')){
							return (elem['value'].toLowerCase().indexOf(req.term.toLowerCase()) > -1);
						} else {
							return null;
						}
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
			$("#order").catcomplete("option", "source", function( req, res ) {
					$.ajax({
					type: "GET",
					url: secondary_url,
					success: function(data) {
						results = jQuery.parseJSON( data.replace('\\','') );
						results = results.filter(function(elem){
						if(elem.hasOwnProperty('value')){
							return (elem['value'].toLowerCase().indexOf(req.term.toLowerCase()) > -1);
						} else {
							return null;
						}
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

	$("#order").catcomplete({
		source: "",
		minLength: 1
	});

});
