import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextInput from "../../common/formInputs/TextInput";
import { Question } from "../../../app/models/onlineshop/Question";
import TextAreaInput from "../../common/formInputs/TextAreaInput";

interface Props {
    buttonText: string;
    userEmail: string;
    onSubmit: (question: Question) => void;
}

export const QuestionForm = ({ buttonText, onSubmit, userEmail }: Props) => {
    const validationSchema = Yup.object().shape({
        question: Yup.string().required('Question is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
    });

    return (
        <>
            <Formik
                initialValues={{ question: '', email: userEmail }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    onSubmit({email: values.email, message: values.question});
                    resetForm();
                }}
            >
                {({ isValid, dirty, isSubmitting }) => (
                    <Form>
                        <div className="my-2">
                            <TextInput 
                                placeholder="Enter your question..."
                                name="email"
                                label="Email"
                            />
                        </div>

                        <div className="my-2">
                            <TextAreaInput 
                                placeholder="Enter your question..."
                                name="question"
                                label="Question"
                                rows={3}
                            />
                        </div>

                        <div className="text-center my-4">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={!(dirty && isValid) || isSubmitting}
                            >
                                {buttonText}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};