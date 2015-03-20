/* @flow */

var AppDispatcher = require('../dispatcher/AppDispatcher'),
  TreeConstants = require('../constants/TreeConstants'),
  TreeStoreData = require('./TreeStoreData'),
  {EventEmitter} = require('events'),
  CHANGE_EVENT = 'change', selected = -1, target = -1;

/**
 * Sets a selected item in the tree
 */
function select(id: number) {
  selected = id;
}

/**
 * Sets a drop target in the tree
 */
function setTarget(id: number) {
  target = id;
}

class TreeStore extends EventEmitter {
  
  constructor(...args: Array<any>) {
    super(...args);
    this.data = new TreeStoreData;
  }
  
  /**
   * Saves data to the HTML5 Local Storage
   */
  save() {
    this.data.save();
  }
  
  /**
   * Creates a new node
   */
  create(name: string, isDir: boolean) {
    this.data.create(selected, name, isDir);
    this.save();
  }
  
  /**
   * Renames a node
   */
  rename(name: string) {
    this.data.rename(selected, name);
    this.save();
  }
  
  /**
   * Removes a node
   */
  remove() {
    this.data.remove(selected);
    select(-1);
    this.save();
  }
  
  /**
   * Moves the selected node into the drop target
   */
  move() {
    this.data.move(selected, target);
    this.save();
  }
  
  /**
   * Updates the text content of a node
   */
  write(content: string) {
    this.data.write(selected, content);
    this.save();
  }

  /**
   * Returns the Store data
   */
  getAll(): Object {
    return {data: this.data.data, selected, target};
  }
  
  /**
   * Checks whether the selected node is allowed to have children
   */
  isAllowedCreate(): boolean {
    var node = this.data.get(selected);
    return !!node && node.get('isDir');
  }
  
  /**
   * Checks whether the selected node can be renamed or deleted
   */
  isAllowedEdit(): boolean {
    return 0 < selected;
  }
  
  /**
   * Checks whether the selected node is allowed to have a text content
   */
  isAllowedWrite(): boolean {
    var node = this.data.get(selected);
    return !!node && !node.get('isDir');
  }
  
  /**
   * Checks whether a node with a given id is a legal drop target for the selected node
   */
  isAllowedDrop(id: number): boolean {
    var node = this.data.get(id);
    if (!node) return false;
    var source = this.data.getPath(selected), destination = this.data.getPath(id);
    return (
      // not allowed to drop a node onto itself
      id !== selected &&
      // only folders are valid drop targets
      node.get('isDir') &&
      // not allowed to move into the current item location (direct parent)
      !destination.equals(source.splice(-2)) &&
      // the folder cannot contain itself
      !source.equals(destination.setSize(source.size))
    );
  }
  
  /**
   * Returns the name of the selected node
   */
  getSelectedName(): string {
    var node = this.data.get(selected);
    return node ? node.get('name') : '';
  }
  
  /**
   * Returns the text content of the selected node
   */
  getSelectedContent(): string {
    var node = this.data.get(selected);
    return node ? (node.get('content') || '') : '';
  }
  
  /**
   * Fires a change event notifying all the subscribed components
   */
  emitChange() {
    this.emit(CHANGE_EVENT);
  }
  
  /**
   * Adds a change event listener
   */
  addChangeListener(callback: Function) {
    this.on(CHANGE_EVENT, callback);
  }
  
  /**
   * Removes a change event listener
   */
  removeChangeListener(callback: Function) {
    this.removeListener(CHANGE_EVENT, callback);
  }
  
}

var store = module.exports = new TreeStore;

AppDispatcher.register(function (action: Object) {
  switch (action.actionType) {
    case TreeConstants.TREE_SELECT:
      select(action.id);
      break;
    case TreeConstants.TREE_CREATE:
      store.create(action.name, action.isDir);
      break;
    case TreeConstants.TREE_RENAME:
      store.rename(action.name);
      break;
    case TreeConstants.TREE_REMOVE:
      store.remove();
      break;
    case TreeConstants.TREE_TARGET:
      setTarget(action.id);
      break;
    case TreeConstants.TREE_MOVE:
      store.move();
      break;
    case TreeConstants.TREE_WRITE:
      store.write(action.content);
      break;
  }
  store.emitChange();
});