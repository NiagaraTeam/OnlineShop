import { Field } from 'formik';
import { Option } from "../../../app/models/options/Option";

interface Props {
  label?: string;
  name: string;
  options: Option[];
}

export default function SelectInput({label, name, options}:Props) {
  return (
    <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <Field
          className="form-control"
          as="select"
          name={name}
          id={name}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </Field>
    </div>
  );
}