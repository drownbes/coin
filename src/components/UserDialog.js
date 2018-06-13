import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default class UserDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: props.active || false,
      name: props.name || "",
      email: props.email || ""
    };
  }

  onSave = () => {
    this.props.onSave(this.state);
    this.resetState();
  };

  onCancel = () => {
    this.props.onCancel();
    this.resetState();
  };

  resetState = () => {
    this.setState({
      active: false,
      name: "",
      email: ""
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSwitchChange = e => {
    this.setState({ [e.target.name]: e.target.checked });
  };

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.handleCancel}>
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.active}
                  onChange={this.onSwitchChange}
                  name="active"
                />
              }
              label="Active"
            />
          </FormGroup>
          <TextField
            margin="dense"
            id="name"
            name="name"
            label="User name"
            type="text"
            fullWidth
            value={this.state.name}
            onChange={this.onChange}
          />
          <TextField
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            value={this.state.email}
            onChange={this.onChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
