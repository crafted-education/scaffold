
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

BlockCell.prototype.canReplaceBlockWithColumns = function() {
	if(!this._childBlock) return false;
	
	var freeSpacePossibilities = this.getPossibleFreeSpace();
	for (var i = 0; i < freeSpacePossibilities.length; i++) {
		if(this._sizingMgr.isSizeValid(freeSpacePossibilities[i])) {
			return true;
		}
	}
	return false;
};

BlockCell.prototype.replaceBlockWithColumns = function(placeBlockInRightColumn) {
	if(!this._childBlock) throw new Error('No child block to replace.');
	
	//Create a new two column cell
	var columnGroup = this._createColumnGroup();
	
	var columnIndex = 0;
	
	if(placeBlockInRightColumn) {
		columnIndex = 1;
	}
	
	//Get the column we need to add this block cell to
	var column = columnGroup.getChildColumns()[columnIndex];
	
	var parentColumn = this._parentColumn;
	
	if(parentColumn) {
		//Find out what position this block cell is currently in
		var beforeCell = null;
		var parentChildCells = parentColumn.getChildCells();
		for (var i = 0; i < parentChildCells.length; i++) {
			var childCell = parentChildCells[i];
			
			if(childCell.getId() === this.getId()) {
				beforeCell = parentChildCells[i + 1] || null;
			}
		}
		
		//Remove this cell from it's current parent column
		parentColumn.removeChildCell(this);
		
		//Add this cell to the column
		column.addChildCell(this);
		
		//Add the columnGroup to the former parent column
		parentColumn.addChildCell(columnGroup, beforeCell);
	}
	
/*	
	//Hold on to the existing width
	var currentWidth = this.getWidth();
	
	//Create a new two column cell
	var newBlockCell = new BlockCell({"block": childBlock, "validSizes": this._validSizes});
	
	//Convert this cell into a two-column cell
	childBlock = null;
	
	var leftColumnCells = [];
	var rightColumnCells = [];
	var rightColumnWidth = null;
	var leftColumnWidth = null;
	
	//Determine the widths
	var freeSpacePossibilities = this.getPossibleFreeSpace();
	if(!freeSpacePossibilities || freeSpacePossibilities.length === 0) {
		throw new Error('Cannot replace the block with columns since the block has no free space to yield.');
	}
	
	//Get the smallest possibility
	var smallestSpace = 100;
	for (var i = 0; i < freeSpacePossibilities.length; i++) {
		if(freeSpacePossibilities[i] < smallestSpace) {
			smallestSpace = freeSpacePossibilities[i];
		}
	}

	//Make sure the block goes in the correct column, and set the widths appropriately
	if(placeBlockInRightColumn) {
		rightColumnCells.push(newBlockCell);
		rightColumnWidth = currentWidth - smallestSpace;
		leftColumnWidth = smallestSpace;
	}
	else {
		leftColumnCells.push(newBlockCell);
		leftColumnWidth = currentWidth - smallestSpace;
		rightColumnWidth = smallestSpace;
	}
	
	
	//Create the columns
	var leftColumn = new Column({"width": leftColumnWidth, "validSizes": this._validSizes, "cells": leftColumnCells});
	var rightColumn = new Column({"width": rightColumnWidth, "validSizes": this._validSizes, "cells": rightColumnCells});
	
	//Set all of the parents
	leftColumn._parentCell = rightColumn._parentCell = this;
	if(placeBlockInRightColumn) {
		newBlockCell._parentColumn = rightColumn;
	}
	else {
		newBlockCell._parentColumn = leftColumn;
	}

	//Add the columns to this cell
	childColumns = [leftColumn, rightColumn];
*/
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