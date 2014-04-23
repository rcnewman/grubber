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
		Cache.findOne({ key: req.param('venueId') }).done(function(err, result) {
			if(err) {
				next();
			}
			if(typeof result !== "undefined"){
				res.send('[' + result.results + ']');
			} else {
				foursquare.venues.menu(req.param('venueId'), function(err,data) {
					if(err) { res.send(500);}
					if(data.response.menu.menus.items[0].entries.items[1].entries.items)
					 var a = (data.response.menu.menus.items[0].entries.items[1].entries.items).map(function(current) {
					 	return JSON.stringify({value: current.name });
					 });
					
					Cache.create({
						key: req.param('venueId'),
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
