/**
 * Cache
 *
 * @module      :: Model
 * @description :: To cache results from API
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
