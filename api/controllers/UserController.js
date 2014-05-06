/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: 
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    'new': function (req,res){
    	if(req.param('type') === "delivery"){
            res.view({type: 'delivery'});
            return;
        } else {
            res.view({type: 'hungry'});
            return;
        }
    },
    create: function(req,res,next) {
        //Insure userType is of delivery or hungry
        var userType;
        if(req.param('type') === 'delivery'){
            userType = 'delivery';
        } else {
            userType = 'hungry';
        }
        
        //Create userObj to prevent user adding extra field
        var userObj = {
            name: utils.escape(req.param('name')),
            email: utils.escape(req.param('email')),
            password: utils.escape(req.param('password')),
            confirmation: utils.escape(req.param('confirmation')),
            userType: userType
        }

    	User.create(userObj , function userCreated(err, user){
    		if (err) {
    			//console.log(err)
    			req.session.flash = {
    				err: err.ValidationError
    			}
    			return res.redirect('/user/new');	
    		} 

            req.session.authenticated = true;
            req.session.User = user;
            user.online = true;
            user.save( function(err,user) {
                if (err) return next(err);

                User.publishCreate(user);
                res.redirect('/user/show/'+user.id);
            });
    	});
    },
    show: function (req,res,next) {
    	User.findOne(utils.escape(req.param('id')), function foundUser (err, user) {
    		if (err) return next(err);
    		if (!user) return next('User doesn\'t exist.');
    		res.view({
    			user: user
    		});
    	});
    },
    index: function(req,res,next) {
    	User.find(function foundUser(err,users) {
    		if(err) return next(err);
    		res.view({
    			users: users
    		});
    	});
    },

    edit: function(req, res, next) {
    	User.findOne(utils.escape(req.param('id')),function foundUser(err, user) {
    		if (err) return next(err);
    		if (!user) return next('User doesn\'t exist.');

    		res.view({
    			user: user
    		});
    	});
    },

    update: function(req, res, next) {

        if(req.session.User.userType == 'admin'){
            var userObj = {
                name: utils.escape(req.param('name')),
                email: utils.escape(req.param('email')),
                userType: utils.escape(req.param('userType'))
            }
        } else {
            var userObj = {
                name: utils.escape(req.param('name')),
                email: utils.escape(req.param('email'))
            }
        }
        
    	User.update(utils.escape(req.param('id')), userObj, function userUpdated(err) {
    		if (err) {
    			return res.redirect('/user/edit/' + req.param('id'));
    		}
            User.publishUpdate(user);
    		res.redirect('/user/show/' + req.param('id'));
    	});
    },
    destroy: function (req, res, next) {
        User.findOne( utils.escape(req.param('id')), function foundUser(err, user) {
            if (err) return next(err);

            if(!user) return next('User doesn\'t exist.');
            
            User.destroy(user.id,function userDestroyed(err) {
                if (err) return next(err);
                User.publishUpdate(user.id, {
                    name: user.name
                });
                User.publishDestroy(user.id);

                Order.find({userId: user.id},function (err,orders) {
                    if (err) return next(err);
                    if(!orders) return next('no orders found');

                    orders.forEach(function cascadeDelete(order) {
                        console.log(order + ' is being deleted');
                        Order.destroy(order, function( err ){
                            if (err) return next(err);
                        });
                    });
                });
            });

            res.redirect('/user');
        });
    },

    subscribe: function(req, res) {

        User.find(function foundUsers(err,users) {
            //Subscribe to User Class room,
            User.subscribe(req.socket);
            //subscribe to instance room
            User.subscribe(req.socket, users);
            res.send(200);
        });

        Order.find({userId: this.id}, function foundOrders(err,orders) {
            Order.subscribe(req.socket);//todo: I think i delete this, need to test
            Order.subscribe(req.socket,orders);
         });
    }
};
