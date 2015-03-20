/* @flow */

var React = require('react/lib/React'),
  Modal = require('react-bootstrap/lib/Modal'),
  Button = require('react-bootstrap/lib/Button'),
  Input = require('react-bootstrap/lib/Input');

/*public*/ class TreePrompt extends React.Component {

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
    this.state = {isModalOpen: true, value: props.value};
  }
  
  /**
   * Closes the dialog
   */
  cancel() {
    this.setState({isModalOpen: false, value: ''});
  }
  
  /**
   * Confirms the action and closes the dialog
   */
  confirm() {
    if (this.isValid()) {
      this.props.onConfirm(this.state.value);
      this.cancel();
    }
  }
  
  /**
   * Makes the dialog visible and pre-fills the text input on each render operation
   */
  componentWillReceiveProps(props: Object) {
    this.setState({isModalOpen: true, value: props.value});
  }
  
  /**
   * Checks the validity of a dialog
   */
  isValid(): boolean {
    return !!this.state.value.length;
  }
  
  /**
   * Stores the entered value
   */
  handleChange() {
    this.setState({value: this.refs.input.getValue()});
  }

  render(): any {
    return (
      this.state.isModalOpen ?
        <Modal title={this.props.header} onRequestHide={this.cancel.bind(this)}>
          <div className="modal-body">
            <Input
              type="text"
              value={this.state.value}
              bsStyle={this.isValid() ? 'success' : 'error'}
              ref="input"
              onChange={this.handleChange.bind(this)} />
          </div>
          <div className="modal-footer">
            <Button onClick={this.cancel.bind(this)}>Cancel</Button>
            <Button bsStyle="primary" onClick={this.confirm.bind(this)}>OK</Button>
          </div>
        </Modal>
      : null
    );
  }

}

TreePrompt.propTypes = {
  header: React.PropTypes.string,
  onConfirm: React.PropTypes.func,
  value: React.PropTypes.string
};
TreePrompt.defaultProps = {
  header: '',
  onConfirm: Function.prototype,
  value: ''
};

module.exports = TreePrompt;