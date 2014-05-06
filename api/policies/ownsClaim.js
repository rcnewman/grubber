/**
 * Verify user owns claim
 */

module.exports = function(req, res, next) {
	if(req.session.User && (req.session.User.id == req.param('deliveryUserId') || req.session.User.id == req.param('hungryUserId')  || req.session.User.userType == 'admin'))
	{
		return next();
	}

	else {
		var requireOwnerError = [{name: 'requireOwnerError', message: 'You do not own this claim.'}]
		req.session.flash = {
			err: requireOwnerError
		}
		res.redirect('/');
		return;
	}
};