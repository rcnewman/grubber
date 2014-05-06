/**
 * OrderController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
 	'new': function (req,res){
    	res.view();
    },
    create: function(req, res, next) {
    	var now = new Date();
    	var orderObj = {
    		userId: utils.escape(req.session.User.id),
    		restaurant: utils.escape(req.param('restaurant')),
    		orderDescription: utils.escape(req.param('orderDescription')),
    		orderTime: now
    	}
    	Order.create(orderObj, function orderCreated(err, order) {
    		if (err) {
    			req.session.flash = {
    				err: err.ValidationError
    			}
    			return res.redirect('/order/new');
    		}

    		//Order.publishCreate(order);
    		res.redirect('/order/show/' + order.id);

    	});
    },
    show: function(req,res,next) {
    	Order.findOne(req.param('id'),function foundOrder(err, order) {
    		if (err) return next(err);
    		if(!order) return next('Order does not exist');
    		res.view({
    			order: order
    		});
    	});
    },
    //For claimers
    index: function(req, res, next) {
    	Order.find(//{claimed: false},
            function foundOrder(err, orders) {
    		if(err) return next(err);
    		res.view({
    			orders: orders
    		});
    	});
    },
    //show that belong to user logged in
    history: function(req,res, next){
    	Order.find({userId: req.session.User.id}, function foundOrder(err,orders) {
    		if(err) return next(err);
    		res.view({
    			orders: orders
    		});
    	});
    },
    edit: function(req, res, next) {
    	Order.findOne(req.param('id'), function foundOrder(err,order) {
    		if (err) return next(err);
    		if(!order) return next('Order does not exist');

    		res.view({
    			order: order
    		});
    	});
    },
    update: function(req, res, next) {
    	var orderObj = {
    		restaurant: req.param('restaurant'),
    		orderDescription: req.param('orderDescription'),
    		paymentAmount: req.param('paymentAmount'),
    	}
    	Order.update(req.param('id'), orderObj, function orderUpdate(err) {
    		if (err) {
    			return res.redirect('/order/edit/' + req.param('id'));
    		}
    		//Order.publishUpdate(user);
    		res.redirect('/order/show/' + req.param('id'));
    	});
    },
    destroy: function (req, res, next) {
    	Order.findOne( req.param('id'), function foundOrder(err, order) {
    		if (err) return next(err);

    		if(!order) return next('Order does not exist');

    		Order.destroy(req.param('id'), function orderDestroyed(err) {
    			if (err) return next(err);
    			//Order.publishDestory(order);
    		});	

    		res.redirect('/order/history');
    	});
    }
 
  
};
