import StringField from "./stringField";
import BooleanField from "./booleanField";
import NumberField from "./numberField";
import SelectField from "./selectField";
import DateField from "./dateField";
import AutoCompleteField from "./autoCompleteField";
import CodeEditorField from "./codeEditorField";
import LabelField from "./labelField";

const Components = {
  Text: StringField,
  Label: LabelField,
  Number: NumberField,
  DatePicker: DateField,
  Checkbox: BooleanField,
  Select: SelectField,
  AutoComplete: AutoCompleteField,
  CodeEditor: CodeEditorField,
};

export default Components;
