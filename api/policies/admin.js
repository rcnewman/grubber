/**
 * Verify admin userType
 */

module.exports = function(req, res, next) {
	if(req.session.User && req.session.User.userType == 'admin') {
		return next();
	}

	else {
		var requireAdminError = [{name: 'requireAdminError', message: 'You must be an admin to access this page.'}]
		req.session.flash = {
			err: requireAdminError
		}
		res.redirect('/session/new');
		return;
	}
};