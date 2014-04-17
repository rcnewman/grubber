/**
 * Claim
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	deliveryUserId: {
  		type: 'string',
  		required: true
  	},
  	hungryUserId: {
  		type: 'string',
  		required: true,
  	},
  	orderId: {
  		type: 'string',
  		required: true
  	},
  	claimedTime: {
  		type: 'datetime',
  		required: true
  	}
  	// Implement to allow for delivery people to add images of receipts
  	// for verifying cost amounts
  	// ,receiptImageUri: {
  	// 	type: 'string'
  	// }
  }

};
