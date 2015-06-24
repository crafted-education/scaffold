
function SizingMgr(validSizes) {
	if(!validSizes) throw Error('A sizing manager must be supplied a list of valid sizes. No array was provided.');
	if(validSizes.length === 0) throw Error('A sizing manager must be supplied a list of valid sizes. An empty array was provided');
	
	this._validSizes = validSizes;
}

SizingMgr.prototype.getValidSizes = function() {
	return this._validSizes;	
};

SizingMgr.prototype.isSizeValid = function(size) {
	return (this._validSizes.indexOf(size) !== -1);	
};

SizingMgr.prototype.areSizesValid = function(sizes) {
	for (var i = 0; i < sizes.length; i++) {
		if(!this.isSizeValid(sizes[i])) {
			return false;
		}
	}
	return true;
};

SizingMgr.prototype.getMinSize = function() {
	return this._validSizes[this._validSizes.length - 1];	
};

SizingMgr.prototype.sum = function(sizes) {
	//Calculate the sum of all of the sizes in the array
	var sum = 0;
	for (var i = 0; i < sizes.length; i++) {
		sum += sizes[i];
	}
	
	return sum;
};

module.exports = SizingMgr;
