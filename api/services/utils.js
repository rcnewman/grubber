module.exports = {
	escape: function(str) {
		return ((typeof str !== 'undefined') ? (str.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')) : str);
	}
}