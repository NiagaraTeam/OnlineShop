import { observer } from "mobx-react-lite"
import { useStore } from "../../../../app/stores/store";
import { useState } from "react";
import Loading from "../../../common/Loading";
import { ProductForm } from "../../forms/ProductForm";
import { FormikHelpers } from "formik";
import { ProductFormValues } from "../../../../app/models/onlineshop/Product";
import { DeletedProducts } from "./DeletedProducts";
import { Products } from "./Products";
import { PhotoUploadWidget } from "../../../common/imageUpload/PhtoUploadWidget";
import { ProductDiscountForm } from "../../forms/ProductDiscountForm";
import { format } from 'date-fns';
import { ProductDiscount } from "../../../../app/models/onlineshop/ProductDiscount";
import { Helmet } from "react-helmet-async";

export const ProductsPage = observer(() => {
    const {productStore, commonStore} = useStore();
    const {selectedProduct, createProduct, updateProduct, 
        uploadPhoto, uploading, addProductDiscount, deselectProduct} = productStore;
    const {initialLoading} = commonStore;

    // view logic
    const [showEditForm, setShowEditForm] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showDeletedProducts, setShowDeletedProducts] = useState(false);
    const [activeTab, setActiveTab] = useState("details");

    // edit
    function handleEdit(product: ProductFormValues, formikHelpers: FormikHelpers<ProductFormValues>): void {
        updateProduct(product.id!, product).then(() => {
            formikHelpers.resetForm({values: {...product}});
        });
    }

    function toggleEditForm(state: boolean) {
        setShowCreateForm(!state);
        setShowEditForm(state);
    }

    // create
    function handleCreate(product: ProductFormValues, formikHelpers: FormikHelpers<ProductFormValues>): void {
        createProduct(product).then(() => {
            formikHelpers.resetForm();
        });
    }

    function handlePhotoUpload(file: Blob): Promise<void> {
        return uploadPhoto(selectedProduct!.id, file);
    }

    // add product discount
    function handleAddProductDiscount (discount: ProductDiscount , formikHelpers: FormikHelpers<ProductDiscount>) {
        addProductDiscount(selectedProduct!.id, discount)
            .then(() => {
                formikHelpers.resetForm();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // render component
    if (initialLoading) return <div className="text-center m-5"><Loading/></div>

    return (
        <div className="m-3">
            <Helmet>
                <title>Products - BeautyShop</title>
            </Helmet>
            <div className="row">

                <div className="mx-auto">

                    {!showDeletedProducts &&
                        <Products 
                            showCreateButton={!showCreateForm && !showEditForm} 
                            setShowCreateForm={setShowCreateForm} 
                            setShowEditForm={toggleEditForm} 
                            setShowDeletedProducts={setShowDeletedProducts}/>}
    
                    {showDeletedProducts &&
                        <DeletedProducts setShowDeletedProducts={setShowDeletedProducts}/>}
                        
                </div>
            
                <div className="col-lg-5 offset-lg-1">
                    
                    {showCreateForm &&
                    <>
                        <h2 className="my-4 d-flex justify-content-between align-items-center">
                            <span>Create Product</span>
                            <button className="btn btn-close" onClick={() => setShowCreateForm(false)}></button>
                        </h2>
                        <ProductForm onSubmit={handleCreate} buttonText="Create" product={new ProductFormValues()}/>
                    </>}

                    {showEditForm &&
                    <>
                        <h2 className="my-4 d-flex justify-content-between align-items-center">
                            <span>Edit Product</span>
                            <button className="btn btn-close" onClick={() => {setShowEditForm(false); deselectProduct(); setActiveTab('details') }}></button>
                        </h2>
                        <div className="btn-group d-flex mb-4">
                            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" 
                                checked={activeTab === 'details'} onChange={() => setActiveTab('details')} />
                            <label className={`btn btn-outline-secondary ${activeTab === 'details' ? 'active' : ''}`} htmlFor="btnradio1">
                                Details
                            </label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" 
                                checked={activeTab === 'photo'} onChange={() => setActiveTab('photo')} />
                            <label className={`btn btn-outline-secondary ${activeTab === 'photo' ? 'active' : ''}`} htmlFor="btnradio2">
                                Photo
                            </label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" 
                                checked={activeTab === 'discount'} onChange={() => setActiveTab('discount')} />
                            <label className={`btn btn-outline-secondary ${activeTab === 'discount' ? 'active' : ''}`} htmlFor="btnradio3">
                                Discount
                            </label>
                        </div>

                        {activeTab === 'details' && 
                        <div key={selectedProduct!.id}>
                            <ProductForm 
                                onSubmit={handleEdit} buttonText="Save"
                                product={ProductFormValues.createFromProduct(selectedProduct!)}
                            />
                        </div>}

                        {activeTab === 'photo' && 
                        <div key={selectedProduct!.id} >
                            <PhotoUploadWidget product={selectedProduct!} uploadPhoto={handlePhotoUpload} loading={uploading}/>
                        </div>}

                        {activeTab === 'discount' && 
                        <>
                            <div key={selectedProduct!.id} >
                                <ProductDiscountForm onSubmit={handleAddProductDiscount} buttonText="Add" editMode={false}/>
                                {selectedProduct!.productDiscounts.length > 0 &&
                                <>
                                    <h5>Discounts</h5>
                                    <table className="table table-bordered">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col">Discount Value</th>
                                                <th scope="col">Start Date</th>
                                                <th scope="col">End Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedProduct?.productDiscounts.map((discount) => (
                                                <tr key={`${discount.value} ${discount.start} ${discount.end}`}>
                                                <td>{discount.value}</td>
                                                <td>{format(discount.start!, 'dd/MM/yyyy')}</td>
                                                <td>{format(discount.end!, 'dd/MM/yyyy')}</td>
                                            </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>}
                            </div>
                        </>}
                    </>}

                    
                    
                </div>
            
            </div>
        </div>    
    )
})