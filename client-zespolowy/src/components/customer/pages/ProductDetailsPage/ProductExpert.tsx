import { Product } from "../../../../app/models/onlineshop/Product"

interface Props {
    product: Product;
}

export const ProductExpert = ({product}: Props) => {
  return (
    <>
        <h5>Product Expert:</h5>
            <div className="mx-3 mt-3">
            <p>Name: {product.productExpert.firstName} {product.productExpert.lastName}</p>
            <p>Email: {product.productExpert.email}</p>
            <p>Phone: {product.productExpert.phoneNumber}</p>
        </div>
    </>
  )
}