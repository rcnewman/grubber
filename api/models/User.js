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
  // ,
  // beforeDestroy: function(values,next) {
  //   //HACKY AS FUCKKK
  //   sails.models.Order.find({userId: this.id}).done(function(err,orders) {
  //     if(err) return console.log(err);

  //     orders.forEach(function cascadeDelete(order){
  //       sails.models.Order.destroy(order, function( err ){
  //         if(err) return console.log(err);
  //         sails.models.Order.publishDestroy(order);
  //       });
  //     });
  //   });
  // }

};
