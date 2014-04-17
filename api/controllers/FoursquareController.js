module.exports = {
	restaurants: function(req, res, next) {
		var foursquare = require('node-foursquare-venues')('Y4MMAW13TD5N0ZBNMNBFLMUBP3BURS3YO1UQWRZHIS0ZMNLD','FPJRT2JZGKVET3TD4NJJLHW3I3LJSMONYRKUTGNLOCGZXTHU')


		var searchObj = {
			ll: '34.0205,-118.2856',
			categoryId: "4d4b7105d754a06374d81259",
			limit: 100,
			radius: 2000
		}
		foursquare.venues.search(searchObj, function(err,data) {
			if(err) {
				res.send(500);
			}
			
			var restaurantsList = [];
			(data.response.venues).forEach( function(venue,index) 
			{ 
				foursquare.venues.menu(venue.id, function(err, data) {
					console.log(venue.name + " Menu: " + JSON.stringify(data.response.menu.menus,null,1));
						});
			});



			return res.view({data: data});
		}
		);
		
	}
};