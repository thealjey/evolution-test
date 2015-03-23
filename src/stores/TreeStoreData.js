/* @flow */

var Immutable = require('immutable/dist/immutable');

var data = [
  {id: 0, name: '/', isDir: true, children: [
    {id: 1, name: 'bin', isDir: true},
    {id: 2, name: 'boot', isDir: true, children: [
      {id: 58, name: 'defaults', isDir: true}
    ]},
    {id: 3, name: 'dev', isDir: true},
    {id: 4, name: 'etc', isDir: true, children: [
      {id: 18, name: 'defaults', isDir: true},
      {id: 19, name: 'mail', isDir: true},
      {id: 20, name: 'namedb', isDir: true},
      {id: 21, name: 'opt', isDir: true},
      {id: 22, name: 'periodic', isDir: true},
      {id: 23, name: 'ppp', isDir: true},
      {id: 24, name: 'sgml', isDir: true},
      {id: 25, name: 'X11', isDir: true},
      {id: 26, name: 'xml', isDir: true}
    ]},
    {id: 5, name: 'home', isDir: true, children: [
      {id: 27, name: 'al', isDir: true, children: [
        {id: 50, name: 'Applications', isDir: true},
        {id: 51, name: 'Desktop', isDir: true},
        {id: 52, name: 'Documents', isDir: true, children: [
          {id: 59, name: 'readme', isDir: false, content: `Congrats! You've found it!

I am a very dedicated web developer with over 4 years of experience.
I've always been in love with JavaScript, and even more so after the arrival of the super amazing tools from Facebook that this little app enjoys so much the fruits of.

Sincerely, Eugene Kuzmenko

p.s.
Try dragging the tree items around (DnD might not work on IE <9).`}
        ]},
        {id: 53, name: 'Downloads', isDir: true},
        {id: 54, name: 'Movies', isDir: true},
        {id: 55, name: 'Music', isDir: true},
        {id: 56, name: 'Pictures', isDir: true},
        {id: 57, name: 'Public', isDir: true}
      ]}
    ]},
    {id: 6, name: 'lib', isDir: true},
    {id: 7, name: 'media', isDir: true},
    {id: 8, name: 'mnt', isDir: true},
    {id: 9, name: 'opt', isDir: true},
    {id: 10, name: 'proc', isDir: true},
    {id: 11, name: 'rescue', isDir: true},
    {id: 12, name: 'root', isDir: true},
    {id: 13, name: 'sbin', isDir: true},
    {id: 14, name: 'srv', isDir: true},
    {id: 15, name: 'tmp', isDir: true},
    {id: 16, name: 'usr', isDir: true, children: [
      {id: 28, name: 'bin', isDir: true},
      {id: 29, name: 'include', isDir: true},
      {id: 30, name: 'lib', isDir: true},
      {id: 31, name: 'libdata', isDir: true},
      {id: 32, name: 'libexec', isDir: true},
      {id: 33, name: 'local', isDir: true},
      {id: 34, name: 'obj', isDir: true},
      {id: 35, name: 'ports', isDir: true},
      {id: 36, name: 'sbin', isDir: true},
      {id: 37, name: 'share', isDir: true},
      {id: 38, name: 'src', isDir: true},
      {id: 39, name: 'X11R6', isDir: true}
    ]},
    {id: 17, name: 'var', isDir: true, children: [
      {id: 40, name: 'cache', isDir: true},
      {id: 41, name: 'lib', isDir: true},
      {id: 42, name: 'lock', isDir: true},
      {id: 43, name: 'log', isDir: true},
      {id: 44, name: 'mail', isDir: true},
      {id: 45, name: 'opt', isDir: true},
      {id: 46, name: 'run', isDir: true},
      {id: 47, name: 'spool', isDir: true},
      {id: 48, name: 'tmp', isDir: true},
      {id: 49, name: 'yp', isDir: true}
    ]}
  ]}
];

class TreeStoreData {

  /**
   * An immutable tree of data.
   */
  data: Immutable.List;

  /**
   * A reference cache that helps to quickly locate nodes in the tree.
   */
  cache: Object;

  constructor() {
    this.data = Immutable.fromJS(this.load() || data);
    this.cache = {};
  }

  /**
   * Loads data from the HTML5 Local Storage.
   */
  load(): ?Array<Object> {
    var str: ?string = localStorage.getItem('fs');
    return str ? JSON.parse(str) : null;
  }

