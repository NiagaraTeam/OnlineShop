import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite"
import { ShippingMethod } from "../../../app/models/onlineshop/ShippingMethod";
import * as Yup from "yup";
import NumberInput from "../../common/formInputs/NumberInput";
import TextInput from "../../common/formInputs/TextInput";

interface Props {
    onSubmit: (method: ShippingMethod, formikHelpers: FormikHelpers<ShippingMethod>) => void;
    buttonText: string;
    method?: ShippingMethod;
}

export const ShippingMethodForm = observer(
    ({onSubmit, method, buttonText}: Props) => 
{

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    cost: Yup.number().required('Cost is required')
});

  return (
    <>
        <Formik
          initialValues={method ? method : {
            id: 0,
            name: '',
            cost: null
          }}
          validationSchema={validationSchema}
          onSubmit={(values, formikHelpers) => onSubmit(values, formikHelpers)}
        >
        {({ isValid, dirty, isSubmitting }) => {
          return(
          <Form >
            {/* Name */}
            <div className="my-1">
                <TextInput placeholder="Name" name="name" />
            </div>
            
            {/* Cost */}
            <div className="my-1">
                <NumberInput placeholder="Cost" name="cost"/>
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

