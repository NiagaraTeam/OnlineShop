import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

interface Props {
    productId: number;
    size?: number;
    color?: unknown;
}

export const FavouriteCheckBox = observer(({productId, size = 30, color="black"}: Props) => {
    const {productStore, userStore} = useStore();
    const {isProductInFavorites, addToFavourites, removeFromFavourites} = productStore;

    if (!userStore.isLoggedIn || userStore.isAdmin) return <></>

    return (
        <>
        {isProductInFavorites(productId) ?   
                <span className="cursor-pointer" 
                    onClick={() => removeFromFavourites(userStore.user!.id, productId)}>
                        <IoMdHeart size={size} color={color}/>
                </span>
            : 
                <span className="cursor-pointer" 
                    onClick={() => addToFavourites(userStore.user!.id, productId)}>
                        <IoMdHeartEmpty size={size} color={color}/>
                </span>
            }
        </>
    )
})

