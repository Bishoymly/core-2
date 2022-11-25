import StringField from "./stringField";
import BooleanField from "./booleanField";
import NumberField from "./numberField";
import SelectField from "./selectField";
import DateField from "./dateField";
import AutoCompleteField from "./autoCompleteField";

const Components = {
  Text: StringField,
  Number: NumberField,
  DatePicker: DateField,
  Checkbox: BooleanField,
  Select: SelectField,
  AutoComplete: AutoCompleteField,
};

export default Components;
