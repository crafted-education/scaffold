
var latestId = 1000; //Give it a different start id than cell so it is easy to spot the difference

function Column(width, cells, parentCell, sizingMgr) {
	if(!sizingMgr) throw Error('A column group cell must be supplied a SizingMgr.');
	if(!sizingMgr.isSizeValid(width)) {
		throw Error('A scaffold column must have a valid width.');
	}

	this._id = latestId++; //Give it a unique id
	this._width = width;
	this._childCells = [];
	this._sizingMgr = sizingMgr;
	this._parentCell = parentCell;
	this._deleted = false;
	
	if(cells) {
		this._childCells = cells;
		
		//Set the parent and width on each of the cells
		for (var i = 0; i < cells.length; i++) {
			cells[i].setParentColumn(this);
			cells[i].setWidth(width);
		}
	}
}
	
	

Column.prototype.getId = function() {
	return this._id;
};

Column.prototype.getParentCell = function() {
	return this._parentCell;	
};

Column.prototype.setParentCell = function(parentCell) {
	this._parentCell = parentCell;	
};

Column.prototype.isDeleted = function() {
	return this._deleted;
};

Column.prototype.getWidth = function() {
	return this._width;
};

Column.prototype.getMinWidth = function() {
	
	//The minimum width for a column is just the max
	//of the minimum widths of each of it's cells
	var max = 0;
	
	for (var i = 0; i < this._childCells.length; i++) {
		var minWidth = this._childCells[i].getMinWidth();
		if(minWidth > max) {
			max = minWidth;
		}
	}
	
	return max;
};


Column.prototype.setWidth = function(newWidth) {
	
	if(!this._sizingMgr.isSizeValid(newWidth)) {
		throw new Error('Cannot set a column to an invalid size: ' + newWidth);
	}
	
	//Set each of the child cells to the same width
	for (var i = 0; i < this._childCells.length; i++) {
		this._childCells[i].setWidth(newWidth);
	}
	
	this._width = newWidth;
};

Column.prototype.getChildCells = function() {
	return this._childCells;
};

Column.prototype.addChildCell = function(cell, beforeCell) {
	cell.setParentColumn(this);
	
	if(!beforeCell || this._childCells.length === 0) {
		this._childCells.push(cell);
		cell.setWidth(this.getWidth());
	}
	else {
		for(var i=0; i<this._childCells.length; i++) {
			if(beforeCell.getId() === this._childCells[i].getId()) {
				this._childCells.splice(i, 0, cell);
				cell.setWidth(this.getWidth());
				break;
			}
		}
	}
};


Column.prototype.removeChildCell = function(cell) {
	for(var i=0; i<this._childCells.length; i++) {
		if(cell.getId() === this._childCells[i].getId()) {
			this._childCells.splice(i, 1);
			break;
		}
	}
	
	cell.setParentColumn(null);
	
	//Since we've removed a cell from a column, check the parent of the
	//column to make sure it still has content. If it only has empty columns
	//then it can be deleted.
	if(this._parentCell && this._parentCell.isEmpty()) {
		this._parentCell.delete();
	}
};


Column.prototype.delete = function() {
	//Need to check if it's already deleted to prevent infinite loops
	if(!this.isDeleted()) {
		this._deleted = true;

		//Before we can delete the column we have to delete it's children
		var childCells = this.getChildCells();
		
		//Need to go in reverse order, as the array changes while we are iterating
		for(var i = childCells.length - 1; i >= 0; i--) {
			childCells[i].delete();
		}
		
		//Now remove the column from it's parent, if it has one
		if(this._parentCell) {
			this._parentCell.removeChildColumn(this);
		}
	}
};
	
Column.prototype.isEmpty = function() {
	var isEmpty = true;
	
	for(var i=0; i<this._childCells.length; i++) {
		if(!this._childCells[i].isEmpty()) {
			isEmpty = false;
			break;
		}
	}
	
	return isEmpty;
};

Column.prototype.getPossibleFreeSpace = function() {
	var freeSpacePossibilities = null;
	
	for (var i = 0; i < this._childCells.length; i++) {
		var cellPossibilities = this._childCells[i].getPossibleFreeSpace();
		
		if(!freeSpacePossibilities) {
			freeSpacePossibilities = cellPossibilities;
		} 
		else {
			//Since all of the cells have to be sized to the same width, only 
			//keep the possibilities that they all have in common
			var intersection = [];
			
			for (var j = 0; j < cellPossibilities.length; j++) {
				if(freeSpacePossibilities.indexOf(cellPossibilities[j]) !== -1) {
					intersection.push(cellPossibilities[j]);
				}
			}
			
			freeSpacePossibilities = intersection;
		}
		
		//If there are no possibilities we might as well quit and send back an empty array
		if(freeSpacePossibilities.length === 0) {
			break;
		}
	}
	
	return freeSpacePossibilities;
}


Column.prototype.toString = function() {
		return 'Column, id: ' + this.getId() + ', width: ' + this.getWidth() + '\n';
	};

module.exports = Column;