var assert = require("assert");
var Scaffold = require('../lib/Scaffold.js');
var BlockCell = require('../lib/BlockCell.js');
var ColumnGroupCell = require('../lib/ColumnGroupCell.js');
var Column = require('../lib/Column.js');


describe('Scaffold', function() {
  
  describe('constructor', function() {
	  
    it('should create a scaffold object', function() {
      //Act
      var scaffold = new Scaffold({ "width": 12, "validSizes": [12, 8, 6, 4]});
      
      //Assert
      assert(scaffold);
      assert(scaffold instanceof Scaffold);
    });
    
    it('should create a root column', function() {
       //Act
      var scaffold = new Scaffold({ "width": 12, "validSizes": [12, 8, 6, 4]});
      var rootColumn = scaffold.getRootColumn();

      //Assert
      assert(rootColumn);
      assert(rootColumn instanceof Column);
    });

  });
  
  
  describe('getCellById', function() {
	  
    it('should return the correct cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var block = { "id": "123" };
      var cell = scaffold.createBlockCell(block);
      
      //Act
      var retrievedCell = scaffold.getCellById(cell.getId());
      
      //Assert
      assert(retrievedCell);
      assert.strictEqual(cell, retrievedCell);
    });

    it('should return null for an id that does not exist', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var block = { "id": "123" };
      var cell = scaffold.createBlockCell(block);
      
      //Act
      var retrievedCell = scaffold.getCellById("doesNotExist");
      
      //Assert
      assert.strictEqual(null, retrievedCell);
    });
   });
 
 
   describe('getCellByBlockId', function() {
	  
    it('should return the correct cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var block = { "id": "123" };
      var cell = scaffold.createBlockCell(block);
      
      //Act
      var retrievedCell = scaffold.getCellByBlockId("123");
      
      //Assert
      assert(retrievedCell);
      assert.strictEqual(cell, retrievedCell);
    });

    it('should return null for an id that does not exist', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var block = { "id": "123" };
      var cell = scaffold.createBlockCell(block);
      
      //Act
      var retrievedCell = scaffold.getCellByBlockId("doesNotExist");
      
      //Assert
      assert.strictEqual(null, retrievedCell);
    });
   });
 

  describe('createBlockCell', function() {
	  
    it('should return a cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var block = { "id": "123" };
      
      //Act
      var cell = scaffold.createBlockCell(block);
      
      //Assert
      assert(cell);
      assert(cell instanceof BlockCell);
      assert.strictEqual(block, cell.getChildBlock());
    });
	
    it('should throw an error on a null block', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var block = null;
      
      //Assert
      assert.throws(function() {
        //Act
        scaffold.createBlockCell(block);
      }, /Cannot create a block cell for a null block/);
    });

    it('should throw an error on a block with no id', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var block = {};
      
      //Assert
      assert.throws(function() {
        //Act
        scaffold.createBlockCell(block);
      }, /Cannot create a block cell for a block that has no id/);
    });

  });
  
  describe('createColumnGroupCell', function() {
	  
    it('should return a cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columns = [
        scaffold.createColumn(12, []),
        scaffold.createColumn(12, [])
      ];
      
      //Act
      var cell = scaffold.createColumnGroupCell(columns);
      
      //Assert
      assert(cell);
      assert(cell instanceof ColumnGroupCell);
      assert.strictEqual(columns, cell.getChildColumns());
    });
	
    it('should throw an error on a null columns array', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columns = null;
      
      //Assert
      assert.throws(function() {
        //Act
        scaffold.createColumnGroupCell(columns);
      }, /Cannot create a column group cell for a null columns array/);
    });

    it('should throw an error on an empty columns array', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columns = [];
      
      //Assert
      assert.throws(function() {
        //Act
        scaffold.createColumnGroupCell(columns);
      }, /Cannot create a column group cell for an empty columns array/);
    });

  });

  
  describe('getColumnById', function() {
	  
    it('should return the correct column', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var block = { "id": "123" };
      var cell = scaffold.createBlockCell(block);
      var column = scaffold.createColumn(12, [cell]);
      
      //Act
      var retrievedColumn = scaffold.getColumnById(column.getId());
      
      //Assert
      assert(retrievedColumn);
      assert.strictEqual(column, retrievedColumn);
    });

    it('should return null for an id that does not exist', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var block = { "id": "123" };
      var cell = scaffold.createBlockCell(block);
      scaffold.createColumn(12, [cell]);
      
      //Act
      var retrievedColumn = scaffold.getColumnById('doesNotExist');
      
      //Assert
      assert.strictEqual(null, retrievedColumn);
    });
   });
 
 
  describe('createColumn', function() {
	  
    it('should return a column', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cells = [
        scaffold.createBlockCell({ "id": 1 }),
        scaffold.createBlockCell({ "id": 2 })
      ];
      
      //Act
      var column = scaffold.createColumn(12, cells);
      
      //Assert
      assert(column);
      assert(column instanceof Column);
      assert.strictEqual(cells, column.getChildCells());
    });
	
  });


  describe('moveCell', function() {
	  
    it('should move the cell to the middle of a different column', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnACells = [
        scaffold.createBlockCell({"id": 1}),
        scaffold.createBlockCell({"id": 2})
      ];
      var columnA = scaffold.createColumn(6, columnACells);
      var columnBCells = [
        scaffold.createBlockCell({"id": 3}),
        scaffold.createBlockCell({"id": 4})
      ];
      var columnB = scaffold.createColumn(6, columnBCells);

      //Act
      scaffold.moveCell(columnACells[1], columnB, columnBCells[1]);
      
      //Assert
      var updatedColumnACells = columnA.getChildCells();
      assert(updatedColumnACells);
      assert.strictEqual(updatedColumnACells.length, 1);
      assert.strictEqual(updatedColumnACells[0].getChildBlock().id, 1);

      var updatedColumnBCells = columnB.getChildCells();
      assert(updatedColumnBCells);
      assert.strictEqual(updatedColumnBCells.length, 3);
      assert.strictEqual(updatedColumnBCells[0].getChildBlock().id, 3);
      assert.strictEqual(updatedColumnBCells[1].getChildBlock().id, 2);
      assert.strictEqual(updatedColumnBCells[2].getChildBlock().id, 4);

      
    });


    it('should move the cell to the end of a different column', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnACells = [
        scaffold.createBlockCell({"id": 1}),
        scaffold.createBlockCell({"id": 2})
      ];
      var columnA = scaffold.createColumn(6, columnACells);
      var columnBCells = [
        scaffold.createBlockCell({"id": 3}),
        scaffold.createBlockCell({"id": 4})
      ];
      var columnB = scaffold.createColumn(6, columnBCells);

      //Act
      scaffold.moveCell(columnACells[1], columnB);
      
      //Assert
      var updatedColumnACells = columnA.getChildCells();
      assert(updatedColumnACells);
      assert.strictEqual(updatedColumnACells.length, 1);
      assert.strictEqual(updatedColumnACells[0].getChildBlock().id, 1);

      var updatedColumnBCells = columnB.getChildCells();
      assert(updatedColumnBCells);
      assert.strictEqual(updatedColumnBCells.length, 3);
      assert.strictEqual(updatedColumnBCells[0].getChildBlock().id, 3);
      assert.strictEqual(updatedColumnBCells[1].getChildBlock().id, 4);
      assert.strictEqual(updatedColumnBCells[2].getChildBlock().id, 2);

      
    });

    it('should move the cell to a different spot in the same column', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnCells = [
        scaffold.createBlockCell({"id": 1}),
        scaffold.createBlockCell({"id": 2}),
        scaffold.createBlockCell({"id": 3}),
        scaffold.createBlockCell({"id": 4})
     ];
      var column = scaffold.createColumn(12, columnCells);

      //Act
      scaffold.moveCell(columnCells[1], column, columnCells[3]);
      
      //Assert
      var updatedColumnCells = column.getChildCells();
      assert(updatedColumnCells);
      assert.strictEqual(updatedColumnCells.length, 4);
      assert.strictEqual(updatedColumnCells[0].getChildBlock().id, 1);
      assert.strictEqual(updatedColumnCells[1].getChildBlock().id, 3);
      assert.strictEqual(updatedColumnCells[2].getChildBlock().id, 2);
      assert.strictEqual(updatedColumnCells[3].getChildBlock().id, 4);

      
    });
    
  });
  
  describe('moveColumn', function() {
	  
    it('should move the column to the middle of a different cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cellAColumns = [
        scaffold.createColumn(8, [scaffold.createBlockCell({"id": 1})]),
        scaffold.createColumn(4, [scaffold.createBlockCell({"id": 2})])
      ];
      var cellA = scaffold.createColumnGroupCell(cellAColumns);
      var cellBColumns = [
        scaffold.createColumn(8, [scaffold.createBlockCell({"id": 3})]),
        scaffold.createColumn(4, [scaffold.createBlockCell({"id": 4})])
      ];
      var cellB = scaffold.createColumnGroupCell(cellBColumns);
      
      var column1Id = cellAColumns[0].getId();
      var column2Id = cellAColumns[1].getId();
      var column3Id = cellBColumns[0].getId();
      var column4Id = cellBColumns[1].getId();

      //Act
      scaffold.moveColumn(cellAColumns[1], cellB, cellBColumns[1]);
      
      //Assert
      var updatedCellAColumns = cellA.getChildColumns();
      assert(updatedCellAColumns);
      assert.strictEqual(updatedCellAColumns.length, 1);
      assert.strictEqual(updatedCellAColumns[0].getId(), column1Id);

      var updatedCellBColumns = cellB.getChildColumns();
      assert(updatedCellBColumns);
      assert.strictEqual(updatedCellBColumns.length, 3);
      assert.strictEqual(updatedCellBColumns[0].getId(), column3Id);
      assert.strictEqual(updatedCellBColumns[1].getId(), column2Id);
      assert.strictEqual(updatedCellBColumns[2].getId(), column4Id);
    });


  });
});
