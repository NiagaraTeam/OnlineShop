import { FaCircleNotch, FaEdit, FaTrash } from "react-icons/fa"
import MyTooltip from "./MyTooltip";

interface Props {
    loading: boolean;
    editAction?: () => void;
    deleteAction?: () => void;
    showEdit?: boolean;
    showDelete?: boolean;
    size?: number;
}

const EditDeleteButtons = ({loading, editAction, deleteAction, 
    size = 20, showEdit = true, showDelete = true}: Props) => {
  return (
    <div>
        {showEdit &&
        <MyTooltip placement="left" text="Edit">
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
            <MyTooltip placement="right" text="Move to trash">
                <FaTrash className="hover-danger" size={size} onClick={deleteAction}/>
            </MyTooltip>
        ) 
        }
    </div>
  )
}

export default EditDeleteButtons
