import { Form, Formik, FormikHelpers } from "formik";
import { Address } from "../../../app/models/onlineshop/Address";
import * as Yup from "yup";
import TextInput from "../../common/formInputs/TextInput";

interface Props {
    onSubmit: (address: Address, formikHelpers: FormikHelpers<Address>) => void;
    buttonText: string;
    address?: Address;
}

export const AddressForm = ({ onSubmit, address, buttonText }: Props) => {
        const validationSchema = Yup.object(
            {
                addressLine1: Yup.string().required("Address is required."),
                addressLine2: Yup.string(),
                city: Yup.string().required("City is required."),
                zipCode: Yup.string().required("Zip Code is required.").length(5, 'Zip code should consist exactly 5 characters.'),
                country: Yup.string().required("Country is required.")
            }
        );

        // Sprawdź, czy wartość jest null i zastąp ją pustym stringiem
        const initialAddress = address
        ? {
            addressLine1: address.addressLine1 || "",
            addressLine2: address.addressLine2 || "",
            city: address.city || "",
            zipCode: address.zipCode || "",
            country: address.country || "",
        }
        : {
            addressLine1: "",
            addressLine2: "",
            city: "",
            zipCode: "",
            country: "",
        };

        return (
            <>
                <Formik
                    initialValues={initialAddress}
                    validationSchema={validationSchema}
                    onSubmit={(values, formikHelpers) => onSubmit(values, formikHelpers)}
                >
                    {({ isValid, dirty, isSubmitting }) => {
                        return (
                            <Form>
                                {/* Addrss Line 1 */}
                                <div className="my-2">
                                    <TextInput 
                                        placeholder="Enter address"
                                        name="addressLine1"
                                        label="Address Line 1"
                                    />
                                </div>

                                {/* Address Line 2 */}
                                <div className="my-2">
                                    <TextInput
                                        placeholder="Enter address line 2"
                                        name="addressLine2"
                                        label="Address Line 2"
                                    />
                                </div>

                                {/* City */}
                                <div className="my-2">
                                    <TextInput
                                        placeholder="Enter city"
                                        name="city"
                                        label="City"
                                    />
                                </div>

                                {/* Zip Code */}
                                <div className="my-2">
                                    <TextInput
                                        placeholder="Enter zip code"
                                        name="zipCode"
                                        label="Zip Code"
                                    />
                                </div>

                                {/* Country */}
                                <div className="my-2">
                                    <TextInput
                                        placeholder="Enter country"
                                        name="country"
                                        label="Country"
                                    />
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

    }