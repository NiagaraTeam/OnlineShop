interface Props {
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchQuery: string;
    colSize?: number;
}

export const Search = ({handleSearch, searchQuery, colSize = 5}: Props) => {
    return (
        <div className={`col-${colSize}`}>
            <div className="input-group">
            <input
                className="form-control border-end-0 border rounded-pill"
                type="search"
                id="example-search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
            />
            </div>
        </div>
  )
};