  /**
   * Saves data to the HTML5 Local Storage.
   */
  save() {
    localStorage.setItem('fs', JSON.stringify(this.data));
  }

  /**
   * Tests if a sub-tree at a given node contains a node with a given id.
   *
   * @param id - The node id.
   * @param node - The root node of a sub-tree to search in.
   */
  contains(id: number, node: Immutable.Map): boolean {
    var children = node.get('children');
    return id === node.get('id') || !!children && !!children.find(child => this.contains(id, child));
  }

  /**
   * Returns a keyPath array of a node with a specific id.
   *
   * @param id - The node id.
   * @param nodes - A collection of nodes to search in.
   * @param [memo]
   */
  keyPath(id: number, nodes: Immutable.List, memo: Array<number|string> = []): Array<number|string> {
    nodes.forEach((node, i) => {
      if (this.contains(id, node)) {
        memo.push(i);
        var children = node.get('children');
        if (id !== node.get('id') && children && !children.isEmpty()) {
          memo.push('children');
          this.keyPath(id, children, memo);
        }
        return false;
      }
    });
    return memo;
  }

  /**
   * Updates the reference cache for a sub-tree at a given node.
   *
   * @param path - A reference path to the node parent.
   * @param node - The node itself.
   * @param i - Index position of the node in the parent "children" List.
   */
  pruneCache(path: Immutable.List, node: Immutable.Map, i: number) {
    var children = node.get('children');
    path = this.cache[node.get('id')] = path.push('children', i);
    if (children && !children.isEmpty()) {
      children.forEach((child, i) => {
        this.pruneCache(path, child, i);
      });
    }
  }

  /**
   * Calculates a reference path for a specific node id.
   *
   * @param id - The node id.
   */
  find(id: number): Immutable.List {
    var path = this.cache[id] = Immutable.List.of(...this.keyPath(id, this.data));
    return path;
  }

  /**
   * Returns a reference path for a specific node id, utilizing the reference cache whenever possible.
   *
   * @param id - The node id.
   */
  getPath(id: number): Immutable.List {
    return this.cache[id] || this.find(id);
  }

  /**
   * Returns a node by id.
   *
   * @param id - The node id.
   */
  get(id: number): ?Immutable.Map {
    var path = this.getPath(id);
    return !path.isEmpty() && this.data.getIn(path);
  }

  /**
   * Updates a node by id.
   *
   * @param id - The node id.
   */
  set(id: number, node: Immutable.Map) {
    this.data = this.data.setIn(this.getPath(id), node);
    this.save();
  }

  /**
   * Inserts a node into the children of a node with a given id.
   *
   * @param id - The id of a node into the children List of which to insert.
   * @param node - The node to instert.
   */
  insert(id: number, node: Immutable.Map) {
    var destination = this.get(id), children;
    if (destination) {
      children = destination.get('children');
      this.set(id, destination.set('children', children = children ? children.push(node) : Immutable.List.of(node)));
      this.pruneCache(this.getPath(id), node, children.indexOf(node));
    }
  }

  /**
   * Renames a node by id.
   *
   * @param id - The node id.
   * @param name - The new name.
   */
  rename(id: number, name: string) {
    var node = this.get(id);
    if (node) {
      this.set(id, node.set('name', name));
    }
  }

  /**
   * Creates a new node.
   *
   * @param id - The id of a node into the children List of which to insert.
   * @param name - The name of a new node.
   * @param isDir - Creates a folder if isDir is true, a file otherwise.
   */
  create(id: number, name: string, isDir: boolean) {
    this.insert(id, Immutable.Map({id: Date.now(), name, isDir}));
  }

  /**
   * Removes a node by id.
   *
   * @param id - The node id.
   */
  remove(id: number) {
    var path = this.getPath(id), parent = this.data.getIn(path.splice(-2));
    this.set(parent.get('id'), parent.set('children', parent.get('children').splice(path.last(), 1)));
  }

  /**
   * Moves a node to a new location in the tree.
   *
   * @param sourceId - The node id.
   * @param destinationId - The id of a node into the children List of which to insert.
   */
  move(sourceId: number, destinationId: number) {
    var source = this.get(sourceId);
    if (source) {
      this.remove(sourceId);
      this.insert(destinationId, source);
    }
  }

  /**
   * Updates the text content of a node.
   *
   * @param id - The node id.
   * @param content - The content.
   */
  write(id: number, content: string) {
    var node = this.get(id);
    if (node) {
      this.set(id, node.set('content', content));
    }
  }

}

module.exports = TreeStoreData;
