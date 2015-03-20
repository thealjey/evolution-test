/* @flow */

var React = require('react/lib/React'),
  Modal = require('react-bootstrap/lib/Modal'),
  Button = require('react-bootstrap/lib/Button');

/*public*/ class TreeConfirm extends React.Component {

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
    this.state = {isModalOpen: true};
  }
  
  /**
   * Closes the dialog
   */
  cancel() {
    this.setState({isModalOpen: false});
  }
  
  /**
   * Confirms the action and closes the dialog
   */
  confirm() {
    this.props.onConfirm();
    this.cancel();
  }
  
  /**
   * Makes the dialog visible on each render operation
   */
  componentWillReceiveProps() {
    this.setState({isModalOpen: true});
  }

  render(): any {
    return (
      this.state.isModalOpen ?
        <Modal title="Confirm" onRequestHide={this.cancel.bind(this)}>
          <div className="modal-body">
            Are you sure?
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

TreeConfirm.propTypes = {onConfirm: React.PropTypes.func};
TreeConfirm.defaultProps = {onConfirm: Function.prototype};

module.exports = TreeConfirm;