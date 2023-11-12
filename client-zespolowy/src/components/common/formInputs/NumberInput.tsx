import { ErrorMessage, useField } from "formik";

interface Props {
    placeholder: string;
    name: string;
    label?: string;
}

export default function NumberInput(props: Props) {
    const [field, meta] = useField(props.name);
    return (
        <>
            <div className="form-control">
                <label htmlFor={field.name}>
                    {props.label}
                </label>
                <input
                    id={field.name}
                    type="number"
                    autoComplete='off'
                    {...field} 
                    {...props}
                    value={field.value === null ? '' : field.value}
                    className={meta.touched && meta.error ? 
                    "error" : ""}
                />
                <ErrorMessage 
                    name={field.name} 
                    component="span" 
                    className="error"
                />
            </div>
        </>
    )
}