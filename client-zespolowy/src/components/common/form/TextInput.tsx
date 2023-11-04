import { ErrorMessage, useField } from "formik";

interface Props {
    placeholder: string;
    name: string;
    label?: string;
    type?: string;
}

export default function TextInput(props: Props) {
    const [field, meta] = useField(props.name);
    return (
        <>
            <div className="form-group">
                <label htmlFor={field.name}>
                    {props.label}
                </label>
                <input
                    id={field.name}
                    {...field} 
                    {...props}
                    autoComplete='off'
                    className={meta.touched && meta.error ? 
                    "form-control error" : "form-control"}
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