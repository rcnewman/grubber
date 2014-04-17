/**
 * ClaimController
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
var sem = require('semaphore')(1);
module.exports = {

	//OH GAWD RACE CONDITIONS TODO: HATE SELF
	//RACE CONDITIONS!!!!! TODO: PUNCH WALLS
	//RACE CONDITIONS!!!!!! TODO: Delete internet
    create: function(req, res, next) {
        sem.take(function() {
            var now = new Date();
            var claimObj = {
                deliveryUserId: req.session.User.id,
                hungryUserId: req.param('userId'),
                orderId: req.param('orderId'),
                claimedTime: now        
            }
            Order.findOne(req.param('orderId'),function foundOrder(err, order){
                if (err) {sem.leave(); return next(err); }
                if(!order) {sem.leave(); return next('Order does not exist');}
                if(order.claimed === true) {sem.leave(); return next('Order has been claimed');}

                Claim.create(claimObj, function claimCreated(err, claim){
                    if (err) {
                        req.session.flash = {
                            err: err.ValidationError
                        }
                        sem.leave();
                        return res.redirect('/order/index');
                    }
                    order.claimed = true;
                    order.save(function(err){
                        if(err) {
                            req.session.flash = {
                                err: err.ValidationError
                            }
                            sem.leave();
                            return res.redirect('/order/index');                        
                        }
                    });

                    sem.leave();
                    return res.redirect('/order/index');
                } );
            });
        });
    }


};
