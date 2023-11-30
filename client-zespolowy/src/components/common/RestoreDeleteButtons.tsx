import { FaCircleNotch, FaTrash } from "react-icons/fa"
import { RiArrowGoBackFill } from "react-icons/ri";
import MyTooltip from "./MyTooltip";


interface Props {
    loadingDelete: boolean;
    loadingRestore: boolean;
    restoreAction?: () => void;
    deleteAction?: () => void;
    showRestore?: boolean;
    showDelete?: boolean;
    size?: number;
}

const RestoreDeleteButtons = ({ loadingDelete, loadingRestore, restoreAction, deleteAction, 
    size = 20, showRestore = true, showDelete = true}: Props) => {

  return (
    <div>
        {showRestore &&
        (loadingRestore ?
            <FaCircleNotch className="spinner mx-2" size={size}/>
        :
            <MyTooltip placement="left" text="Restore">
                <RiArrowGoBackFill
                    className="mx-2 hover-primary"
                    size={size}
                    onClick={restoreAction}
                />
            </MyTooltip>
        )    
        }
        {showDelete && 
        (loadingDelete ?
            <FaCircleNotch className="spinner" size={size}/>
        :
            <MyTooltip placement="right" text="Delete permanently">
                <span>
                    <FaTrash className="hover-danger" size={size} onClick={deleteAction}/>
                </span>
            </MyTooltip> 
        ) 
        }
    </div>
  )
}

export default RestoreDeleteButtons
