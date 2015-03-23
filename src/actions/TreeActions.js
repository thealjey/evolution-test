/* @flow */

var AppDispatcher = require('../dispatcher/AppDispatcher'),
  TreeConstants = require('../constants/TreeConstants');

module.exports = {

  /**
   * Selects a tree node by id.
   *
   * @param id - The node id.
   */
  select(id: number) {
    AppDispatcher.dispatch({actionType: TreeConstants.TREE_SELECT, id});
  },

  /**
   * Creates a directory or a file with a particular name.
   *
   * @param name - The name of a new node.
   * @param isDir - Creates a folder if isDir is true, a file otherwise.
   */
  create(name: string, isDir: boolean) {
    AppDispatcher.dispatch({actionType: TreeConstants.TREE_CREATE, name, isDir});
  },

  /**
   * Renames a tree node.
   *
   * @param name - The new name.
   */
  rename(name: string) {
    AppDispatcher.dispatch({actionType: TreeConstants.TREE_RENAME, name});
  },

  /**
   * Removes a tree node.
   */
  remove() {
    AppDispatcher.dispatch({actionType: TreeConstants.TREE_REMOVE});
  },

  /**
   * Marks a node with a given id as a drop target.
   *
   * @param id - The node id.
   */
  target(id: number) {
    AppDispatcher.dispatch({actionType: TreeConstants.TREE_TARGET, id});
  },

  /**
   * Moves the selected node into the drop target.
   */
  move() {
    AppDispatcher.dispatch({actionType: TreeConstants.TREE_MOVE});
  },

  /**
   * Writes a text content into the selected file.
   */
  write(content: string) {
    AppDispatcher.dispatch({actionType: TreeConstants.TREE_WRITE, content});
  }

};
