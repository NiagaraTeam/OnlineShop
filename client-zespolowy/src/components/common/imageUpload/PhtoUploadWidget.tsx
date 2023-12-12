/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import PhotoUploadWidgetDropzone from './PhotoWidgetDropzone';
import PhotoWidgetCropper from './PhotoWidgetCropper';
import { Product } from '../../../app/models/onlineshop/Product';

interface Props {
    loading: boolean;
    uploadPhoto: (file: Blob) => Promise<void>;
    product: Product;
}

export const PhotoUploadWidget = observer(({loading, uploadPhoto, product}: Props) => {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas()
                .toBlob(blob => 
                    uploadPhoto(blob!)
                        .then(() => setFiles([])));
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview))
        }
    }, [files]);

    return (
        <div className='row'>

                <div className="col-6">
                    <h5 className='mb-4'>Current Photo</h5>
                    <img style={{width: "244px"}} src={product.photo ? product.photo.urlSmall : '/assets/product.jpg'} alt={product.name} />
                </div>

                <div className="col-6">
                    <h5 className='mb-4'>Change Photo</h5>
                    <PhotoUploadWidgetDropzone setFiles={setFiles} />
                </div>

                <div className='col-6 mt-4'>
                    
                    {files && files.length > 0 &&
                    <>
                        <h5 className='mb-4'>Step 2 - Resize image</h5>
                        <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                    </>
                    }

                </div>

                <div className='col-6 mt-4'>
                    {files && files.length > 0 && 
                    <>
                        <h5 className='mb-4'>Step 3 - Preview & Upload</h5>
                        <div className="img-preview" style={{ minHeight:"250px", overflow: 'hidden'}} />
                        <div className='row g-1 pt-3'>
                            <button className='btn btn-success col-5' onClick={onCrop} disabled={loading}>Upload</button>
                            <button className='btn btn-danger col-5 offset-2' onClick={() => setFiles([])} disabled={loading}>Cancel</button>
                        </div>
                    </>}
                </div>
        </div>
    )
})