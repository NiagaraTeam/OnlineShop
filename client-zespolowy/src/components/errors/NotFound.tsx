import { Helmet } from "react-helmet";

export default function NotFound() {
    return (
        <>
            <Helmet>
                <title>Not Found - OnlineShop</title>
            </Helmet>
            <div className="text-center">
                <span style={{fontSize: '150px'}}>
                    404
                </span>
                <h1>Not found</h1>
            </div>
        </>
    )
}