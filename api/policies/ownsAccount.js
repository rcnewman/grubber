/**
 * Verify user owns account
 */

module.exports = function(req, res, next) {
	if(req.session.User && (req.session.User.id == req.param('id') || req.session.User.userType == 'admin'))
	{
		return next();
	}

	else {
		var requireOwnerError = [{name: 'requireOwnerError', message: 'You do not own this account.'}]
		req.session.flash = {
			err: requireOwnerError
		}
		res.redirect('/');
		return;
	}
};