import { commitMutation, graphql } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import { uniqID, isFiltered } from "../utils";

const mutation = graphql`
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        name
        email
        active
      }
    }
  }
`;

function sharedUpdater(proxyStore, parentID, userID) {
  const viewerProxy = proxyStore.get(parentID);
  const connection = ConnectionHandler.getConnection(
    viewerProxy,
    "UserList_allUsers"
  );
  if (connection) {
    ConnectionHandler.deleteNode(connection, userID);
  }
}

export default function commit(environment, parentID, updatedUser, filter) {
  const mutationID = uniqID();
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        ...updatedUser,
        clientMutationId: mutationID
      }
    },
    optimisticUpdater(proxyStore) {
      if (isFiltered(filter, updatedUser)) {
        sharedUpdater(proxyStore, parentID, updatedUser.id);
      } else {
        const user = proxyStore.get(updatedUser.id);
        Object.keys(updatedUser).forEach(([key, value]) => {
          user.setValue(value, key);
        });
      }
    },
    updater(proxyStore) {
      if (isFiltered(filter, updatedUser)) {
        sharedUpdater(proxyStore, parentID, updatedUser.id);
      }
    }
  });
}
