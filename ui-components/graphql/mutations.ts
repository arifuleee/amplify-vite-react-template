/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPatient = /* GraphQL */ `
  mutation CreatePatient(
    $condition: ModelPatientConditionInput
    $input: CreatePatientInput!
  ) {
    createPatient(condition: $condition, input: $input) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
export const deletePatient = /* GraphQL */ `
  mutation DeletePatient(
    $condition: ModelPatientConditionInput
    $input: DeletePatientInput!
  ) {
    deletePatient(condition: $condition, input: $input) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
export const updatePatient = /* GraphQL */ `
  mutation UpdatePatient(
    $condition: ModelPatientConditionInput
    $input: UpdatePatientInput!
  ) {
    updatePatient(condition: $condition, input: $input) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
