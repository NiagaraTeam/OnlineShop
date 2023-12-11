import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import TextInput from "../../common/formInputs/TextInput";
import { UserDiscount } from "../../../app/models/onlineshop/UserDiscount";


interface Props {
    onSubmit: (discount: UserDiscount, formikHelpers: FormikHelpers<UserDiscount>) => void;
    buttonText: string;
    editMode: boolean;
    discount?: UserDiscount | undefined;
}

export const EditDiscountForm = observer(
    ({onSubmit, discount, buttonText}: Props) => 
{

const validationSchema = Yup.object({
    value: Yup.number()
      .typeError('Discount must be a number')
      .required('Discount is required')
      .max(100, 'Discount must be at least 100')
      .positive('Discount must be a positive number'),
});

  return (
    <>
        <Formik
          initialValues={discount ? discount : {
            value: 0
          }}
          validationSchema={validationSchema}
          onSubmit={(values, formikHelpers) => onSubmit(values, formikHelpers)}
        >
        {({ isValid, dirty, isSubmitting }) => {
          return(
          <Form >
            {/* value */}
            <div className="my-2">
                <TextInput placeholder="Enter shipping name" name="value" label="Discount"/>
            </div>
            

            {/* Button */}
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
          )
        }}
        </Formik>
      </>
  )
})