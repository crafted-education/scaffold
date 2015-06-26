var ContentCell = require('./ContentCell.js');
var ColumnGroupCell = require('./ColumnGroupCell.js');
var Column = require('./Column.js');
var SizingMgr = require('./SizingMgr.js');


module.exports = function Scaffold(options) {
	var self = this;
	
	var sizingMgr = new SizingMgr(options.validSizes);
	if(!sizingMgr.isSizeValid(options.width)) throw new Error('The supplied scaffold width is not a valid size.');
	
	var rootColumn = new Column(options.width, [], null, sizingMgr);
	
	var cellsById = {};
	var cellsByContentId = {};
	var columnsById = {};
	columnsById[rootColumn.getId()] = rootColumn;
	
	this.getRootColumn = function() {
		return rootColumn;	
	};

	this.getCellById = function(id) {
		var cell = cellsById[id] || null;
		
		//If this cell has been deleted, remove it and return null
		if(cell && cell.isDeleted()) {
			delete cellsById[id];
			
			if(cell instanceof ContentCell) {
				delete cellsByContentId[cell.getChildContent().id];
			}
			
			cell = null;
		}
		
		return cell;	
	};
	
	this.getCellByContentId = function(contentId) {
		var cell = cellsByContentId[contentId] || null;
		
		//If this cell has been deleted, remove it and return null
		if(cell && cell.isDeleted()) {
			delete cellsById[cell.getId()];
			delete cellsByContentId[contentId];
			cell = null;
		}
		
		return cell;	
	};
	
	this.getColumnById = function(id) {
		var column = columnsById[id]  || null;
		
		//If this cell has been deleted, remove it and return null
		if(column && column.isDeleted()) {
			delete columnsById[id];
			column = null;
		}
		
		return column;	
	};
	
	this.createContentCell = function(content) {
		var cell = new ContentCell(content, null, sizingMgr);
		cellsByContentId[content.id] = cell;
		cellsById[cell.getId()] = cell;
		
		return cell;
	};
	
	this.createColumnGroupCell = function(columns) {
		var cell = new ColumnGroupCell(columns, null, sizingMgr);
		
		cellsById[cell.getId()] = cell;
		
		return cell;
	};
	

	this.createColumn = function(width, cells) {
		var column = new Column(width, cells, null, sizingMgr);
				
		columnsById[column.getId()] = column;
		
		return column;
	};
	
	this.moveCell = function(cell, destinationColumn, beforeCell) {
		cell.getParentColumn().removeChildCell(cell);
		destinationColumn.addChildCell(cell, beforeCell);
	};
	

	this.moveColumn = function(column, destinationCell, beforeColumn) {
		column.getParentCell().removeChildColumn(column);
		destinationCell.addChildColumn(column, beforeColumn);
	};
	
	this.canReplaceContentWithColumns = function(contentCell) {
		var freeSpacePossibilities = contentCell.getPossibleFreeSpace();
		for (var i = 0; i < freeSpacePossibilities.length; i++) {
			if(sizingMgr.isSizeValid(freeSpacePossibilities[i])) {
				return true;
			}
		}
		return false;
	};
	
	this.replaceContentWithColumns = function(contentCell, placeContentInRightColumn) {
		//Create a new two column cell
		var columnGroup = self.createColumnGroupCell([
			self.createColumn(6, []),
			self.createColumn(6, [])
		]);
		
		//Set the width the same as the content cell it is replacing
		columnGroup.setWidth(contentCell.getWidth());

		//Figure out which column we need to put the existing content into
		var columnIndex = 0;
		if(placeContentInRightColumn) {
			columnIndex = 1;
		}
		
		//Get the column we need to add this content cell to
		var column = columnGroup.getChildColumns()[columnIndex];
		
		var parentColumn = contentCell.getParentColumn();
		
		if(parentColumn) {
			//Find out what position this content cell is currently in
			var beforeCell = null;
			var parentChildCells = parentColumn.getChildCells();
			for (var i = 0; i < parentChildCells.length; i++) {
				var childCell = parentChildCells[i];
				
				if(childCell.getId() === contentCell.getId()) {
					beforeCell = parentChildCells[i + 1] || null;
				}
			}
			
			//Remove this cell from it's current parent column
			parentColumn.removeChildCell(contentCell);
			
			//Add this cell to the column
			column.addChildCell(contentCell);
			
			//Add the columnGroup to the former parent column
			parentColumn.addChildCell(columnGroup, beforeCell);
		}
	};
};