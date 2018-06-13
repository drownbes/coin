import React from "react";
import { graphql, QueryRenderer } from "react-relay";
import environment from "./environment";
import UserList from "./components/UserList";
import Paper from "@material-ui/core/Paper";
import { filterStrToObject } from "./utils";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createDialogOpenned: false,
      filter: ""
    };
  }

  setFilter = filter => {
    this.setState({
      filter
    });
  };

  render() {
    const filter = filterStrToObject(this.state.filter);
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query AppQuery($filter: UserFilter) {
            viewer {
              ...UserList_viewer @arguments(filter: $filter)
              id
            }
          }
        `}
        variables={{
          filter
        }}
        render={({ error, props }) => {
          console.log(error, props);
          if (error) {
            return <div>Error!</div>;
          }
          if (!props) {
            return <div>Loading...</div>;
          }
          return (
            <div style={{ padding: 20, minWidth: 600 }}>
              <Paper>
                <UserList
                  viewer={props.viewer}
                  filter={this.state.filter}
                  setFilter={this.setFilter}
                />
              </Paper>
            </div>
          );
        }}
      />
    );
  }
}
