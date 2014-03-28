/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  
  attributes: {
  	name: {
  		type: 'string',
  		required: true
  	},
  	email: {
  		type: 'email',
  		required: 'true',
  		unique: 'true'
  	},
  	encryptedPassword: {
  		type: 'string'
  	},
    userType: {
      type: 'string',
      defaultsTo: "hungry"
    },
    online: {
      type: 'boolean',
      defaultsTo: false
    },
  	toJSON: function(){
  	 	var obj = this.toObject();
  	 	delete obj.password;
  	 	delete obj.confirmation;
  	 	delete obj.encryptedPassword;
  	 	delete obj._csrf;
  	 	return obj;
  	}
    
  },

  beforeCreate: function (values, next) {
    if(!values.password || values.password != values.confirmation) {
      return next({err: ["password doesn't match password confirmation"]});
    }
    require('bcryptjs').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
      if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      values.online = true;
      next();
    });
  }

};
