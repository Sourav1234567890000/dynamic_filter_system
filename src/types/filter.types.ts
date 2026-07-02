interface TextField {
  type: "text";
  key: string;
  label: string;
}

interface NumberField {
  type: "number";
  key: string;
  label: string;
}

interface SelectField {
  type: "select";
  key: string;
  label: string;
  options: string[];       
}

interface MultiSelectField {
  type: "multiselect";
  key: string;
  label: string;
  options: string[];
}

interface BooleanField {
  type: "boolean";
  key: string;
  label: string;
}

interface DateField {
  type: "date";
  key: string;
  label: string;
}

export type FieldConfig =
  | TextField
  | NumberField
  | SelectField
  | MultiSelectField
  | BooleanField
  | DateField;

// An active filter the user has applied
export interface ActiveFilter {
  id: string;
  key: string;
  operator: string;
  value: string | number | boolean | string[];
}