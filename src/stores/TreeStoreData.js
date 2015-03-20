/* @flow */

var Immutable = require('immutable/dist/immutable');

/*public*/ class TreeStoreData {

  /**
   * An immutable tree of data
   */
  data: Immutable.List;

  /**
   * A keyPath cache
   */
  cache: Object;
  
  constructor() {
    this.data = Immutable.fromJS(this.load() || [
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
              {id: 59, name: 'readme', isDir: false, content: "Congrats! You've found it!\n\nI am a very dedicated web developer with over 4 years of experience.\nI've always been in love with JavaScript, and even more so after the arrival of the super amazing tools from Facebook that this little app enjoys so much the fruits of.\n\nSincerely, Eugene Kuzmenko\n\np.s.\nTry dragging the tree items around (DnD might not work on IE <9)."}
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
    ]);
    this.cache = {};
  }
  
  /**
   * Loads data from the HTML5 Local Storage
   */
  load(): ?Array<Object> {
    var str: ?string = localStorage.getItem('fs');
    return str && JSON.parse(str);
  }
  
  /**
   * Saves data to the HTML5 Local Storage
   */
  save() {
    localStorage.setItem('fs', JSON.stringify(this.data));
  }
  
  /**
   * Tests if a sub-tree at a given node contains a node with a given id
   */
  contains(id: number, node: Immutable.Map): boolean {
    return id === node.get('id') ||
      !!node.get('children') && !!node.get('children').find(value => this.contains(id, value));
  }
  
  /**
   * Returns a keyPath array of a node with a specific id
   */
  keyPath(id: number, data: Immutable.List, memo: Array<number|string> = []): Array<number|string> {
    data.forEach((node, i) => {
      if (this.contains(id, node)) {
        memo.push(i);
        if (id !== node.get('id') && node.get('children')) {
          memo.push('children');
          this.keyPath(id, node.get('children'), memo);
        }
        return false;
      }
    });
    return memo;
  }
  
  /**
   * Calculates a keyPath array for a specific node id
   */
  find(id: number): Immutable.List {
    var path = this.keyPath(id, this.data);
    return this.cache[id] = Immutable.List.of(...path);
  }
  
  /**
   * Returns a keyPath array for a specific node id from cache whenever possible
   */
  getPath(id: number): Immutable.List {
    return this.cache[id] || this.find(id);
  }
  
  /**
   * Returns a node by id
   */
  get(id: number): ?Immutable.Map {
    var path = this.getPath(id);
    return path.size && this.data.getIn(path);
  }
  
  /**
   * Updates a node by id
   */
  set(id: number, node: Immutable.Map) {
    this.data = this.data.setIn(this.getPath(id), node);
  }
  
  /**
   * Inserts a node into the children of a node with a given id
   */
  insert(id: number, node: Immutable.Map) {
    var destination = this.get(id), children;
    if (destination) {
      children = destination.get('children');
      this.set(id, destination.set('children', children ? children.push(node) : Immutable.List.of(node)));
      this.cache = {};
    }
  }
  
  /**
   * Renames a node by id
   */
  rename(id: number, name: string) {
    var node = this.get(id);
    if (node) this.set(id, node.set('name', name));
  }
  
  /**
   * Creates a new node
   */
  create(id: number, name: string, isDir: boolean) {
    this.insert(id, Immutable.Map({id: Date.now(), name, isDir}));
  }
  
  /**
   * Removes a node by id
   */
  remove(id: number) {
    var path = this.getPath(id), last = path.last();
    path = path.pop();
    this.data = this.data.setIn(path, this.data.getIn(path).splice(last, 1));
  }
  
  /**
   * Moves a node to a new location in the tree
   */
  move(sourceId: number, destinationId: number) {
    var source = this.get(sourceId);
    if (source) {
      this.remove(sourceId);
      this.insert(destinationId, source);
    }
  }
  
  /**
   * Updates the text content of a node
   */
  write(id: number, content: string) {
    var node = this.get(id);
    if (node) this.set(id, node.set('content', content));
  }
  
}

module.exports = TreeStoreData;