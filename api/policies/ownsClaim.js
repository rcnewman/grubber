/**
 * Verify user owns claim
 */

module.exports = function(req, res, next) {
	Claim.findOne(req.param('id'),function foundClaim(err, claim) {
		if (err) return res.redirect('/');
    	if(!claim) return res.redirect('/');
    	if(req.session.User && (req.session.User.id == claim.deliveryUserId || req.session.User.id == claim.hungryUserId  || req.session.User.userType == 'admin'))
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
	});
};