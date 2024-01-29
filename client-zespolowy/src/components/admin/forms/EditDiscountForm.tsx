import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import { UserDiscount } from "../../../app/models/onlineshop/UserDiscount";
import NumberInput from "../../common/formInputs/NumberInput";


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
      .required('Discount is required')
      .min(0, 'Discount must be at least 0')
      .max(1, 'Discount must be at most 1'),
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
                <NumberInput placeholder="Discount value" name="value" label="Discount"/>
            </div>
            

            {/* Button */}
            <div className="text-center my-4">
              <button
                type="submit"
                className="btn btn-primary"
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