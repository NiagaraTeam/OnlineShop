import { ErrorMessage, useField } from "formik";

interface Props {
    placeholder: string;
    name: string;
    rows: number;
    label?: string;
}

export default function MyTextArea(props: Props) {
    const [field] = useField(props.name);
    return (
        <div className="form-group">
            <label htmlFor={field.name}>
                {props.label}
            </label>
            <textarea {...field} {...props} className={"form-control"}/>
            <ErrorMessage 
                    name={field.name} 
                    component="span" 
                    className="text-danger"
                />
        </div>
    )
}