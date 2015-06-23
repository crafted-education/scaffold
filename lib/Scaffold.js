var BlockCell = require('./BlockCell.js');
var ColumnGroupCell = require('./ColumnGroupCell.js');
var Column = require('./Column.js');
var SizingMgr = require('./SizingMgr.js');


module.exports = function Scaffold(options) {
	var self = this;
	
	var sizingMgr = new SizingMgr(options.validSizes);
	if(!sizingMgr.isSizeValid(options.width)) throw new Error('The supplied scaffold width is not a valid size.');
	
	var rootColumn = new Column(options.width, [], null, sizingMgr);
	
	var cellsById = {};
	var cellsByBlockId = {};
	var columnsById = {};
	columnsById[rootColumn.getId()] = rootColumn;
	
	this.getRootColumn = function() {
		return rootColumn;	
	};

	//Cell Methods
	this.getCellById = function(id) {
		var cell = cellsById[id] || null;
		
		//If this cell has been deleted, remove it and return null
		if(cell && cell.isDeleted()) {
			delete cellsById[id];
			
			if(cell instanceof BlockCell) {
				delete cellsByBlockId[cell.getChildBlock().id];
			}
			
			cell = null;
		}
		
		return cell;	
	};
	
	this.getCellByBlockId = function(blockId) {
		var cell = cellsByBlockId[blockId] || null;
		
		//If this cell has been deleted, remove it and return null
		if(cell && cell.isDeleted()) {
			delete cellsById[cell.getId()];
			delete cellsByBlockId[blockId];
			cell = null;
		}
		
		return cell;	
};
	
	this.createBlockCell = function(block) {
		var self = this;
		var cell = new BlockCell(block, null, sizingMgr, createDefaultColumnGroupCell);
		cellsByBlockId[block.id] = cell;
		cellsById[cell.getId()] = cell;
		
		return cell;
	};
	
	this.createColumnGroupCell = function(columns) {
		var cell = new ColumnGroupCell(columns, null, sizingMgr);
		
		cellsById[cell.getId()] = cell;
		
		return cell;
	};
	

	this.moveCell = function(cell, destinationColumn, beforeCell) {
		cell._parentColumn.removeChildCell(cell);
		destinationColumn.addChildCell(cell, beforeCell);
	};
	
	
	
	//Column Methods
	this.getColumnById = function(id) {
		var column = columnsById[id]  || null;
		
		//If this cell has been deleted, remove it and return null
		if(column && column.isDeleted()) {
			delete columnsById[id];
			column = null;
		}
		
		return column;	
	};
	
	this.createColumn = function(width, cells) {
		var column = new Column(width, cells, null, sizingMgr);
				
		columnsById[column.getId()] = column;
		
		return column;
	};

	this.moveColumn = function(column, destinationCell, beforeColumn) {
		column._parentCell.removeChildColumn(column);
		destinationCell.addChildColumn(column, beforeColumn);
	};
	
	this.isValidSize = function(size) {
		return (validSizes.indexOf(size) > -1);	
	};

	//This function get passed down to each block cell
	var self = this;
	function createDefaultColumnGroupCell() {
		return self.createColumnGroupCell([
			self.createColumn(6, []),
			self.createColumn(6, [])
		]);
	};

};