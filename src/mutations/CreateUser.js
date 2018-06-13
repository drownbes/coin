import { commitMutation, graphql } from "react-relay";
import { uniqID } from "../utils";

const mutation = graphql`
  mutation CreateUserMutation($input: UpdateOrCreateUserInput!) {
    updateOrCreateUser(input: $input) {
      edge {
        node {
          name
          email
          active
        }
        cursor
      }
    }
  }
`;

export default function commit(environment, parentID, newUser) {
  const mutationID = uniqID(),
    dummyID = "optimistic_create_" + mutationID;
  return commitMutation(environment, {
    mutation,
    optimisticResponse: {
      updateOrCreateUser: {
        edge: {
          node: {
            ...newUser,
            id: dummyID
          },
          cursor: dummyID
        }
      }
    },
    variables: {
      input: {
        create: newUser,
        update: {
          id: ""
        },
        clientMutationId: mutationID
      }
    },
    configs: [
      {
        type: "RANGE_ADD",
        parentID,
        connectionInfo: [
          {
            key: "UserList_allUsers",
            rangeBehavior: "append"
          }
        ],
        edgeName: "edge"
      }
    ]
  });
}
