
var latestId = 2000;

var ContentCell = function ContentCell(content, parentColumn, sizingMgr, createColumnGroupFunction) {
	if(!content) throw Error('Cannot create a content cell for a null content');
	if(!content.id) throw Error('Cannot create a content cell for a content that has no id');
	if(!sizingMgr) throw Error('A column group cell must be supplied a SizingMgr.');
	
	this._id = latestId++; //Give it a unique id
	this._childContent = content;
	this._sizingMgr = sizingMgr;
	this._parentColumn = parentColumn;
	this._deleted = false;
	this._createColumnGroup = createColumnGroupFunction;
};	

ContentCell.prototype.getId = function() {
	return this._id;
};

ContentCell.prototype.getParentColumn = function() {
	return this._parentColumn;	
};

ContentCell.prototype.setParentColumn = function(parentColumn) {
	this._parentColumn = parentColumn;	
};

ContentCell.prototype.isDeleted = function() {
	return this._deleted;
};

ContentCell.prototype.getWidth = function() {
	var width = null;
	
	if(this._parentColumn) {
		width = this._parentColumn.getWidth();
	}
	
	return width;
};

ContentCell.prototype.getMinWidth = function() {
	return this._sizingMgr.getMinSize();
};
	
ContentCell.prototype.setWidth = function(newWidth) {
	//A content cell can be any size, so we only have to deal with column cells
};

ContentCell.prototype.getChildContent = function() {
	return this._childContent;
};

ContentCell.prototype.isEmpty = function() {
	return !this._childContent;
};

ContentCell.prototype.delete = function() {
	//Need to check if it's already deleted to prevent infinite loops
	if(!this.isDeleted()) {
		this._deleted = true;

		//Remove the cell from it's parent, if it has one
		if(this._parentColumn) {
			this._parentColumn.removeChildCell(this);
		}
	}
};

ContentCell.prototype.isEmpty = function() {
	return false;
};


ContentCell.prototype.getPossibleFreeSpace = function() {
	//Contents can be any valid size, so return the list of differences
	//between the current width and valid sizes smaller than the current width.
	var possibilities = [];
	var sizes = this._sizingMgr.getValidSizes();
	for (var i = 0; i < sizes.length; i++) {
		var difference = this.getWidth() - sizes[i];
		if(difference > 0) {
			possibilities.push(difference);
		}
		
	}
	return possibilities;
};

ContentCell.prototype.getNextSibling = function() {
	if(!this._parentColumn) return null;
	
	var siblings = this._parentColumn.getChildCells();
	
	for (var i = siblings.length - 1; i > -1; i--) {
		if(siblings[i].getId() === this._id && i < siblings.length - 1) {
				return siblings[i+1];
		}
	}
	
	return null;
};

ContentCell.prototype.getPreviousSibling = function() {
	if(!this._parentColumn) return null;
	
	var siblings = this._parentColumn.getChildCells();
	
	for (var i = 0; i < siblings.length; i++) {
		if(siblings[i].getId() === this._id && i > 0) {
				return siblings[i-1];
		}
	}
	
	return null;
};



ContentCell.prototype.toString = function() {
	return 'ContentCell, id: ' + this.getId() + ', width: ' + this.getWidth() + '\n';
};

module.exports = ContentCell;