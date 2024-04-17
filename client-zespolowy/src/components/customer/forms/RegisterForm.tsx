import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from 'yup';
import TextInput from "../../common/formInputs/TextInput";


export const RegisterForm = observer(() => {
    const {userStore} = useStore();
    return (
        <Formik
            initialValues={{userName: '', email: '', password: '', confirmPassword: '', error: null}}
            onSubmit={(values, {setErrors}) => 
                userStore.register(values).catch(error => 
                    setErrors({error}))        
            }
            validationSchema={Yup.object({
                userName: Yup.string().required('Username is required'),
                email: Yup.string().email('Invalid email format').required('Email is required'),
                password: Yup.string().required('Password is required'),
                confirmPassword: Yup.string().required('Confirm password')
                    .oneOf([Yup.ref('password')], 'Your passwords do not match.')
            })}
        >
            {({handleSubmit, isSubmitting, isValid, dirty}) => (
                <Form
                    className="form outline outline-primary" 
                    onSubmit={handleSubmit} 
                    autoComplete="off"
                >                   
                    <div className="my-2"><TextInput placeholder="Username" name="userName" label="Username"/></div>
                    <div className="my-2"><TextInput placeholder="Email" name="email" label="Email"/></div>
                    <div className="my-2"><TextInput placeholder="Password" name="password" type="password" label="Password"/></div>
                    <div className="my-2"><TextInput placeholder="Confirm Password" name="confirmPassword" type="password" label="Confirm Password"/></div>

                    <div className="my-1">
                        <ErrorMessage 
                            name="error"
                            className="text-danger"
                            component="span"
                        />
                    </div>
                    
                    <div className="text-center my-5">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!isValid || !dirty || isSubmitting}>
                                Sign up
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
})