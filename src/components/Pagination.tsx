import React from "react";

interface PaginationProps {
    currentPage: number;
    recorsPerPage: number;
    totalRecords: number;
    paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, recorsPerPage, totalRecords, paginate }) => {
    const pageNumbers = [...Array(Math.ceil(totalRecords / recorsPerPage)).keys()];

    return (
        <div className="pagination" style={{justifyContent: "end", marginTop: "20px", marginRight: "20px"}}>
            <nav aria-label="...">
                <ul className="pagination">
                    <li className="page-item">
                        <button
                            className="page-link bg-dark text-light"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >   
                            Anterior
                        </button>
                    </li>
                    {pageNumbers.map((number) => (
                        <li 
                            key={number + 1}
                            className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                        >
                            <button
                                className="page-link bg-dark text-light"
                                onClick={() => paginate(number + 1)}
                            >
                                {number + 1}
                            </button>
                        </li>
                    ))}
                    <li className="page-item">
                        <button
                            className="page-link bg-dark text-light"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === Math.ceil(totalRecords / recorsPerPage)}
                        >
                            Siguiente
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Pagination;