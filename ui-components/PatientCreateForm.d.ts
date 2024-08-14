export interface PatientCreateFormProps {
    clearOnSuccess?: boolean;
    onSuccess?: (fields: PatientFormFields) => void;
    onError?: (fields: PatientFormFields, errorMessage: string) => void;
    onSubmit?: (fields: PatientFormFields) => PatientFormFields;
    onValidate?: {
      [key in keyof PatientFormFields]?: (
        value: string,
        validationResponse: ValidationResponse
      ) => ValidationResponse | Promise<ValidationResponse>;
    };
    onChange?: (fields: PatientFormFields) => PatientFormFields;
    overrides?: Record<string, unknown>;
    [rest: string]: unknown;
  }
  
  export interface PatientFormFields {
    invoice_no: string;
    receive_date: string;
    reporting_date: string;
    patient_name: string;
    patient_age: string;
    patient_sex: string;
    consultant: string;
    investigation: string;
    clinical_information: string;
    aspiration_note: string;
    conclusion: string;
  }
  
  export interface ValidationResponse {
    hasError: boolean;
    errorMessage?: string;
  }
  