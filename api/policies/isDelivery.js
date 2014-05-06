/**
 * Verify delivery userType
 */

module.exports = function(req, res, next) {
	if(req.session.User && (req.session.User.userType == 'delivery' || req.session.User.userType == 'admin')) {
		return next();
	}

	else {
		var requireDeliveryError = [{name: 'requireDeliveryError', message: 'You must be an delivery person to access this page.'}]
		req.session.flash = {
			err: requireDeliveryError
		}
		res.redirect('/order/new');
		return;
	}
};