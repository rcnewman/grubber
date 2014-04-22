/**
 * Cache
 *
 * @module      :: Model
 * @description :: To cache results from API
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	key: {
  		type: 'string',
  		required: true
  	},
  	results: {
  		type: 'string',
  		required: true,
  	},
  	timeRetrieved: {
  		type: 'datetime',
  		required: true
  	},
  	TTL: { //time to live in milliseconds
  		type: 'integer',
  		required: true
  	}
  }

};
