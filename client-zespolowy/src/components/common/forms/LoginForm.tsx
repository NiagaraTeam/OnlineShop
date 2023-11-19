import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import TextInput from "../formInputs/TextInput";

interface Props {
    customerLogin?: boolean;
}

export const LoginForm = observer(({customerLogin = true}: Props) => {
    const {userStore} = useStore();

    return (
        <Formik
            initialValues={{email: '', password: '', error: null}}
            onSubmit={(values, {setErrors}) => {
                if (customerLogin)
                    userStore.loginCustomer(values).catch(() => setErrors({error: 'Invalid email or password'}));
                else
                    userStore.loginAdmin(values).catch(() => setErrors({error: 'Invalid email or password'}));
            }}
                
        >
            {({handleSubmit}) => (
                <Form 
                    onSubmit={handleSubmit} 
                    autoComplete="off"
                >
                    <div className="my-2"><TextInput placeholder="Enter email" name="email" label="Email Address"/></div>
                    <div className="my-2"><TextInput placeholder="Password" name="password" type="password" label="Password"/></div>

                    <div className="my-1">
                        <ErrorMessage 
                            name="error"
                            className="text-danger"
                            component="span"
                            
                        />
                    </div>

                    <div className="text-center mt-4">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            >
                            Login
                        </button>
                    </div>
                    
                </Form>
            )}
        </Formik>
    )
})