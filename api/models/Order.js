/**
 * Order
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
	userId: {
		type: 'string',
		required: true
	},
	restaurant: {
		type: 'STRING',
		required: true
	},
	orderDescription: {
		type: 'STRING',
		required: true
	},
	orderTime: {
		type: 'datetime',
		required: true
	},
	claimed: {
		type: 'boolean',
		defaultsTo: false
	}

  }

};
