/* @flow */

var React = require('react/lib/React'),
  ReactElement = require('react/lib/ReactElement'),
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

class TreeApp extends React.Component {

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
    this.state = TreeStore.getAll();
    this.onChange = () => {
      this.setState(TreeStore.getAll());
    };
  }

  /**
   * Performance hook.
   */
  shouldComponentUpdate(props: Object, state: Object): boolean {
    return state.data !== this.state.data || state.selected !== this.state.selected ||
      state.target !== this.state.target;
  }

  /**
   * Creates placeholders for the dialogs and registers an event listener in the store.
   */
  componentDidMount() {
    this.promptEl = document.createElement('div');
    this.confirmEl = document.createElement('div');
    this.promptEl.id = 'treeprompt';
    this.confirmEl.id = 'treeconfirm';
    document.body.appendChild(this.promptEl);
    document.body.appendChild(this.confirmEl);
    TreeStore.addChangeListener(this.onChange);
  }

  /**
   * Performs cleanup on component tear-down.
   */
  componentWillUnmount() {
    document.body.removeChild(this.promptEl);
    document.body.removeChild(this.confirmEl);
    TreeStore.removeChangeListener(this.onChange);
  }

  /**
   * Creates a tree node.
   *
   * @param isDir - Creates a folder if isDir is true, a file otherwise.
   * @param name - The name of a new node.
   */
  doCreate(isDir: boolean, name: string) {
    TreeActions.create(name, isDir);
  }

  /**
   * Renames a tree node.
   *
   * @param name - The new name.
   */
  doRename(name: string) {
    TreeActions.rename(name);
  }

  /**
   * Removes a tree node.
   */
  doRemove() {
    TreeActions.remove();
  }

  /**
   * Prompts for a name of a tree node to create.
   *
   * @param type - Item type to show in the dialog.
   * @param isDir - Creates a folder if isDir is true, a file otherwise.
   */
  create(type: string, isDir: boolean) {
    if (TreeStore.isAllowedCreate()) {
      React.render(
        <TreePrompt header={`Enter a new ${type} name`} onConfirm={this.doCreate.bind(this, isDir)} />,
        this.promptEl
      );
    }
  }

  /**
   * Prompts for a new name for a tree node.
   */
  rename() {
    if (TreeStore.isAllowedEdit()) {
      React.render(
        <TreePrompt header="Enter a new name" value={TreeStore.getSelectedName()}
          onConfirm={this.doRename.bind(this)} />,
        this.promptEl
      );
    }
  }

  /**
   * Asks confirmation before removing a tree node.
   */
  remove() {
    if (TreeStore.isAllowedEdit()) {
      React.render(
        <TreeConfirm onConfirm={this.doRemove.bind(this)} />,
        this.confirmEl
      );
    }
  }

  /**
   * Writes into the selected file.
   */
  write() {
    TreeActions.write(this.refs.input.getValue());
  }

  render(): ReactElement {
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
