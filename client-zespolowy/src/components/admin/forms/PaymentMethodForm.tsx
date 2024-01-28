import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite"
import { PaymentMethod } from "../../../app/models/onlineshop/PaymentMethod";
import * as Yup from "yup";
import TextInput from "../../common/formInputs/TextInput";

interface Props {
    onSubmit: (method: PaymentMethod, formikHelpers: FormikHelpers<PaymentMethod>) => void;
    buttonText: string;
    method?: PaymentMethod;
}

export const PaymentMethodForm = observer(
    ({onSubmit, method, buttonText}: Props) => 
{

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
});

  return (
    <>
        <Formik
          initialValues={method ? method : {
            id: 0,
            name: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, formikHelpers) => onSubmit(values, formikHelpers)}
        >
        {({ isValid, dirty, isSubmitting }) => {
          return(
          <Form >
            {/* Name */}
            <div className="my-2">
                <TextInput placeholder="Payment name" name="name" />
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