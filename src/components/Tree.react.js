/* @flow */

var React = require('react/lib/React'),
  SyntheticMouseEvent = require('react/lib/SyntheticMouseEvent'),
  SyntheticDragEvent = require('react/lib/SyntheticDragEvent'),
  ReactElement = require('react/lib/ReactElement'),
  Glyphicon = require('react-bootstrap/lib/Glyphicon'),
  TreeActions = require('../actions/TreeActions'),
  TreeStore = require('../stores/TreeStore');

/*private*/ class Node extends React.Component {

  /**
   * Holds the component state.
   */
  state: Object;

  /**
   * Defines the valid property types for this component.
   */
  static propTypes: Object;

  /**
   * Defines the default property values for this component.
   */
  static defaultProps: Object;

  constructor(props: Object) {
    super(props);
    this.state = {expanded: false};
  }
  
  /**
   * Performance hook.
   */
  shouldComponentUpdate(props: Object, state: Object): boolean {
    return props.selected !== this.props.selected || props.target !== this.props.target ||
      props.node !== this.props.node || state.expanded !== this.state.expanded;
  }

  /**
   * Toggles the expanded/collapsed state of a node sub-tree.
   */
  toggle() {
    this.setState({expanded: !this.state.expanded});
  }
  
  /**
   * Selects a node.
   *
   * @param e - An event object.
   */
  select(e: SyntheticMouseEvent) {
    e.stopPropagation();
    if (!/^glyphicon/.test(e.target.className)) TreeActions.select(this.props.node.get('id'));
  }
  
  /**
   * Sets a drop target.
   *
   * @param e - An event object.
   */
  onDragEnter(e: SyntheticDragEvent) {
    e.stopPropagation();
    var id = this.props.node.get('id');
    TreeActions.target(TreeStore.isAllowedDrop(id) ? id : -1);
  }
  
  /**
   * Resets a drop target and moves a node to a new position in the tree if needed.
   *
   * @param e - An event object.
   */
  onDragEnd(e: SyntheticDragEvent) {
    e.stopPropagation();
    if (TreeStore.isAllowedDrop(this.props.target)) TreeActions.move();
    TreeActions.target(-1);
  }

  render(): ReactElement {
    var id = this.props.node.get('id'), children = this.props.node.get('children');
    return (
      <li draggable onDragEnd={this.onDragEnd.bind(this)} onMouseDown={this.select.bind(this)}>
        <Glyphicon
            glyph={this.props.node.get('isDir') ? 'folder-' + (this.state.expanded ? 'open' : 'close') : 'file'}
            onClick={this.toggle.bind(this)} />
        {this.props.node.get('name')}
        <div
          onDragEnter={this.onDragEnter.bind(this)}
          className={'selector' + (id === this.props.selected ? ' selected' : '') +
            (id === this.props.target ? ' target' : '')} />
        {children && children.size ?
          <Tree
            className={this.state.expanded ? 'show' : 'hidden'}
            data={children}
            selected={this.props.selected}
            target={this.props.target} />
        : null}
      </li>
    );
  }

}

Node.propTypes = {selected: React.PropTypes.number, target: React.PropTypes.number};
Node.defaultProps = {selected: -1, target: -1};

/*public*/ class Tree extends React.Component {

  /**
   * Defines the valid property types for this component.
   */
  static propTypes: Object;

  /**
   * Defines the default property values for this component.
   */
  static defaultProps: Object;
  
  /**
   * Performance hook.
   */
  shouldComponentUpdate(props: Object): boolean {
    return props.data !== this.props.data || props.selected !== this.props.selected ||
      props.target !== this.props.target || props.className !== this.props.className;
  }

  render(): ReactElement {
    return (
      <ul className={`al-tree ${this.props.className}`}>
        {this.props.data.map((node) => {
          return (
            <Node key={node.get('id')} selected={this.props.selected} target={this.props.target} node={node} />
          );
        })}
      </ul>
    );
  }

}

Tree.propTypes = {className: React.PropTypes.string, selected: React.PropTypes.number, target: React.PropTypes.number};
Tree.defaultProps = {className: '', selected: -1, target: -1};

module.exports = Tree;