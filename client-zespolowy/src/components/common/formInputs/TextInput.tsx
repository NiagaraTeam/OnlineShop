import { ErrorMessage, useField } from "formik";

interface Props {
    placeholder: string;
    name: string;
    label?: string;
    type?: string;
}

export default function TextInput(props: Props) {
    const [field] = useField(props.name);
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
                    className={"form-control"}
                />
                <ErrorMessage 
                    name={field.name} 
                    component="span" 
                    className="text-danger"
                />
            </div>
        </>
        
    )
}