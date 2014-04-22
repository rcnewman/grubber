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
				foursquare.venues.search(searchObj, function(err,data) {
					if(err) { res.send(500);}
			
					var a = (data.response.venues).map(function(current) {
						return JSON.stringify({id: current.id, name: current.name });
					});
					
					Cache.create({
						key: searchObj.categoryId,
						results: JSON.stringify(a),
						timeRetrieved: new Date(),
						TTL: 36000000
					}).done(function(err, cache){
						if(err) return console.log(err);

						//Send back results
						
						res.view({data: cache.results});
						return;
					});
				});
			}
			if(typeof result !== "undefined"){
				//if(result.TTL) implement TTL later
				console.log(result);
				console.log("bigboom");
				res.view({data: result.results});
				return;	
			} else {
				foursquare.venues.search(searchObj, function(err,data) {
					if(err) { res.send(500);}
			
					var a = (data.response.venues).map(function(current) {
						return JSON.stringify({id: current.id, name: current.name });
					});
					
					Cache.create({
						key: searchObj.categoryId,
						results: a,
						timeRetrieved: new Date(),
						TTL: 36000000
					}).done(function(err, cache){
						if(err) return console.log(err);

						//Send back results
						
						res.view({data: cache.results});
						return;
					});
				});
			}
			

		});
		
		
	}
};

