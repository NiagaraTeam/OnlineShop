import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";

interface Props {
    handleCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedCategory: string;
}

export const CategoryFilter = observer(({handleCategoryChange, selectedCategory}: Props) => {
    const {categoryStore} = useStore();
    const {categoriesAsOptions} = categoryStore;
  
    return (
    <div className="col-md-3 order-md-1">
        <select
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}>     
        <option value="">All categories</option>
        {categoriesAsOptions.map((category) => (
            <option key={category.value} value={category.value}>
            {category.text}
            </option>    
        ))}
        </select>
    </div>
  )
});