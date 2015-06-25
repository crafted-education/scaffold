var assert = require("assert");
var Scaffold = require('../lib/Scaffold.js');
var BlockCell = require('../lib/BlockCell.js');
var ColumnGroupCell = require('../lib/ColumnGroupCell.js');
var Column = require('../lib/Column.js');


describe('ColumnGroupCell', function() {

  describe('delete', function() {
	  
    it('should delete the cell, and any descendant cells', function() {
      
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
      
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
      
      
      //Pre-Assert
      assert(scaffold.getCellById(cell.getId()));
      assert(scaffold.getColumnById(columnA.getId()));
      assert(scaffold.getColumnById(columnB.getId()));
      assert(scaffold.getCellByBlockId(1));
      assert(scaffold.getCellByBlockId(2));
      assert(scaffold.getCellByBlockId(3));
      assert(scaffold.getCellByBlockId(4));

      
      //Act
      cell.delete();
     
      //Assert
      assert(!scaffold.getCellById(cell.getId()));
      assert(!scaffold.getColumnById(columnA.getId()));
      assert(!scaffold.getColumnById(columnB.getId()));
      assert(!scaffold.getCellByBlockId(1));
      assert(!scaffold.getCellByBlockId(2));
      assert(!scaffold.getCellByBlockId(3));
      assert(!scaffold.getCellByBlockId(4));
      
    });
    
  });

  
  describe('addChildColumn', function() {
	  
    it('should add a column in the middle', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columns = [
        scaffold.createColumn(8, [scaffold.createBlockCell({id: 1})]),
        scaffold.createColumn(4, [scaffold.createBlockCell({id: 2})])
      ];
      var cell = scaffold.createColumnGroupCell(columns);
      var newColumn = scaffold.createColumn(12, [scaffold.createBlockCell({id: 3})]);
      
      var columnId1 = columns[0].getId();
      var columnId2 = columns[1].getId();
      
      //Act
      cell.addChildColumn(newColumn, columns[1]);
     
      //Assert
      var cellColumns = cell.getChildColumns();
      assert(cellColumns);
      assert.strictEqual(cellColumns.length, 3);
      assert.strictEqual(cellColumns[0].getId(), columnId1);
      assert.strictEqual(cellColumns[0].getWidth(), 4);
      assert.strictEqual(cellColumns[1].getId(), newColumn.getId());
      assert.strictEqual(cellColumns[1].getWidth(), 4);
      assert.strictEqual(cellColumns[2].getId(), columnId2);
      assert.strictEqual(cellColumns[2].getWidth(), 4);
      
    });
    
    
    it('should add a column to the beginning', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columns = [
        scaffold.createColumn(8, [scaffold.createBlockCell({id: 1})]),
        scaffold.createColumn(4, [scaffold.createBlockCell({id: 2})])
      ];
      var cell = scaffold.createColumnGroupCell(columns);
      var newColumn = scaffold.createColumn(12, [scaffold.createBlockCell({id: 3})]);
      
      var columnId1 = columns[0].getId();
      var columnId2 = columns[1].getId();
      
      //Act
      cell.addChildColumn(newColumn, columns[0]);
     
      //Assert
      var cellColumns = cell.getChildColumns();
      assert(cellColumns);
      assert.strictEqual(cellColumns.length, 3);
      assert.strictEqual(cellColumns[0].getId(), newColumn.getId());
      assert.strictEqual(cellColumns[0].getWidth(), 4);
      assert.strictEqual(cellColumns[1].getId(), columnId1);
      assert.strictEqual(cellColumns[1].getWidth(), 4);
      assert.strictEqual(cellColumns[2].getId(), columnId2);
      assert.strictEqual(cellColumns[2].getWidth(), 4);
      
    });

    
    it('should add a column to the end', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columns = [
        scaffold.createColumn(8, [scaffold.createBlockCell({id: 1})]),
        scaffold.createColumn(4, [scaffold.createBlockCell({id: 2})])
      ];
      var cell = scaffold.createColumnGroupCell(columns);
      var newColumn = scaffold.createColumn(12, [scaffold.createBlockCell({id: 3})]);
      
      var columnId1 = columns[0].getId();
      var columnId2 = columns[1].getId();
      
      //Act
      cell.addChildColumn(newColumn);
     
      //Assert
      var cellColumns = cell.getChildColumns();
      assert(cellColumns);
      assert.strictEqual(cellColumns.length, 3);
      assert.strictEqual(cellColumns[0].getId(), columnId1);
      assert.strictEqual(cellColumns[0].getWidth(), 4);
      assert.strictEqual(cellColumns[1].getId(), columnId2);
      assert.strictEqual(cellColumns[1].getWidth(), 4);
      assert.strictEqual(cellColumns[2].getId(), newColumn.getId());
      assert.strictEqual(cellColumns[2].getWidth(), 4);
      
    });
    
    it('should add a column take space for it from the left', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columns = [
        scaffold.createColumn(8, [scaffold.createBlockCell({id: 1})]),
        scaffold.createColumn(4, [scaffold.createBlockCell({id: 2})])
      ];
      var cell = scaffold.createColumnGroupCell(columns);
      var newColumn = scaffold.createColumn(12, [scaffold.createBlockCell({id: 3})]);
      
      var columnId1 = columns[0].getId();
      var columnId2 = columns[1].getId();
      
      //Act
      cell.addChildColumn(newColumn, columns[1]);
     
      //Assert
      var cellColumns = cell.getChildColumns();
      assert(cellColumns);
      assert.strictEqual(cellColumns.length, 3);
      assert.strictEqual(cellColumns[0].getId(), columnId1);
      assert.strictEqual(cellColumns[0].getWidth(), 4);
      assert.strictEqual(cellColumns[1].getId(), newColumn.getId());
      assert.strictEqual(cellColumns[1].getWidth(), 4);
      assert.strictEqual(cellColumns[2].getId(), columnId2);
      assert.strictEqual(cellColumns[2].getWidth(), 4);
      
    });
    
    it('should add a column take space for it from the right', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columns = [
        scaffold.createColumn(4, [scaffold.createBlockCell({id: 1})]),
        scaffold.createColumn(8, [scaffold.createBlockCell({id: 2})])
      ];
      var cell = scaffold.createColumnGroupCell(columns);
      var newColumn = scaffold.createColumn(12, [scaffold.createBlockCell({id: 3})]);
      
      var columnId1 = columns[0].getId();
      var columnId2 = columns[1].getId();
      
      //Act
      cell.addChildColumn(newColumn, columns[1]);
     
      //Assert
      var cellColumns = cell.getChildColumns();
      assert(cellColumns);
      assert.strictEqual(cellColumns.length, 3);
      assert.strictEqual(cellColumns[0].getId(), columnId1);
      assert.strictEqual(cellColumns[0].getWidth(), 4);
      assert.strictEqual(cellColumns[1].getId(), newColumn.getId());
      assert.strictEqual(cellColumns[1].getWidth(), 4);
      assert.strictEqual(cellColumns[2].getId(), columnId2);
      assert.strictEqual(cellColumns[2].getWidth(), 4);
      
    });
    
    it('should add a column and take space for it from both the right and left if needed', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columns = [
        scaffold.createColumn(6, [scaffold.createBlockCell({id: 1})]),
        scaffold.createColumn(6, [scaffold.createBlockCell({id: 2})])
      ];
      var cell = scaffold.createColumnGroupCell(columns);
      var newColumn = scaffold.createColumn(12, [scaffold.createBlockCell({id: 3})]);
      
      var columnId1 = columns[0].getId();
      var columnId2 = columns[1].getId();
      
      //Act
      cell.addChildColumn(newColumn, columns[1]);
     
      //Assert
      var cellColumns = cell.getChildColumns();
      assert(cellColumns);
      assert.strictEqual(cellColumns.length, 3);
      assert.strictEqual(cellColumns[0].getId(), columnId1);
      assert.strictEqual(cellColumns[0].getWidth(), 4);
      assert.strictEqual(cellColumns[1].getId(), newColumn.getId());
      assert.strictEqual(cellColumns[1].getWidth(), 4);
      assert.strictEqual(cellColumns[2].getId(), columnId2);
      assert.strictEqual(cellColumns[2].getWidth(), 4);
      
    });
  });
  


  describe('removeColumnFromCell', function() {
	  
    it('should remove a column in the middle', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columns = [
        scaffold.createColumn(4, [scaffold.createBlockCell({"id":1})]),
        scaffold.createColumn(4, [scaffold.createBlockCell({"id":2})]),
        scaffold.createColumn(4, [scaffold.createBlockCell({"id":3})])
      ];
      var cell = scaffold.createColumnGroupCell(columns);
     
      var columnId1 = columns[0].getId();
      var columnId3 = columns[2].getId();
      
      //Act
      cell.removeChildColumn(columns[1]);
     
      //Assert
      var cellColumns = cell.getChildColumns();
      assert(cellColumns);
      assert.strictEqual(cellColumns.length, 2);
      assert.strictEqual(cellColumns[0].getId(), columnId1);
      assert.strictEqual(cellColumns[0].getWidth(), 8);
      assert.strictEqual(cellColumns[1].getId(), columnId3);
      assert.strictEqual(cellColumns[1].getWidth(), 4);
      
    });

    it('should remove a column from the beginning', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columns = [
        scaffold.createColumn(4, [scaffold.createBlockCell({"id":1})]),
        scaffold.createColumn(4, [scaffold.createBlockCell({"id":2})]),
        scaffold.createColumn(4, [scaffold.createBlockCell({"id":3})])
      ];
      var cell = scaffold.createColumnGroupCell(columns);
     
      var columnId2 = columns[1].getId();
      var columnId3 = columns[2].getId();
      
      //Act
      cell.removeChildColumn(columns[0]);
     
      //Assert
      var cellColumns = cell.getChildColumns();
      assert(cellColumns);
      assert.strictEqual(cellColumns.length, 2);
      assert.strictEqual(cellColumns[0].getId(), columnId2);
      assert.strictEqual(cellColumns[0].getWidth(), 8);
      assert.strictEqual(cellColumns[1].getId(), columnId3);
      assert.strictEqual(cellColumns[1].getWidth(), 4);
      
    });

    it('should remove a column from the end', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columns = [
        scaffold.createColumn(4, [scaffold.createBlockCell({"id":1})]),
        scaffold.createColumn(4, [scaffold.createBlockCell({"id":2})]),
        scaffold.createColumn(4, [scaffold.createBlockCell({"id":3})])
      ];
      var cell = scaffold.createColumnGroupCell(columns);
     
      var columnId1 = columns[0].getId();
      var columnId2 = columns[1].getId();
      
      //Act
      cell.removeChildColumn(columns[2]);
     
      //Assert
      var cellColumns = cell.getChildColumns();
      assert(cellColumns);
      assert.strictEqual(cellColumns.length, 2);
      assert.strictEqual(cellColumns[0].getId(), columnId1);
      assert.strictEqual(cellColumns[0].getWidth(), 8);
      assert.strictEqual(cellColumns[1].getId(), columnId2);
      assert.strictEqual(cellColumns[1].getWidth(), 4);
      
    });
    
    it('should not remove anything if the cell cannot be found', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columns = [
        scaffold.createColumn(4, [scaffold.createBlockCell({"id":1})]),
        scaffold.createColumn(4, [scaffold.createBlockCell({"id":2})]),
        scaffold.createColumn(4, [scaffold.createBlockCell({"id":3})])
      ];
      var otherColumn = scaffold.createColumn(4, []);
      var cell = scaffold.createColumnGroupCell(columns);
     
      var columnId1 = columns[0].getId();
      var columnId2 = columns[1].getId();
      var columnId3 = columns[2].getId();
      
      //Act
      cell.removeChildColumn(otherColumn);
     
      //Assert
      var cellColumns = cell.getChildColumns();
      assert(cellColumns);
      assert.strictEqual(cellColumns.length, 3);
      assert.strictEqual(cellColumns[0].getId(), columnId1);
      assert.strictEqual(cellColumns[0].getWidth(), 4);
      assert.strictEqual(cellColumns[1].getId(), columnId2);
      assert.strictEqual(cellColumns[1].getWidth(), 4);
      assert.strictEqual(cellColumns[2].getId(), columnId3);
      assert.strictEqual(cellColumns[2].getWidth(), 4);
      
    });

  });

  describe('getPossibleFreeSpace', function() {
	  

    it('should return the right sizes', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(8, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 1})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      var possibleFreeSpace = cell.getPossibleFreeSpace();

      //Assert
      assert(possibleFreeSpace);
      assert.strictEqual(possibleFreeSpace.length, 1);
      assert.strictEqual(possibleFreeSpace[0], 4);

    });

    it('should return the right sizes - 2', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(6, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(6, [scaffold.createBlockCell({"id": 1})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      var possibleFreeSpace = cell.getPossibleFreeSpace();

      //Assert
      assert(possibleFreeSpace);
      assert.strictEqual(possibleFreeSpace.length, 1);
      assert.strictEqual(possibleFreeSpace[0], 4);

    });

    it('should return none if the columns are already too small', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 1})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      var possibleFreeSpace = cell.getPossibleFreeSpace();

      //Assert
      assert(possibleFreeSpace);
      assert.strictEqual(possibleFreeSpace.length, 0);

    });

    it('should return none if the columns are already too small - 2', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 1})]);
      var columnC = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 1})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB, columnC]);
        
      //Act
      var possibleFreeSpace = cell.getPossibleFreeSpace();

      //Assert
      assert(possibleFreeSpace);
      assert.strictEqual(possibleFreeSpace.length, 0);

    });
  });
  
  describe('canColumnsResize', function() {
	  
    it('should return true if the columns can be resized', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(8, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      var canResize = cell.canColumnsResize();

      //Assert
      assert(canResize);
    });
    
    it('should return true if the columns can be resized - 2', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(6, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(6, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      var canResize = cell.canColumnsResize();

      //Assert
      assert(canResize);
    });

    it('should return true if the columns can be resized - 3', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(8, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      var canResize = cell.canColumnsResize();

      //Assert
      assert(canResize);
    });

    it('should return false if the columns cannot be resized because they are already the smallest size', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      var canResize = cell.canColumnsResize();

      //Assert
      assert(!canResize);
    });

    it('should return false if the columns cannot be resized because of subcolumns', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cell = scaffold.createColumnGroupCell([
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
        ]);
        
      //Act
      var canResize = cell.canColumnsResize();

      //Assert
      assert(!canResize);
    });

  });
  
  describe('canAddColumn', function() {
	  
    it('should return true if there is room for a new column', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(8, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      var canAddColumn = cell.canAddColumn();

      //Assert
      assert(canAddColumn);
    });
    
    it('should return false if there is no room for a new column', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cell = scaffold.createColumnGroupCell([
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
        ]);
        
      //Act
      var canAddColumn = cell.canAddColumn();

      //Assert
      assert(!canAddColumn);
    });

    it('should return false if there is no room for a new column - 2', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cell = scaffold.createColumnGroupCell([
          scaffold.createColumn(4, [
            scaffold.createBlockCell({"id": 3})
          ]),
          scaffold.createColumn(4, [
            scaffold.createBlockCell({"id": 3})
          ]),
          scaffold.createColumn(4, [
            scaffold.createBlockCell({"id": 3})
          ])
        ]);
        
      //Act
      var canAddColumn = cell.canAddColumn();

      //Assert
      assert(!canAddColumn);
    });
    
    it('should return false if there is no room for a new column - with empty column', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cell = scaffold.createColumnGroupCell([
           scaffold.createColumn(6, [
            scaffold.createBlockCell({"id": 3})
          ]),
          scaffold.createColumn(6, [
            scaffold.createBlockCell({"id": 3})
          ])
        ]);
        
        cell.addChildColumn(scaffold.createColumn(12, []));
        
      //Act
      var canAddColumn = cell.canAddColumn();

      //Assert
      assert(!canAddColumn);
    });

  });
  
  describe('isEmpty', function() {
	  
    it('should return false if a column has a block cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(8, []);
      var columnB = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      var isEmpty = cell.isEmpty();

      //Assert
      assert(!isEmpty);
    });
	  
    it('should return false if a column has a block cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(8, []);
      var columnB = scaffold.createColumn(4, []);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      var isEmpty = cell.isEmpty();

      //Assert
      assert(isEmpty);
    });
	  
    it('should return false if a sub-column has a block cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cell = scaffold.createColumnGroupCell([
          scaffold.createColumn(8, [
            scaffold.createColumnGroupCell([
              scaffold.createColumn(4, []),
              scaffold.createColumn(4, [
                scaffold.createBlockCell({"id": 2})
              ])
            ])
          ]),
          scaffold.createColumn(4, [])
        ]);
        
      //Act
      var isEmpty = cell.isEmpty();

      //Assert
      assert(!isEmpty);
    });

    it('should return true if no column or sub-column has a block cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cell = scaffold.createColumnGroupCell([
          scaffold.createColumn(8, [
            scaffold.createColumnGroupCell([
              scaffold.createColumn(4, []),
              scaffold.createColumn(4, [])
            ])
          ]),
          scaffold.createColumn(4, [])
        ]);
        
      //Act
      var isEmpty = cell.isEmpty();

      //Assert
      assert(isEmpty);
    });

  });

  describe('getPossibleColumnWidthCombinations', function() {
	  
    it('should return the right combinations', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(8, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      var combos = cell.getPossibleColumnWidthCombinations();

      //Assert
      assert(combos);
      assert.strictEqual(combos.length, 3);
      assert.strictEqual(combos[0][0], 8);
      assert.strictEqual(combos[0][1], 4);
      assert.strictEqual(combos[1][0], 6);
      assert.strictEqual(combos[1][1], 6);
      assert.strictEqual(combos[2][0], 4);
      assert.strictEqual(combos[2][1], 8);
    });

    it('should filter out the combinations that do not match the min and max provided', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(8, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      var combos = cell.getPossibleColumnWidthCombinations(4, 8);

      //Assert
      assert(combos);
      assert.strictEqual(combos.length, 1);
      assert.strictEqual(combos[0][0], 4);
      assert.strictEqual(combos[0][1], 4);
    });
  });

  describe('resizeColumnsForNewColumn', function() {
	  
    it('should size the cells appropriately for a new column with a block cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(8, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
      var newColumn = scaffold.createColumn(12, [scaffold.createBlockCell({"id": 3})]);
        
      //Act
      cell.resizeColumnsForNewColumn(newColumn, 1);

      //Assert
      assert.strictEqual(columnA.getWidth(), 4);
      assert.strictEqual(columnB.getWidth(), 4);
      assert.strictEqual(newColumn.getWidth(), 4);
    });

    it('should size the cells appropriately for a new empty column', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(8, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
      var newColumn = scaffold.createColumn(12, []);
        
      //Act
      cell.resizeColumnsForNewColumn(newColumn, 1);

      //Assert
      assert.strictEqual(columnA.getWidth(), 4);
      assert.strictEqual(columnB.getWidth(), 4);
      assert.strictEqual(newColumn.getWidth(), 4);
    });

    it('should throw an error when it\'s not possible to resize', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
      var newColumn = scaffold.createColumn(12, [scaffold.createBlockCell({"id": 3})]);

      //Assert
      assert.throws(function() {
        //Act
        cell.resizeColumnsForNewColumn(newColumn, 1);
      }, /The columns cannot be resized to make space for the additional column/);
    });
  });

  describe('setWidth', function() {
	  
    it('should increase the width in the appropriate column', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      cell.setWidth(12);

      //Assert
      assert.strictEqual(columnA.getWidth(), 6);
      assert.strictEqual(columnB.getWidth(), 6);
    });
    
    it('should decrease the width in the appropriate column', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(8, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      cell.setWidth(8);

      //Assert
      assert.strictEqual(columnA.getWidth(), 4);
      assert.strictEqual(columnB.getWidth(), 4);
    });
    
    it('should decrease the width in the appropriate column - 2', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(8, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
        
      //Act
      cell.setWidth(8);

      //Assert
      assert.strictEqual(columnA.getWidth(), 4);
      assert.strictEqual(columnB.getWidth(), 4);
    });

    it('should throw an error when it\'s not possible to resize', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnA = scaffold.createColumn(4, [scaffold.createBlockCell({"id": 1})]);
      var columnB = scaffold.createColumn(8, [scaffold.createBlockCell({"id": 2})]);
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);

      //Assert
      assert.throws(function() {
        //Act
        cell.setWidth(4);
      }, /Invalid width for a column group with three columns: 4/);
    });
  });

});
