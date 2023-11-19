import { FaCircleNotch, FaEdit, FaTrash } from "react-icons/fa"

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
        <FaEdit
            className="mx-2 hover-primary"
            size={size}
            onClick={editAction}
        />
        }
        {showDelete && 
        (loading ?
            <FaCircleNotch className="spinner" size={size}/>
        :
            <FaTrash className="hover-danger" size={size} onClick={deleteAction}/>
        ) 
        }
    </div>
  )
}

export default EditDeleteButtons
