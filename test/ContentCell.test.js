var assert = require("assert");
var Scaffold = require('../lib/Scaffold.js');
var ContentCell = require('../lib/ContentCell.js');
var ColumnGroupCell = require('../lib/ColumnGroupCell.js');
var Column = require('../lib/Column.js');


describe('ContentCell', function() {

  describe('delete', function() {
	  
    it('should delete the cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnACells = [
        scaffold.createContentCell({"id": 1}),
        scaffold.createContentCell({"id": 2})
      ];
      var columnA = scaffold.createColumn(6, columnACells);
      var columnBCells = [
        scaffold.createContentCell({"id": 3}),
        scaffold.createContentCell({"id": 4})
      ];
      var columnB = scaffold.createColumn(6, columnBCells);
      
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
      
      
      //Pre-Assert
      assert(scaffold.getCellById(cell.getId()));
      assert(scaffold.getColumnById(columnA.getId()));
      assert(scaffold.getColumnById(columnB.getId()));
      assert(scaffold.getCellByContentId(1));
      assert(scaffold.getCellByContentId(2));
      assert(scaffold.getCellByContentId(3));
      assert(scaffold.getCellByContentId(4));

      
      //Act
      columnACells[0].delete();
     
      //Assert
      assert(scaffold.getCellById(cell.getId()));
      assert(scaffold.getColumnById(columnA.getId()));
      assert(scaffold.getColumnById(columnB.getId()));
      assert(!scaffold.getCellByContentId(1));
      assert(scaffold.getCellByContentId(2));
      assert(scaffold.getCellByContentId(3));
      assert(scaffold.getCellByContentId(4));
      //Make sure that the cell was removed from it's parent
      var childCells = columnA.getChildCells();
      assert.strictEqual(childCells.length, 1);
      assert(childCells[0]);
      assert.strictEqual(childCells[0].getChildContent().id, 2);
    });
    
    it('should delete the cell and the grandparent column group cell when it has no more grandchildren', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var columnACells = [
        scaffold.createContentCell({"id": 1})];
      var columnA = scaffold.createColumn(6, columnACells);
      var columnBCells = [];
      var columnB = scaffold.createColumn(6, columnBCells);
      
      var cell = scaffold.createColumnGroupCell([columnA, columnB]);
      
      
      //Pre-Assert
      assert(scaffold.getCellById(cell.getId()));
      assert(scaffold.getColumnById(columnA.getId()));
      assert(scaffold.getColumnById(columnB.getId()));
      assert(scaffold.getCellByContentId(1));
      
      //Act
      columnACells[0].delete();
     
      //Assert
      assert(!scaffold.getCellById(cell.getId()));
      assert(!scaffold.getColumnById(columnA.getId()));
      assert(!scaffold.getColumnById(columnB.getId()));
      assert(!scaffold.getCellByContentId(1));
    });

  });


  describe('getPossibleFreeSpace', function() {
	  

    it('should return the right sizes', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cell = scaffold.createContentCell({"id": 1});
      var column = scaffold.createColumn(8, [cell]);
        
      //Act
      var possibleFreeSpace = cell.getPossibleFreeSpace();

      //Assert
      assert(possibleFreeSpace);
      assert.strictEqual(possibleFreeSpace.length, 2);
      assert.strictEqual(possibleFreeSpace[0], 2);
      assert.strictEqual(possibleFreeSpace[1], 4);

    });

    it('should return all but the largest size when the cell is the largest size', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cell = scaffold.createContentCell({"id": 1});
      var root = scaffold.getRootColumn();
      root.addChildCell(cell);
            
      //Act
      var possibleFreeSpace = cell.getPossibleFreeSpace();
     
      //Assert
      assert(possibleFreeSpace);
      assert.strictEqual(possibleFreeSpace.length, 3);
      assert.strictEqual(possibleFreeSpace[0], 4);
      assert.strictEqual(possibleFreeSpace[1], 6);
      assert.strictEqual(possibleFreeSpace[2], 8);

    });

    it('should return none when the cell is the smallest possible size', function() {

      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cell = scaffold.createContentCell({"id": 1});
      var column = scaffold.createColumn(4, [cell]);

      //Act
      var possibleFreeSpace = cell.getPossibleFreeSpace();
     
      //Assert
      assert(possibleFreeSpace);
      assert.strictEqual(possibleFreeSpace.length, 0);

    });
  });

  describe('getNextSibling()', function() {

    it('should return the right cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cell1 = scaffold.createContentCell({"id": 1});
      var cell2 = scaffold.createContentCell({"id": 2});
      var cell3 = scaffold.createContentCell({"id": 3});
      var column = scaffold.createColumn(8, [cell1, cell2, cell3]);

      //Act
      var nextCell = cell2.getNextSibling();

      //Assert
      assert(nextCell);
      assert.strictEqual(nextCell, cell3);

    });

    it('should return null if there is no next cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cell1 = scaffold.createContentCell({"id": 1});
      var cell2 = scaffold.createContentCell({"id": 2});
      var cell3 = scaffold.createContentCell({"id": 3});
      var column = scaffold.createColumn(8, [cell1, cell2, cell3]);
        
      //Act
      var nextCell = cell3.getNextSibling();

      //Assert
      assert.strictEqual(nextCell, null);

    });

	});


  describe('getPreviousSibling()', function() {

    it('should return the right cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cell1 = scaffold.createContentCell({"id": 1});
      var cell2 = scaffold.createContentCell({"id": 2});
      var cell3 = scaffold.createContentCell({"id": 3});
      var column = scaffold.createColumn(8, [cell1, cell2, cell3]);

      //Act
      var previousCell = cell2.getPreviousSibling();

      //Assert
      assert(previousCell);
      assert.strictEqual(previousCell, cell1);

    });

    it('should return null if there is no previous cell', function() {
      
      //Arrange
      var scaffold = new Scaffold({ "width": 12, validSizes: [12, 8, 6, 4]});
      var cell1 = scaffold.createContentCell({"id": 1});
      var cell2 = scaffold.createContentCell({"id": 2});
      var cell3 = scaffold.createContentCell({"id": 3});
      var column = scaffold.createColumn(8, [cell1, cell2, cell3]);
        
      //Act
      var previousCell = cell1.getPreviousSibling();

      //Assert
      assert.strictEqual(previousCell, null);

    });

	});
});
