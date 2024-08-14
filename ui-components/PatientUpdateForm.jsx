/* eslint-disable */
"use client";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import * as React from "react";
import { getPatient, updatePatient } from "./graphql/queries";
import { fetchByPath, getOverrideProps, validateField } from "./utils";

const client = generateClient();

export default function PatientUpdateForm(props) {
  const {
    id: idProp,
    patient: patientModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;

  const initialValues = {
    invoice_no: "",
    receive_date: "",
    reporting_date: "",
    patient_name: "",
    patient_age: "",
    patient_sex: "",
    consultant: "",
    investigation: "",
    clinical_information: "",
    aspiration_note: "",
    conclusion: "",
  };

  const [formValues, setFormValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = patientRecord ? { ...initialValues, ...patientRecord } : initialValues;
    setFormValues(cleanValues);
    setErrors({});
  };

  const [patientRecord, setPatientRecord] = React.useState(patientModelProp);

  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getPatient.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getPatient
        : patientModelProp;
      setPatientRecord(record);
    };
    queryData();
  }, [idProp, patientModelProp]);

  React.useEffect(resetStateValues, [patientRecord]);

  const validations = {
    invoice_no: [],
    receive_date: [],
    reporting_date: [],
    patient_name: [],
    patient_age: [],
    patient_sex: [],
    consultant: [],
    investigation: [],
    clinical_information: [],
    aspiration_note: [],
    conclusion: [],
  };

  const runValidationTasks = async (fieldName, currentValue, getDisplayValue) => {
    const value = currentValue && getDisplayValue ? getDisplayValue(currentValue) : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };

  const handleInputChange = (fieldName, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    if (errors[fieldName]?.hasError) {
      runValidationTasks(fieldName, value);
    }
  };

  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = { ...formValues };

        const validationResponses = await Promise.all(
          Object.keys(validations).map((fieldName) =>
            runValidationTasks(fieldName, modelFields[fieldName])
          )
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }

        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }

        try {
          await client.graphql({
            query: updatePatient.replaceAll("__typename", ""),
            variables: {
              input: {
                id: patientRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "PatientUpdateForm")}
      {...rest}
    >
      {Object.keys(initialValues).map((key) => (
        <TextField
          key={key}
          label={key.replace(/_/g, " ")}
          isRequired={false}
          isReadOnly={false}
          value={formValues[key]}
          onChange={(e) => handleInputChange(key, e.target.value)}
          onBlur={() => runValidationTasks(key, formValues[key])}
          errorMessage={errors[key]?.errorMessage}
          hasError={errors[key]?.hasError}
          {...getOverrideProps(overrides, key)}
        />
      ))}
      <Flex justifyContent="space-between" {...getOverrideProps(overrides, "CTAFlex")}>
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || patientModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        />
        <Flex gap="15px" {...getOverrideProps(overrides, "RightAlignCTASubFlex")}>
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || patientModelProp) || Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          />
        </Flex>
      </Flex>
    </Grid>
  );
}
