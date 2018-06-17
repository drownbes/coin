import React, { Component } from "react";
import { createFragmentContainer, graphql } from "react-relay";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import CheckIcon from "@material-ui/icons/Check";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import green from "@material-ui/core/colors/green";
import UserDialog from "./UserDialog";
import DeleteUserMutation from "../mutations/DeleteUser";
import UpdateUserMutation from "../mutations/UpdateUser";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false
    };
  }

  openEditDialog = () => {
    this.setState({ edit: true });
  };

  closeEditDialog = () => {
    this.setState({ edit: false });
  };

  handleSave = updatedUser => {
    const { relay, viewer, user, filter } = this.props;
    UpdateUserMutation(
      relay.environment,
      viewer.id,
      {
        ...updatedUser,
        id: user.id
      },
      filter
    );
    this.closeEditDialog();
  };

  handleDelete = () => {
    const { relay, viewer, user } = this.props;
    DeleteUserMutation(relay.environment, viewer.id, user.id);
  };

  render() {
    const { user } = this.props;
    const iconStyle = user.active ? { color: green[500] } : {};
    return (
      <ListItem>
        <ListItemIcon>
          <CheckIcon style={iconStyle} />
        </ListItemIcon>
        <ListItemText primary={user.name} secondary={user.email} />
        <ListItemSecondaryAction>
          <IconButton onClick={this.openEditDialog}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={this.handleDelete}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
        {this.state.edit && (
          <UserDialog
            title="Edit user"
            open={true}
            onSave={this.handleSave}
            onCancel={this.closeEditDialog}
            {...user}
          />
        )}
      </ListItem>
    );
  }
}

export default createFragmentContainer(
  User,
  graphql`
    fragment User_user on User {
      id
      name
      email
      active
    }
  `
);
