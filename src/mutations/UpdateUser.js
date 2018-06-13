import { commitMutation, graphql } from "react-relay";
import { uniqID } from "../utils";

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

export default function commit(environment, parentID, updatedUser) {
  const mutationID = uniqID();
  return commitMutation(environment, {
    mutation,
    optimisticResponse: {
      updateUser: {
        user: updatedUser
      }
    },
    variables: {
      input: {
        ...updatedUser,
        clientMutationId: mutationID
      }
    }
  });
}
