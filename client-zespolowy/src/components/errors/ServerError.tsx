import { Helmet } from "react-helmet";
import { useStore } from "../../app/stores/store";

const ServerError = () => {
    const {commonStore} = useStore();

    return (
        <div>
            <Helmet>
                <title>Server Error - OnlineShop</title>
            </Helmet>
            <h1>Server Error</h1>
            <h5>{commonStore.serverError?.message}</h5>
            {commonStore.serverError?.details && (
                <>
                    <h4>Stack trace</h4>
                    <code style={{marginTop: '10px'}}>{commonStore.serverError.details}</code>
                </>
            )}
        </div>
    )
}

export default ServerError