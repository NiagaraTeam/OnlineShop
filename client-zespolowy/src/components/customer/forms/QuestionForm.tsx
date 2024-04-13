import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextInput from "../../common/formInputs/TextInput";
import { Question } from "../../../app/models/onlineshop/Question";

interface Props {
    buttonText: string;
    productExpertEmail: string;
    onSubmit: (question: Question) => void;
}

export const QuestionForm = ({ buttonText, onSubmit, productExpertEmail }: Props) => {
    const validationSchema = Yup.object().shape({
        question: Yup.string(),
    });

    return (
        <>
            <Formik
                initialValues={{ question: '' }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    console.log('formularz');
                    console.log(values.question);
                    onSubmit({email: productExpertEmail, message: values.question});
                    resetForm();
                }}
            >
                {({ isValid, dirty, isSubmitting }) => (
                    <Form>
                        <div className="my-2">
                            <TextInput 
                                placeholder="Enter your question..."
                                name="question"
                                label="Question about product"
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