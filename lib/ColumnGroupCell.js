var Column = require('./Column.js');

var latestId = 3000;

var ColumnGroupCell = function ColumnGroupCell(columns, parentColumn, sizingMgr) {
	if(!columns) throw Error('Cannot create a column group cell for a null columns array');
	if(columns.length === 0) throw Error('Cannot create a column group cell for an empty columns array');
	if(!sizingMgr) throw Error('A column group cell must be supplied a SizingMgr.');
	
	this._id = latestId++; //Give it a unique id
	this._childColumns = columns;
	this._sizingMgr = sizingMgr;
	this._parentColumn = parentColumn;
	this._deleted = false;
	
	//Set the parent on each of the columns
	for (var i = 0; i < columns.length; i++) {
		columns[i].setParentCell(this);
	}
};	

ColumnGroupCell.prototype.getId = function() {
	return this._id;
};

ColumnGroupCell.prototype.getParentColumn = function() {
	return this._parentColumn;	
};

ColumnGroupCell.prototype.setParentColumn = function(parentColumn) {
	this._parentColumn = parentColumn;	
};

ColumnGroupCell.prototype.isDeleted = function() {
	return this._deleted;
};

ColumnGroupCell.prototype.getWidth = function() {
	var width = null;
	
	if(this._parentColumn) {
		width = this._parentColumn.getWidth();
	}
	else {
		//If there is no parent column then derive the width from the widths of the child columns
		var width = 0;
		for (var i = 0; i < this._childColumns.length; i++) {
			width += this._childColumns[i].getWidth();
			
		}
	}
	
	return width;
};

ColumnGroupCell.prototype.getMinWidth = function() {
	
	//The minimum width for a column group is just the sum
	//of the minimum widths of each of it's columns
	var sum = 0;
	
	for (var i = 0; i < this._childColumns.length; i++) {
		sum += this._childColumns[i].getMinWidth();
	}
	
	return sum;
};

ColumnGroupCell.prototype.setWidth = function(newWidth) {
	
	var currentWidth = this.getWidth();
	
	if(currentWidth === newWidth) return;
	
	if(!this._sizingMgr.isSizeValid(newWidth)) {
		throw new Error('Cannot set the column group to an invalid size: ' + newWidth);
	}
	
	//Taking a shortcut here and relying on the fact that the only sizes
	//we care about for now are 12, 8, 6, 4. That means there are a limited number of 
	//possibilities we have to worry about
	
	switch(this._childColumns.length) {
		case 3:
			if(newWidth !== 12) {
				throw new Error('Invalid width for a column group with three columns: ' + newWidth);
			}
				
			break;
		case 2:
			if(newWidth === 12) {
				this._childColumns[0].setWidth(6);	
				this._childColumns[1].setWidth(6);	
			}
			else if(newWidth === 8) {
				this._childColumns[0].setWidth(4);	
				this._childColumns[1].setWidth(4);	
			}
			else {
				throw new Error('Invalid width for a column group with three columns: ' + newWidth);
			}
			break;
		case 1:
			this._childColumns[0].setWidth(newWidth);
			break;
		default:
			throw new Error('Invalid number of columns detected in a column group: ' + this._childColumns.length);
	}
	
};

ColumnGroupCell.prototype.getChildColumns = function() {
	return this._childColumns;
};

ColumnGroupCell.prototype.addChildColumn = function(column, beforeColumn) {
	
	if(!beforeColumn) {
		this.resizeColumnsForNewColumn(column, this._childColumns.length);
		column.setParentCell(this);
		this._childColumns.push(column);
	}
	else {
		for(var i=0; i<this._childColumns.length; i++) {
			if(beforeColumn.getId() === this._childColumns[i].getId()) {
				this.resizeColumnsForNewColumn(column, i);
				column.setParentCell(this);
				this._childColumns.splice(i, 0, column);
				break;
			}
		}
	}
};

ColumnGroupCell.prototype.removeChildColumn = function(column) {
	var isRemoved = false;
	var removedColumnWidth = column.getWidth();
	
	for(var i=0; i<this._childColumns.length; i++) {
		if(column.getId() === this._childColumns[i].getId()) {
			this._childColumns.splice(i, 1);
			isRemoved = true;
			break;
		}
	}
	
	if(this._childColumns.length === 0) {
		this.delete();
	}
	else if(isRemoved) {
		//Always add any extra space to the first column
		var firstColumn = this._childColumns[0];
		firstColumn.setWidth(firstColumn.getWidth() + removedColumnWidth);
	}
};

