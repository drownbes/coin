import React from "react";
import { graphql, QueryRenderer } from "react-relay";
import environment from "./environment";
import UserList from "./components/UserList";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createDialogOpenned: false
    };
  }

  render() {
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
        variables={{}}
        render={({ error, props }) => {
          if (error) {
            return <div>Error!{error}</div>;
          }
          if (!props) {
            return <CircularProgress />;
          }
          return (
            <div style={{ padding: 20, minWidth: 600 }}>
              <Paper>
                <UserList viewer={props.viewer} />
              </Paper>
            </div>
          );
        }}
      />
    );
  }
}
