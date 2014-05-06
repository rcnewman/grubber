/**
 * Verify user owns claim
 */

module.exports = function(req, res, next) {
	Order.findOne(req.param('id'),function foundOrder(err, order) {
		if (err) return res.redirect('/');
    	if(!order) return res.redirect('/');
    	if(req.session.User && (req.session.User.id == order.userId || req.session.User.userType == 'admin' || req.session.User.userType == 'delivery'))
		{
			return next();
		}
		else {
			var requireOwnerError = [{name: 'requireOwnerError', message: 'You do not own this order.'}]
			req.session.flash = {
				err: requireOwnerError
			}
			res.redirect('/');
			return;
		}
	});
};