import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";

export const ProductsPage = observer(() => {
    const {userStore: {isLoggedIn}} = useStore();

    console.log(isLoggedIn);
    return (
        <h2>Lista produktów</h2>
    )
})