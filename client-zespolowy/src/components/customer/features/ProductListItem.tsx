import { observer } from "mobx-react-lite";
import Image from "./img/telefon.png";

interface Props {
    name: string;
    price: number;
}

export const ProductListItem: React.FC<Props> = observer(({ name, price }) => {
    return (
      <div className="card w-10 m-2">
        <img src={Image} className="card-img-top" alt={name} />
        <div className="card-body">
          <h6 className="card-title">{name}</h6>
          <p>Cena: {price} zł</p>
        </div>
      </div>
    );
});