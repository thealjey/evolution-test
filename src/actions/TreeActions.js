/* @flow */

var AppDispatcher = require('../dispatcher/AppDispatcher'),
  TreeConstants = require('../constants/TreeConstants');
  
module.exports = {
  
  /**
   * Selects a Tree Node by id
   */
  select(id: number) {
    AppDispatcher.dispatch({
      actionType: TreeConstants.TREE_SELECT,
      id
    });
  },
  
  /**
   * Creates a directory or a file with a particular name
   */
  create(isDir: boolean, name: string) {
    AppDispatcher.dispatch({
      actionType: TreeConstants.TREE_CREATE,
      isDir,
      name
    });
  },
  
  /**
   * Renames a Tree Node
   */
  rename(name: string) {
    AppDispatcher.dispatch({
      actionType: TreeConstants.TREE_RENAME,
      name
    });
  },
  
  /**
   * Removes a Tree Node
   */
  remove() {
    AppDispatcher.dispatch({
      actionType: TreeConstants.TREE_REMOVE
    });
  },
  
  /**
   * Marks a Node with a given id as a drop target
   */
  target(id: number) {
    AppDispatcher.dispatch({
      actionType: TreeConstants.TREE_TARGET,
      id
    });
  },
  
  /**
   * Moves the selected Node into the drop target
   */
  move() {
    AppDispatcher.dispatch({
      actionType: TreeConstants.TREE_MOVE
    });
  },
  
  /**
   * Writes a text content into the selected file
   */
  write(content: string) {
    AppDispatcher.dispatch({
      actionType: TreeConstants.TREE_WRITE,
      content
    });
  }
  
};