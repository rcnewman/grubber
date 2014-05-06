/**
 * Verify user owns claim
 */

module.exports = function(req, res, next) {
	if(req.session.User && (req.session.User.id == req.param('userId') || req.session.User.userType == 'admin' || req.session.User.userType == 'delivery'))
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
};