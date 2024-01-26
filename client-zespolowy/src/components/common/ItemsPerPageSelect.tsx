import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Option } from "../../app/models/options/Option";


export const ItemsPerPage = observer(() => {
    const {userStore: {itemsPerPage, setItemsPerPage}} = useStore();

    const options: Option[] = [
        {
            value: 5,
            text: "5"
        },
        {
            value: 10,
            text: "10"
        },
        {
            value: 25,
            text: "25"
        },
        {
            value: 50,
            text: "50"
        },
    ];

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(event.target.value);
    }

    return (
    <div>
        <select
            className="form-select"
            value={itemsPerPage}
            onChange={handleChange}>     
        {options.map((option) => (
            <option key={option.value} value={option.value}>
            {option.text}
            </option>    
        ))}
        </select>
    </div>
  )
});