import { AlertDialog, AlertDialogDescription, AlertDialogLabel } from "@reach/alert-dialog";
import { ReactNode, useRef } from "react";

interface Props {
    label: string;
    description: ReactNode;
    confirmButtonText?: ReactNode;
    cancelButtonText?: ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
}

const Dialog = ({label, description, confirmButtonText = "Confirm", 
        cancelButtonText = "Cancel", onCancel, onConfirm} : Props) => {
    const cancelRef = useRef(null);
    
    return (
        <div>
            <AlertDialog leastDestructiveRef={cancelRef}>
                <AlertDialogLabel className="text-center mb-4">{label}</AlertDialogLabel>

                <AlertDialogDescription className="text-center">
                    {description}
                </AlertDialogDescription>

                <div className="text-center">
                    <button className="btn btn-primary w-100 my-3" onClick={onConfirm}>
                        {confirmButtonText}
                    </button>
                    <button className="btn btn-danger w-100" ref={cancelRef} onClick={onCancel}>
                        {cancelButtonText}
                    </button>
                </div>
            </AlertDialog>
        </div>
    )
}

export default Dialog
