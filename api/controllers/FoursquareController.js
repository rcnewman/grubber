module.exports = {
		restaurants: function(req, res, next) {
			var foursquare = require('node-foursquare-venues')('Y4MMAW13TD5N0ZBNMNBFLMUBP3BURS3YO1UQWRZHIS0ZMNLD','FPJRT2JZGKVET3TD4NJJLHW3I3LJSMONYRKUTGNLOCGZXTHU')
			var searchObj = {
				ll: '34.0205,-118.2856',
				categoryId: "4d4b7105d754a06374d81259",
				limit: 50,
				radius: 2000
			}
			Cache.findOne({ key: searchObj.categoryId }).done(function(err, result) {
				if(err) {
					next();
				}
				if(typeof result !== "undefined"){
					//if(result.TTL) implement TTL later

					res.send('[' + result.results + ']');
				} else {
					foursquare.venues.search(searchObj, function(err,data) {
						if(err) { res.send(500);}
				
						var a = (data.response.venues).map(function(current) {
							return JSON.stringify({venueId: current.id, value: current.name });
						});
						
						Cache.create({
							key: searchObj.categoryId,
							results: a,
							timeRetrieved: new Date(),
							TTL: 36000000
						}).done(function(err, cache){
							if(err) return console.log(err);

							//Send back results
							
							res.send('[' + cache.results + ']');
						});
					});
				}
			});	
		},
		menus: function (req, res, next){
			var foursquare = require('node-foursquare-venues')('Y4MMAW13TD5N0ZBNMNBFLMUBP3BURS3YO1UQWRZHIS0ZMNLD','FPJRT2JZGKVET3TD4NJJLHW3I3LJSMONYRKUTGNLOCGZXTHU');
			Cache.findOne({ key: utils.escape(req.param('venueId')) }).done(function(err, result) {
				if(err) {
					next();
				}
				if(typeof result !== "undefined"){
					res.send('[' + result.results + ']');
				} else {
					foursquare.venues.menu( utils.escape(req.param('venueId')), function(err,data) {
						if(err) { res.send(500);}
						
						var a = [];

						//Iterate through the giant menu thing that foursquare gives and get all up in there.
						if(data.response.menu.menus.items.length > 0) {
							if(data.response.menu.menus.items[0].entries.items.length > 0){
								(data.response.menu.menus.items[0].entries.items).forEach( function(category){
									if(category.entries.items.length > 0){
										a.push.apply(a, (category.entries.items).map(function(current) 
											{ 
												return JSON.stringify(
													{value: current.name.replace('"',''), category: category.name.replace('"',''), desc: (current.hasOwnProperty('description') ? current.description.replace('"','') : "" ) }); 
											})
										);
									} else {
										a.push('{}');
									}
								});
							} else {
								a.push('{}');
							}
						} else {
							a.push('{}');
						}
						
						Cache.create({
							key: utils.escape(req.param('venueId')),
						 	results: a,
						 	timeRetrieved: new Date(),
						 	TTL: 36000000
						 }).done(function(err, cache){
						 	if(err) return console.log(err);


							
							res.send('[' + cache.results + ']');
						 });
					});
				}


			});
	}
};
