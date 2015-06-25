var assert = require("assert");
var Scaffold = require('../lib/Scaffold.js');
var BlockCell = require('../lib/BlockCell.js');
var ColumnGroupCell = require('../lib/ColumnGroupCell.js');
var Column = require('../lib/Column.js');


describe('Column', function() {
  
  describe('addChildCell', function() {
	  
    it('should add a cell in the right place', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cells = [
        scaffold.createBlockCell({"id": 1}),
        scaffold.createBlockCell({"id": 2}),
        scaffold.createBlockCell({"id": 3})
      ];
      var column = scaffold.createColumn(12, cells);
      var newCell = scaffold.createBlockCell({"id": "a"});
      
      //Act
      column.addChildCell(newCell, cells[2]);
      
      //Assert
      var columnCells = column.getChildCells();
      assert(columnCells);
      assert.strictEqual(columnCells.length, 4);
      assert.strictEqual(columnCells[0].getChildBlock().id, 1);
      assert.strictEqual(columnCells[1].getChildBlock().id, 2);
      assert.strictEqual(columnCells[2].getChildBlock().id, "a");
      assert.strictEqual(columnCells[3].getChildBlock().id, 3);
      
    });
    
    it('should add the cell at the end if beforeCell is not specified', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cells = [
        scaffold.createBlockCell({"id": 1}),
        scaffold.createBlockCell({"id": 2}),
        scaffold.createBlockCell({"id": 3})
      ];
      var column = scaffold.createColumn(12, cells);
      var newCell = scaffold.createBlockCell({"id": "a"});
      
      //Act
      column.addChildCell(newCell);
      
      //Assert
      var columnCells = column.getChildCells();
      assert(columnCells);
      assert.strictEqual(columnCells.length, 4);
      assert.strictEqual(columnCells[0].getChildBlock().id, 1);
      assert.strictEqual(columnCells[1].getChildBlock().id, 2);
      assert.strictEqual(columnCells[2].getChildBlock().id, 3);
     assert.strictEqual(columnCells[3].getChildBlock().id, "a");
       
    });

    it('should add the cell at the end if the column has no children', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cells = [];
      var column = scaffold.createColumn(12, cells);
      var newCell = scaffold.createBlockCell({"id": "a"});
      var beforeCell = scaffold.createBlockCell({"id": 1});
      
      //Act
      column.addChildCell(newCell, beforeCell);
      
      //Assert
      var columnCells = column.getChildCells();
      assert(columnCells);
      assert.strictEqual(columnCells.length, 1);
      assert.strictEqual(columnCells[0].getChildBlock().id, "a");
       
    });

  });
  
  describe('removeChildCell', function() {
	  
    it('should remove the correct cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cells = [
        scaffold.createBlockCell({"id": 1}),
        scaffold.createBlockCell({"id": 2}),
        scaffold.createBlockCell({"id": 3})
      ];
      var column = scaffold.createColumn(12, cells);
      
      //Act
      column.removeChildCell(cells[1]);
      
      //Assert
      var columnCells = column.getChildCells();
      assert(columnCells);
      assert.strictEqual(columnCells.length, 2);
      assert.strictEqual(columnCells[0].getChildBlock().id, 1);
      assert.strictEqual(columnCells[1].getChildBlock().id, 3);
      
    });
    
  });
  
  
  describe('delete', function() {
	  
    it('should delete the column, and any descendants', function() {
      
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
      var columnCCells = [
        scaffold.createBlockCell({"id": 5}),
        scaffold.createBlockCell({"id": 6})
      ];
      var columnC = scaffold.createColumn(12, columnCCells);
      
      var cell1 = scaffold.createColumnGroupCell([columnA, columnB]);
      var cell2 = scaffold.createColumnGroupCell([columnC]);
      var column = scaffold.createColumn(12, [cell1, cell2]);
      
      //Pre-Assert, just confirm that they all exist in the scaffold
      assert(scaffold.getColumnById(column.getId()));
      assert(scaffold.getCellById(cell1.getId()));
      assert(scaffold.getCellById(cell2.getId()));
      assert(scaffold.getColumnById(columnA.getId()));
      assert(scaffold.getColumnById(columnB.getId()));
      assert(scaffold.getColumnById(columnC.getId()));
      assert(scaffold.getCellByBlockId(1));
      assert(scaffold.getCellByBlockId(2));
      assert(scaffold.getCellByBlockId(3));
      assert(scaffold.getCellByBlockId(4));
      assert(scaffold.getCellByBlockId(5));
      assert(scaffold.getCellByBlockId(6));
      
      //Act
      column.delete();
     
      //Assert, make sure they are all deleted
      assert(!scaffold.getColumnById(column.getId()));
      assert(!scaffold.getCellById(cell1.getId()));
      assert(!scaffold.getCellById(cell2.getId()));
      assert(!scaffold.getColumnById(columnA.getId()));
      assert(!scaffold.getColumnById(columnB.getId()));
      assert(!scaffold.getColumnById(columnC.getId()));
      assert(!scaffold.getCellByBlockId(1));
      assert(!scaffold.getCellByBlockId(2));
      assert(!scaffold.getCellByBlockId(3));
      assert(!scaffold.getCellByBlockId(4));
      assert(!scaffold.getCellByBlockId(5));
      assert(!scaffold.getCellByBlockId(6));      
    });
    
  });

  describe('getPossibleFreeSpace', function() {
	  

    it('should return the right sizes when holding all block cells', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var column = scaffold.createColumn(12, [
        scaffold.createBlockCell({"id": 1}),
        scaffold.createBlockCell({"id": 2}),
        scaffold.createBlockCell({"id": 3})
      ]);
     
        
      //Act
      var possibleFreeSpace = column.getPossibleFreeSpace();

      //Assert
      assert(possibleFreeSpace);
      assert.strictEqual(possibleFreeSpace.length, 3);
      assert.strictEqual(possibleFreeSpace[0], 4);
      assert.strictEqual(possibleFreeSpace[1], 6);
      assert.strictEqual(possibleFreeSpace[2], 8);

    });

    it('should return the right sizes when holding block cells and a column group cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var column = scaffold.createColumn(12, [
        scaffold.createBlockCell({"id": 1}),
        scaffold.createBlockCell({"id": 2}),
        scaffold.createColumnGroupCell([
          scaffold.createColumn(8, [
            scaffold.createBlockCell({"id": 1})
          ]),
          scaffold.createColumn(4, [
            scaffold.createBlockCell({"id": 1})
          ])
        ])
      ]);
     
        
      //Act
      var possibleFreeSpace = column.getPossibleFreeSpace();

      //Assert
      assert(possibleFreeSpace);
      assert.strictEqual(possibleFreeSpace.length, 1);
      assert.strictEqual(possibleFreeSpace[0], 4);

    });

    it('should return nothing when already the smallest size', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var column = scaffold.createColumn(4, [
        scaffold.createBlockCell({"id": 1}),
        scaffold.createBlockCell({"id": 2}),
        scaffold.createBlockCell({"id": 3})
      ]);
     
        
      //Act
      var possibleFreeSpace = column.getPossibleFreeSpace();

      //Assert
      assert(possibleFreeSpace);
      assert.strictEqual(possibleFreeSpace.length, 0);

    });

    it('should return nothing when holding a column group cell that cannot be shrunk', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var column = scaffold.createColumn(12, [
        scaffold.createColumnGroupCell([
          scaffold.createColumn(8, [
            scaffold.createColumnGroupCell([
              scaffold.createColumn(4, [
                scaffold.createBlockCell({"id": 1})
              ]),
              scaffold.createColumn(4, [
                scaffold.createBlockCell({"id": 2})
              ])
            ])
          ]),
          scaffold.createColumn(4, [
            scaffold.createBlockCell({"id": 3})
          ])
        ])
      ]);
     
        
      //Act
      var possibleFreeSpace = column.getPossibleFreeSpace();

      //Assert
      assert(possibleFreeSpace);
      assert.strictEqual(possibleFreeSpace.length, 0);

    });
  });

});