ColumnGroupCell.prototype.delete = function() {
	//Need to check if it's already deleted to prevent infinite loops
	if(!this.isDeleted()) {
		this._deleted = true;
		
		//Before we can delete the cell we have to delete it's children
		var childColumns = this.getChildColumns();
		
		if(childColumns) {
			//Need to go in reverse order, as the array changes while we are iterating
			for(var i=childColumns.length - 1; i >=0 ; i--) {
				childColumns[i].delete();
			}
		}
		
		//Now remove the cell from it's parent, if it has one
		if(this._parentColumn) {
			this._parentColumn.removeChildCell(this);
		}
	}
};
	

ColumnGroupCell.prototype.isEmpty = function() {
	var isEmpty = true;
	
	for(var i=0; i<this._childColumns.length; i++) {
		if(!this._childColumns[i].isEmpty()) {
			isEmpty = false;
			break;
		}
	}
	
	return isEmpty;
};

ColumnGroupCell.prototype.canAddColumn = function(minimumWidth) {
	
	if(!minimumWidth) minimumWidth = 0;
	
	//Call getPossibleFreeSpace and see if any are greater or equal to the minimum width provided
	//If no minimum width is supplied then any valid free space found is a success
	var freeSpacePossibilities = this.getPossibleFreeSpace();
	if(!freeSpacePossibilities) return false;
	//If we can even find a single possibility that is greater than or equal
	//to the minimum and is a valid size then we can add a column
	for (var i = 0; i < freeSpacePossibilities.length; i++) {
		var possibility = freeSpacePossibilities[i];
		
		if(possibility >= minimumWidth && this._sizingMgr.isSizeValid(possibility)) {
			return true;
		}
	}
	
	return false;
};

ColumnGroupCell.prototype.canColumnsResize = function() {
	//Return true if the call to getPossibleColumnWidthCombinations returns more than
	//just the current combination
	var widthCombinations = this.getPossibleColumnWidthCombinations();
	if(!widthCombinations) return false;
	return (widthCombinations.length > 1);
};

ColumnGroupCell.prototype.getPossibleColumnWidthCombinations = function(minOverallSize, maxOverallSize) {
		
	var widthCombos = [];
	var widthComboKeys = []; //Store the combos in string form here to make it easier to check for duplicates
	var keepCurrentOverallSize = false; 

	//If they didn't send a min and max then assume that we want to keep the same overall size
	if(!minOverallSize && !maxOverallSize) {
		keepCurrentOverallSize = true;
		minOverallSize = maxOverallSize = this.getWidth();
	}
	
	//First, add the current width combo if it fits the criteria
	var currentWidthCombo = this.getCurrentColumnWidths();
	var currentTotalWidth = this._sizingMgr.sum(currentWidthCombo);
	if (currentTotalWidth >= minOverallSize && currentTotalWidth <= maxOverallSize && this._sizingMgr.areSizesValid(currentWidthCombo)) {
		widthCombos.push(currentWidthCombo);
		widthComboKeys.push(currentWidthCombo.join('-'));
	}
	
	//Now, loop through each column, get any free space possibilities, and try taking it from that column
	//and adding it to another column. If it makes a valid size add it as a width combo.
	//NOTE: this doesn't catch all possibilities, but it does get nearly all that we have to worry about for now
	for (var i = 0; i < this._childColumns.length; i++) {
		var freeSpacePossibilities = this._childColumns[i].getPossibleFreeSpace();

		if(freeSpacePossibilities) {
			for (var j = 0; j < freeSpacePossibilities.length; j++) {
				var freeSpace = freeSpacePossibilities[j];
				
				for (var k = 0; k < this._childColumns.length; k++) {
					if(i !== k) {
						//Make a copy of the current widths
						var newWidthCombo = currentWidthCombo.slice(0); 
						//Take the space from one column
						newWidthCombo[i] -= freeSpace;
						
						if(keepCurrentOverallSize) {
							//Add it to another column
							newWidthCombo[k] += freeSpace;
						}
						
						//If the sizes are all valid, add the combo if we haven't already
						if(this._sizingMgr.areSizesValid(newWidthCombo)) {
							var comboKey = newWidthCombo.join('-');
							var totalSize = this._sizingMgr.sum(newWidthCombo);
							
							if(widthComboKeys.indexOf(comboKey) === -1
							  && totalSize >= minOverallSize
							  && totalSize <= maxOverallSize) {
								widthCombos.push(newWidthCombo);
								widthComboKeys.push(comboKey);
							}
						}
					}
				}
			}
		}
	}
	
	//The last case we should add which isn't included with the above loop is to take space from all of the columns
	//We'll trying shrinking each of them to their minimum
	var minWidthCombo = [];
	
	for (var i = 0; i < this._childColumns.length; i++) {
		minWidthCombo.push(this._childColumns[i].getMinWidth());
	}

	var comboKey = minWidthCombo.join('-');
	var totalSize = this._sizingMgr.sum(minWidthCombo);
	
	if(widthComboKeys.indexOf(comboKey) === -1
	  && totalSize >= minOverallSize
	  && totalSize <= maxOverallSize
	  && this._sizingMgr.areSizesValid(minWidthCombo)) {
		widthCombos.push(minWidthCombo);
		widthComboKeys.push(comboKey);
	}		
	
	return widthCombos;
	
};

