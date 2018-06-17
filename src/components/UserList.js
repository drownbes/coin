import React, { Component } from "react";
import { createPaginationContainer, graphql } from "react-relay";
import List from "@material-ui/core/List";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import User from "../components/User";
import UserDialog from "./UserDialog";
import CreateUserMutation from "../mutations/CreateUser";
import { filterStrToObject } from "../utils";
import CircularProgress from "@material-ui/core/CircularProgress";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createDialogOpenned: false,
      filter: "",
      loading: false
    };
  }

  openCreateDialog = () => {
    this.setState({
      createDialogOpenned: true
    });
  };

  closeCreateDialog = () => {
    this.setState({
      createDialogOpenned: false
    });
  };

  setFilter = e => {
    this.setState({
      filter: e.target.value,
      loading: true
    });
    this.props.relay.refetchConnection(
      10,
      error => {
        this.setState({
          loading: false
        });
      },
      {
        filter: filterStrToObject(e.target.value)
      }
    );
  };

  handleCreate = newUser => {
    const { viewer, relay } = this.props;
    CreateUserMutation(
      relay.environment,
      viewer.id,
      newUser,
      this.state.filter
    );
    this.closeCreateDialog();
  };

  loadMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }
    this.setState({
      loading: true
    });
    this.props.relay.loadMore(10, error => {
      this.setState({
        loading: false
      });
    });
  };

  renderUser = edge => {
    return (
      <User
        viewer={this.props.viewer}
        user={edge.node}
        key={edge.cursor}
        filter={this.state.filter}
      />
    );
  };

  render() {
    const hasMore = this.props.relay.hasMore();
    const throbberStyle = {
      position: "absolute",
      top: "calc(50% - 50px)",
      left: "calc(50% - 50px) "
    };
    return (
      <div style={{ position: "relative" }}>
        <AppBar position="sticky" color="default">
          <Toolbar>
            {hasMore && <Button onClick={this.loadMore}>Load more</Button>}
            <Button onClick={this.openCreateDialog}>Create user</Button>
            <FormControl style={{ alignSelf: "baseline", width: 200 }}>
              <InputLabel>Filter</InputLabel>
              <Select value={this.state.filter} onChange={this.setFilter}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="show_active">Show active</MenuItem>
                <MenuItem value="show_inactive">Show inactive</MenuItem>
              </Select>
            </FormControl>
          </Toolbar>
        </AppBar>
        {this.state.loading && (
          <CircularProgress style={throbberStyle} size={100} />
        )}
        <List>{this.props.viewer.allUsers.edges.map(this.renderUser)}</List>
        <UserDialog
          title="Create user"
          open={this.state.createDialogOpenned}
          onSave={this.handleCreate}
          onCancel={this.closeCreateDialog}
        />
      </div>
    );
  }
}

export default createPaginationContainer(
  UserList,
  {
    viewer: graphql`
      fragment UserList_viewer on Viewer
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String" }
          filter: { type: "UserFilter" }
        ) {
        allUsers(first: $count, after: $cursor, filter: $filter)
          @connection(key: "UserList_allUsers", filters: ["active"]) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              ...User_user
            }
          }
        }
        id
      }
    `
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.allUsers;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        filter: fragmentVariables.filter
      };
    },
    query: graphql`
      query UserListPaginationQuery(
        $count: Int!
        $cursor: String
        $filter: UserFilter
      ) {
        viewer {
          ...UserList_viewer
            @arguments(count: $count, cursor: $cursor, filter: $filter)
        }
      }
    `
  }
);
