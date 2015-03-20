/* @flow */

var React = require('react/lib/React'),
  Panel = require('react-bootstrap/lib/Panel'),
  Button = require('react-bootstrap/lib/Button'),
  Input = require('react-bootstrap/lib/Input'),
  Glyphicon = require('react-bootstrap/lib/Glyphicon'),
  ModalTrigger = require('react-bootstrap/lib/ModalTrigger'),
  TreeStore = require('../stores/TreeStore'),
  TreeActions = require('../actions/TreeActions'),
  Tree = require('./Tree.react'),
  TreePrompt = require('./TreePrompt.react'),
  TreeConfirm = require('./TreeConfirm.react');

/*public*/ class TreeApp extends React.Component {

  /**
   * Holds the component state
   */
  state: Object;

  /**
   * Defines the valid property types for this component
   */
  static propTypes: Object;

  /**
   * Defines the default property values for this component
   */
  static defaultProps: Object;

  constructor(props: Object) {
    super(props);
    this.state = TreeStore.getAll();
    this._onChange = () => {
      this.setState(TreeStore.getAll());
    };
  }
  
  /**
   * Performance hook
   */
  shouldComponentUpdate(props: Object, state: Object): boolean {
    return state.data !== this.state.data || state.selected !== this.state.selected ||
      state.target !== this.state.target;
  }
  
  /**
   * Creates placeholders for the dialogs and registers an event listener in the Store
   */
  componentDidMount() {
    this.promptEl = document.createElement('div');
    this.confirmEl = document.createElement('div');
    this.promptEl.id = 'treeprompt';
    this.confirmEl.id = 'treeconfirm';
    document.body.appendChild(this.promptEl);
    document.body.appendChild(this.confirmEl);
    TreeStore.addChangeListener(this._onChange);
  }

  /**
   * Performs cleanup on component tear-down
   */
  componentWillUnmount() {
    document.body.removeChild(this.promptEl);
    document.body.removeChild(this.confirmEl);
    TreeStore.removeChangeListener(this._onChange);
  }
  
  /**
   * Creates a Tree Node
   */
  _doCreate(isDir: boolean, name: string) {
    TreeActions.create(isDir, name);
  }
  
  /**
   * Renames a Tree Node
   */
  _doRename(name: string) {
    TreeActions.rename(name);
  }
  
  /**
   * Removes a Tree Node
   */
  _doRemove() {
    TreeActions.remove();
  }
  
  /**
   * Prompts for a name of a Tree Node to create
   */
  create(type: string, isDir: boolean) {
    if (TreeStore.isAllowedCreate()) {
      React.render(
        <TreePrompt header={`Enter a new ${type} name`} onConfirm={this._doCreate.bind(this, isDir)} />,
        this.promptEl
      );
    }
  }
  
  /**
   * Prompts for a new name for a Tree Node
   */
  rename() {
    if (TreeStore.isAllowedEdit()) {
      React.render(
        <TreePrompt header="Enter a new name" value={TreeStore.getSelectedName()}
          onConfirm={this._doRename.bind(this)} />,
        this.promptEl
      );
    }
  }
  
  /**
   * Asks confirmation before removing a Tree Node
   */
  remove() {
    if (TreeStore.isAllowedEdit()) {
      React.render(
        <TreeConfirm onConfirm={this._doRemove.bind(this)} />,
        this.confirmEl
      );
    }
  }
  
  /**
   * Writes into the selected file
   */
  write() {
    TreeActions.write(this.refs.input.getValue());
  }

  render(): any {
    var create = TreeStore.isAllowedCreate(), edit = TreeStore.isAllowedEdit();
    return (
      <div className="al-tree-panel">
        <Panel bsStyle="primary" header={this.props.header} footer={[
          <Button key="dir" bsStyle="success" disabled={!create} onClick={this.create.bind(this, 'directory', true)}>
            <Glyphicon glyph="plus" /> Create Folder
          </Button>,
          <Button key="file" bsStyle="success" disabled={!create} onClick={this.create.bind(this, 'file', false)}>
            <Glyphicon glyph="plus" /> Create File
          </Button>,
          <Button key="rename" bsStyle="warning" disabled={!edit} onClick={this.rename.bind(this)}>
            <Glyphicon glyph="pencil" /> Rename
          </Button>,
          <Button key="remove" bsStyle="danger" disabled={!edit} onClick={this.remove.bind(this)}>
            <Glyphicon glyph="remove" /> Delete
          </Button>
        ]}>
          <Tree {...this.state} />
        </Panel>
        <Input ref="input" type="textarea" className={TreeStore.isAllowedWrite() ? 'show' : 'hidden'}
          value={TreeStore.getSelectedContent()} onChange={this.write.bind(this)} />
      </div>
    );
  }

}

TreeApp.propTypes = {header: React.PropTypes.string};
TreeApp.defaultProps = {header: ''};

module.exports = TreeApp;