ColumnGroupCell.prototype.getPossibleFreeSpace = function() {

	var freeSpacePossibilities = [];
	var currentWidth = this.getWidth();

	//Get a list of all posible column width combinations that have a smaller overall size
	var combos = this.getPossibleColumnWidthCombinations(0, currentWidth-1);
	
	for (var i = 0; i < combos.length; i++) {
		//Calculate the total width of the combo
		var totalWidth = this._sizingMgr.sum(combos[i]);
		
		//Since a cell has to be a valid size, make sure the total width is a valid size
		if(this._sizingMgr.isSizeValid(totalWidth)) {
			var freeSpace = currentWidth - totalWidth;
			
			if(freeSpacePossibilities.indexOf(freeSpace) === -1) {
				freeSpacePossibilities.push(freeSpace);
			}
		}
	}
	
	return freeSpacePossibilities;
};

ColumnGroupCell.prototype.getCurrentColumnWidths = function() {
	var columnWidths = [];
	for (var i = 0; i < this._childColumns.length; i++) {
		columnWidths.push(this._childColumns[i].getWidth());
	}
	return columnWidths;
}

ColumnGroupCell.prototype.resizeColumnsForNewColumn = function(newColumn, beforeIndex) {
	var currentTotalWidth = this.getWidth();
	var newColumnMinWidth = newColumn.getMinWidth();
	if(newColumn.getMinWidth() === 0) {
		newColumnMinWidth = this._sizingMgr.getMinSize();
	}
	var newMaximumTotalWidth = currentTotalWidth - newColumnMinWidth;
	var combos = this.getPossibleColumnWidthCombinations(0, newMaximumTotalWidth);

	if(!combos || combos.length === 0) throw new Error('The columns cannot be resized to make space for the additional column');
	
	var currentWidths = this.getCurrentColumnWidths();

	//Get the indexes for the columns that will be on the right and left of the new column
	//Mek sure they are null if those columns don't exist (i.e. the new column is at the beginning or end)
	var rightIndex = (beforeIndex < this._childColumns.length) ? beforeIndex : null;
	var leftIndex = (beforeIndex > 0) ? beforeIndex - 1 : null;

	//Sort the combos so that we prioritize taking space from the columns on either side of the new column
	combos.sort(function(a, b) {
		var retVal = 0;
		
		//Prioritize taking space from the right first
		if(rightIndex !== null && a[rightIndex] !== b[rightIndex]) {
			//We want the largest value that isn't the same as the current value first, so if
			//the value hasn't changed from the current value we'll consider it zero
			var aVal = (a[rightIndex] === currentWidths[rightIndex]) ? 0 : a[rightIndex];
			var bVal = (b[rightIndex] === currentWidths[rightIndex]) ? 0 : b[rightIndex];
			return bVal - aVal;
		}
		//Next prioritize taking space from the left
		else if(leftIndex !== null && a[leftIndex] !== b[leftIndex]) {
			//We want the largest value that isn't the same as the current value first, so if
			//the value hasn't changed from the current value we'll consider it zero
			var aVal = (a[leftIndex] === currentWidths[leftIndex]) ? 0 : a[leftIndex];
			var bVal = (b[leftIndex] === currentWidths[leftIndex]) ? 0 : b[leftIndex];
			return bVal - aVal;
		}
		else {
			//The rest of the order doesn't matter
		}
	});
	
	//We'll use the combo that was sorted to the top
	var newColumnWidthCombination = combos[0];

	for (var i = 0; i < this._childColumns.length; i++) {
		var column = this._childColumns[i];
		column.setWidth(newColumnWidthCombination[i]);
	}
	
	//Finally, size the new column.  It should be the difference between the current total width 
	//and the sum of the new widths for the existing columns
	var existingColumnWidthSum = this._sizingMgr.sum(newColumnWidthCombination);
	var newColumnWidth = currentTotalWidth - existingColumnWidthSum;
	newColumn.setWidth(newColumnWidth);
};


ColumnGroupCell.prototype.toString = function() {
	return 'Cell, id: ' + this.getId() + ', width: ' + this.getWidth() + '\n';
};

module.exports = ColumnGroupCell;
