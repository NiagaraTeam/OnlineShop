interface Props {
    setPageNumber: (value: React.SetStateAction<number>) => void;
    pageCount: number;
    pageNumber: number;
}

export const Pagination = ({setPageNumber, pageCount, pageNumber }: Props) => {
    const changePage = ({ selected }: {selected: number}) => {
        if (selected < pageCount! && selected >= 0) {
          setPageNumber(selected);
        }
      }
    
    return (
    <nav>
        <ul className="pagination">
        <li className="page-item">
            <a className="page-link" onClick={() => changePage({ selected: pageNumber - 1 })}>
            Previous
            </a>
        </li>
        {[...Array(pageCount)].map((_, index) => (
            <li key={index} className="page-item">
            <a
                className={`page-link ${pageNumber === index ? 'active' : ''}`}
                onClick={() => setPageNumber(index)}
            >
                {index + 1}
            </a>
            </li>
        ))}
        <li className="page-item">
            <a className="page-link" onClick={() => changePage({ selected: pageNumber + 1 })}>
            Next
            </a>
        </li>
        </ul>
    </nav>
  )
};