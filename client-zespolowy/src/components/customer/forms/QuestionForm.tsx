import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextInput from "../../common/formInputs/TextInput";

interface Props {
    buttonText: string;
}

export const QuestionForm = ({ buttonText }: Props) => {
    const validationSchema = Yup.object().shape({
        question: Yup.string(),
    });

    return (
        <>
            <Formik
                initialValues={{ question: '' }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    console.log(values.question);
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