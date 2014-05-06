/**
 * Verify hungry userType
 */

module.exports = function(req, res, next) {
	if(req.session.User && (req.session.User.userType == 'hungry' || req.session.User.userType == 'admin'))
	{
		return next();
	}

	else {
		var requireHungryError = [{name: 'requireHungryError', message: 'You must be an hungry person to access this page.'}]
		req.session.flash = {
			err: requireHungryError
		}
		res.redirect('/order');
		return;
	}
};