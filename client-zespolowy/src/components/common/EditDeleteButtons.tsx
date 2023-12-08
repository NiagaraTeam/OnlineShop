import { FaCircleNotch, FaEdit, FaTrash } from "react-icons/fa"
import MyTooltip from "./MyTooltip";

interface Props {
    loading: boolean;
    editAction?: () => void;
    editToolTipText?: string;
    deleteAction?: () => void;
    deleteToolTipText?: string;
    showEdit?: boolean;
    showDelete?: boolean;
    size?: number;
}

const EditDeleteButtons = ({loading, editAction, deleteAction, 
    size = 20, showEdit = true, showDelete = true, deleteToolTipText = "Delete", editToolTipText = "Edit"}: Props) => {
  return (
    <div className="d-flex me-2">
        {showEdit &&
        <MyTooltip placement="left" text={editToolTipText}>
            <FaEdit
                className="mx-2 hover-primary"
                size={size}
                onClick={editAction}
            />
        </MyTooltip>
        }
        {showDelete && 
        (loading ?
            <FaCircleNotch className="spinner" size={size}/>
        :
            <MyTooltip placement="right" text={deleteToolTipText}>
                <FaTrash className="hover-danger" size={size} onClick={deleteAction}/>
            </MyTooltip>
        ) 
        }
    </div>
  )
}

export default EditDeleteButtons
