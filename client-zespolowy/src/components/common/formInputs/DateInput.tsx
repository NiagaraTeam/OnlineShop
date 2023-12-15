import { ErrorMessage, useField } from "formik";
import DatePicker, {ReactDatePickerProps} from "react-datepicker"

interface Props extends Partial<ReactDatePickerProps> {
    label?: string;
}

export default function DateInput(props: Props) {
    const [field, , helpers] = useField(props.name!);
    return (
        <div className="form-group">
            <label htmlFor={field.name}>{props.label}</label>
            <DatePicker
                id={field.name}
                {...field}
                {...props}
                autoComplete='off'
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => helpers.setValue(value)}
                className={`form-control date-picker-control`}
            />
            <ErrorMessage name={props.name!} component="span" className="text-danger"/>
        </div>
    )
}