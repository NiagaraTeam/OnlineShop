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
                className="form-control border-end-1"
                type="search"
                id="example-search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
            />
            </div>
        </div>
  )
};