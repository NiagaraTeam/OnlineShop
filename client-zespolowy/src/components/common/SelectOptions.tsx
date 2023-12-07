import { Option } from "../../app/models/options/Option";

interface Props {
  value: number | undefined;
  options: Option[];
  onChange: (value: number) => void;
}

const SelectOptions = ({value, options, onChange,}: Props) => {
  return (
    <select
      className="form-select"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  );
};

export default SelectOptions;
