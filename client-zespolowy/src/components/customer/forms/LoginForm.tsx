import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import TextInput from "../../common/form/TextInput";

export const LoginForm = observer(() => {
    const {userStore} = useStore();

    return (
        <Formik
            initialValues={{email: '', password: '', error: null}}
            onSubmit={(values, {setErrors}) => 
                userStore.loginCustomer(values).catch(() =>
                    setErrors({error: 'Invalid email or password'}))
            }   
        >
            {({handleSubmit}) => (
                <Form 
                    className="form outline outline-primary" 
                    onSubmit={handleSubmit} 
                    autoComplete="off"
                >
                    <h1 className="text-center">Login to OnlineShop</h1>
                    
                    <TextInput placeholder="Enter email" name="email" label="Email Address"/>
                    <TextInput placeholder="Password" name="password" type="password" label="Password"/>

                    <div className="my-1">
                        <ErrorMessage 
                            name="error"
                            className="error"
                            component="span"
                            
                        />
                    </div>

                    <div className="text-center mt-4">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                    
                </Form>
            )}
        </Formik>
    )
})