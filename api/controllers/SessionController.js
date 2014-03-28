/**
 * SessionController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	'new': function (req,res){
  		
    	res.view('session/new');
    },  
	create: function(req,res, next) {
		if(!req.param('email') || !req.param('password')) {
			var usernamePasswordRequiredError = [{name: 'usernamePasswordRequired', message: "You must enter both a username and password."}]

			req.session.flash = {
				err: usernamePasswordRequiredError
			}
			res.redirect('/session/new');
			return;
		}
		User.findOneByEmail(req.param('email'), function foundUser (err,user) {
			if(err) return next(err);

			if(!user) {
				var accountDoesNotExistError = [{name: 'accountDoesNotExist', message: 'The email address ' + req.param('email') + ' does not exist' }]
				req.session.flash = {
					err: accountDoesNotExistError
				}
				res.redirect('/session/new');
				return;
			}
			require('bcryptjs').compare(req.param('password'), user.encryptedPassword, function(err,valid) {
				if(err) return next(err);
				if(!valid) {
					var invalidPasswordError = [{name: 'invalidPassword', message: 'The password you entered was not correct'}];
					req.session.flash = {
						err: invalidPasswordError
					}
					res.redirect('/session/new');
					return;
				}
				req.session.authenticated = true;
				req.session.User = user;
				user.online = true;

				user.save( function(err,user) {
					if (err) return next(err);

					User.publishUpdate(user.id, {
						loggedIn: true,
						id: user.id,
						name: user.name
					});

					if(req.session.User.userType == 'hungry'){
						res.redirect('/user');
						//res.redirect('/request'); todo: implement delivery request form
						return;
					} else if (req.session.User.userType == 'delivery') {
						res.redirect('/user');
						//res.redirect('/claim'); todo: implement claim acquire form
						return;
					} else if(req.session.User.userType == 'admin') {
						res.redirect('/user/show/' + user.id);
						return;
					} else {
						var invalidUserTypeError = [{name: 'invalidUserType', message: 'The user type for this user is invalid, please contact administrator'}];
						req.session.flash = {
							err: invalidUserTypeError
						}
					
						res.redirect('/session/new');
						req.session.authenticated = false;
						req.session.User = null;
						return;
					}
				});
			});
		});

  	},
  	destroy: function(req,res,next) {
  		User.findOne(req.session.User.id, function foundUser (err,user) {
  			var userId = req.session.User.id;

  			if(user) { //in event that user was deleted before user logged out
	  			User.update(userId, {
	  				online: false
	  			}, function (err) {
	  				if(err) return next(err);

	  				User.publishUpdate(user.id, {
						loggedIn: false,
						id: user.id,
						name: user.name
					});
			
	  				req.session.destroy();
	  				res.redirect('/session/new');
	  			});
	  		} else {
	  				req.session.destroy();
	  				res.redirect('/session/new');
	  		}
  		});
  	}
};
