import { observer } from "mobx-react-lite";
import { useStore } from "../../../../app/stores/store";


export const CartPageTotalValue = observer(() => {
    const {cartStore, userStore} = useStore();
    const {calculateTotalValues} = cartStore;
    const {accountDetails, hasDiscount,userDiscount} = userStore;
  
    const { total, discountedTotal, 
      totalWithTax, discountedTotalWithTax } = calculateTotalValues(userDiscount);

    return (
        <>
            {hasDiscount && 
            <div className="text-success">
                ({Math.floor(
                accountDetails!.discountValue * 100
                )} % discount applied)
            </div>}
            <div className="my-4">
                <h4>
                    Total:{" "}
                    {hasDiscount ? (
                    <>
                        <del>{total} zł</del>{" "}
                        {discountedTotal} zł
                    </>
                    ) : (
                    <>{total} zł</>
                    )}
                </h4>
                <h5 className="text-muted">
                    Total with Tax:{" "}
                    {hasDiscount ? (
                    <>
                        <del>{totalWithTax} zł</del>{" "}
                        {discountedTotalWithTax} zł
                    </>
                    ) : (
                    <>{totalWithTax} zł</>
                    )}
                </h5>
            </div>
        </>
    );
});