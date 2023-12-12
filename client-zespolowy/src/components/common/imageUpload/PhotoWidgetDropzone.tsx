/* eslint-disable @typescript-eslint/no-explicit-any */
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { IoCloudUpload } from "react-icons/io5";

interface Props {
    setFiles: (files: any) => void;
}

export default function PhotoUploadWidgetDropzone({setFiles}: Props) {
    const dzStyles = {
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius: '5px',
        paddingTop: '85px',
        textAlign: 'center' as const,
        height: '244px'
    }

    const dzActive = {
        borderColor: 'green',
    }

    const onDrop = useCallback((acceptedFiles: any) => {
        setFiles(acceptedFiles.map((file: any) => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })))
    }, [setFiles])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div {...getRootProps()} style={isDragActive ? {...dzStyles, ...dzActive} : dzStyles}>
            <input {...getInputProps()} />
            <IoCloudUpload size={30} />
            <h4>Drop image here</h4>
        </div>
    )
}