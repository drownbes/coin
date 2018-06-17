import { commitMutation, graphql } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import { uniqID, isFiltered } from "../utils";

const mutation = graphql`
  mutation CreateUserMutation($input: UpdateOrCreateUserInput!) {
    updateOrCreateUser(input: $input) {
      edge {
        node {
          name
          email
          active
          id
        }
        cursor
      }
    }
  }
`;

function sharedUpdater(proxyStore, parentID, userEdge) {
  const viewerProxy = proxyStore.get(parentID);
  const connection = ConnectionHandler.getConnection(
    viewerProxy,
    "UserList_allUsers"
  );
  if (connection) {
    ConnectionHandler.insertEdgeAfter(connection, userEdge);
  }
}

export default function commit(environment, parentID, newUser, filter) {
  const mutationID = uniqID(),
    dummyID = "optimistic_create_" + mutationID;
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        create: newUser,
        update: {
          id: ""
        },
        clientMutationId: mutationID
      }
    },
    optimisticUpdater: proxyStore => {
      if (isFiltered(filter, newUser)) {
        return;
      }
      const user = proxyStore.create(dummyID, "User");
      user.setValue(dummyID, "id");
      Object.entries(newUser).forEach(([key, value]) => {
        user.setValue(value, key);
      });
      const userEdge = proxyStore.create(
        `client:${parentID}:__UserList_allUsers_connection:edges:${mutationID}`,
        "UserEdge"
      );
      userEdge.setLinkedRecord(user, "node");
      userEdge.setValue(dummyID, "cursor");
      sharedUpdater(proxyStore, parentID, userEdge);
    },

    updater: proxyStore => {
      if (isFiltered(filter, newUser)) {
        return;
      }
      const updateOrCreateUser = proxyStore.getRootField("updateOrCreateUser");
      if(updateOrCreateUser) {
        const userEdge = updateOrCreateUser.getLinkedRecord("edge");
        sharedUpdater(proxyStore, parentID, userEdge);
      }
    }
  });
}
