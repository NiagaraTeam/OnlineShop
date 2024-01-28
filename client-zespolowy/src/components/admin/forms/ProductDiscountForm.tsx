import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import NumberInput from "../../common/formInputs/NumberInput";
import DateInput from "../../common/formInputs/DateInput";
import { ProductDiscount } from "../../../app/models/onlineshop/ProductDiscount";


interface Props {
    onSubmit: (discount: ProductDiscount , formikHelpers: FormikHelpers<ProductDiscount>) => void;
    buttonText: string;
    editMode: boolean;
    discount?: ProductDiscount | undefined;
}

export const ProductDiscountForm = observer(
    ({onSubmit, discount, buttonText}: Props) => 
{

  const validationSchema = Yup.object({
    value: Yup.number()
      .required('Discount is required')
      .min(0, 'Discount must be at least 0')
      .max(1, 'Discount must be at most 1'),
    start: Yup.date().required("Start date required"),
    end: Yup.date().required("End date required")
  });

  return (
    <>
        <Formik
          initialValues={discount ? discount : {
            value: 0,
            start: null,
            end: null
          }}
          validationSchema={validationSchema}
          onSubmit={(values, formikHelpers) => onSubmit(values, formikHelpers)}
        >
        {({ isValid, dirty, isSubmitting }) => {
          return(
          <Form >
           

            <div className="row">
                <div className="col">
                    <div><b>Start date:</b></div>
                    <DateInput name="start"
                        placeholderText="Select a start date"
                        todayButton="Today"
                        calendarStartDay={1}
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
                
                <div className="col offset-2">
                    <div><b>End date:</b></div>
                    <DateInput name="end"
                        placeholderText="Select an end date"
                        todayButton="Today"
                        calendarStartDay={1}
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
            </div>
            {/* value */}
            <div className="my-2">
              <b><NumberInput placeholder="Discount value" name="value" label="Discount"/></b>
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