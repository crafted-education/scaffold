
var latestId = 2000;

var BlockCell = function BlockCell(block, parentColumn, sizingMgr, createColumnGroupFunction) {
	if(!block) throw Error('Cannot create a block cell for a null block');
	if(!block.id) throw Error('Cannot create a block cell for a block that has no id');
	if(!sizingMgr) throw Error('A column group cell must be supplied a SizingMgr.');
	if(!sizingMgr) throw Error('A column group cell must be supplied a SizingMgr.');
	
	this._id = latestId++; //Give it a unique id
	this._childBlock = block;
	this._sizingMgr = sizingMgr;
	this._parentColumn = parentColumn;
	this._deleted = false;
	this._createColumnGroup = createColumnGroupFunction;
};	

BlockCell.prototype.getId = function() {
	return this._id;
};

BlockCell.prototype.getParentColumn = function() {
	return this._parentColumn;	
};

BlockCell.prototype.setParentColumn = function(parentColumn) {
	this._parentColumn = parentColumn;	
};

BlockCell.prototype.isDeleted = function() {
	return this._deleted;
};

BlockCell.prototype.getWidth = function() {
	var width = null;
	
	if(this._parentColumn) {
		width = this._parentColumn.getWidth();
	}
	
	return width;
};

BlockCell.prototype.getMinWidth = function() {
	return this._sizingMgr.getMinSize();
};
	
BlockCell.prototype.setWidth = function(newWidth) {
	//A block cell can be any size, so we only have to deal with column cells
};

BlockCell.prototype.getChildBlock = function() {
	return this._childBlock;
};

BlockCell.prototype.isEmpty = function() {
	return !this._childBlock;
};

BlockCell.prototype.delete = function() {
	//Need to check if it's already deleted to prevent infinite loops
	if(!this.isDeleted()) {
		this._deleted = true;

		//Remove the cell from it's parent, if it has one
		if(this._parentColumn) {
			this._parentColumn.removeChildCell(this);
		}
	}
};

BlockCell.prototype.isEmpty = function() {
	return false;
};


BlockCell.prototype.getPossibleFreeSpace = function() {
	//Blocks can be any valid size, so return the list of differences
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


BlockCell.prototype.toString = function() {
	return 'BlockCell, id: ' + this.getId() + ', width: ' + this.getWidth() + '\n';
};

module.exports = BlockCell;