import { commitMutation, graphql } from "react-relay";
import { uniqID } from "../utils";

const mutation = graphql`
  mutation DeleteUserMutation($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      deletedId
    }
  }
`;

export default function commit(environment, parentID, id) {
  const mutationID = uniqID();
  return commitMutation(environment, {
    mutation,
    optimisticResponse: {
      deleteUser: {
        deletedId: id
      }
    },
    variables: {
      input: {
        id,
        clientMutationId: mutationID
      }
    },
    configs: [
      {
        type: "RANGE_DELETE",
        parentID,
        connectionKeys: [
          {
            key: "UserList_allUsers"
          }
        ],
        pathToConnection: ["viewer", "allUsers"],
        deletedIDFieldName: "deletedId"
      },
      {
        type: "NODE_DELETE",
        deletedIDFieldName: "deletedId"
      }
    ]
  });
}
