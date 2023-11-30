import { observer } from "mobx-react-lite"

export const ProductPage = observer(() => {

    const produkt = {
        id: 1,
        name: "Pocky - chocolate flavour",
        description: "Bardzo smaczne paluszki, oblane czekoladą, przekąska z japonii",
        price: 20,
        photo: "https://kimchi.pl/pol_pl_Paluszki-Pocky-Czekoladowe-Original-40g-Glico-902_2.png",
        taxrate: 23,
        discount: { value: 0.2, Start: new Date('2023-01-01'), End: new Date('2023-12-30') },
        quantity: 15,

    };
    const namePE: string = "Bartek";
    const emailPE: string = "pomocnik@poczta.pl";
    const numberPE: string = "111 111 111";

    const currentDate = new Date();

    return (
        <div className="container  align-center">
            <div className="row align-items-start">
                <div className="col  " >
                    <h1>{produkt.name}</h1>
                </div>
                <div className="row align-items-center">
                    <div className="col  ">
                        <img className="rounded float-start" src={produkt.photo} style={{ width: '400px', height: '400px' }}></img>
                    </div>
                    <div className="col  ">
                        <p>Kraj pochodzenia: Japonia</p>
                        <p>Dostępność:
                            {produkt.quantity >= 10 ? (
                                <> Duża dostępność</>
                            ) : produkt.quantity < 10 && produkt.quantity > 0 ? (
                                <> Ostatnie sztuki</>
                            ) : (
                                <> Produkt niedostępny</>
                            )}</p>
                        <hr />
                        {produkt.discount && produkt.discount.Start < currentDate && produkt.discount.End > currentDate ? (
                            <>
                                <h5 className="text-decoration-line-through">Cena: {produkt.price} zł</h5>
                                <h5>Cena po obniżce: {produkt.price * (1 - produkt.discount.value)} zł </h5>
                                <p>Cena po obniżce z VAT: {(produkt.price * (1 - produkt.discount.value)) * (100 + produkt.taxrate) / 100} zł </p>

                            </>
                        ) : (
                            <>
                                <h5>Cena: {produkt.price} zł</h5>
                                <p>Cena z VAT: {produkt.price * (100 + produkt.taxrate) / 100} zł</p>
                            </>
                        )}

                        <hr />

                        <div className="row align-items-center">
                            <div className="col  ">
                                <div className="input-group mb-3">
                                    <button className="btn btn-primary" type="button">Dodaj do koszyka</button>
                                    <input type="number" min={1} max={produkt.quantity} className="form-control" aria-describedby="basic-addon2" />
                                </div>
                                <button className="btn btn-secondary">Dodaj do ulubionych ♥</button>
                            </div>
                        </div>

                    </div>
                </div>
                <hr />
                <div className="row align-items-center">
                    <div className="col  ">
                        <h4>Opis</h4>
                        <p>{produkt.description}</p>
                    </div>
                </div>
            </div>
            <hr />
            <div className="row align-items-center">
                <div className="col  ">
                    <h5>Dane kontaktowe do specjalisty:</h5>
                    <p>Imię: {namePE}</p>
                    <p>E-mail: {emailPE}</p>
                    <p>Numer kontaktowy: {numberPE}</p>

                </div>
            </div>
        </div>


    )
})