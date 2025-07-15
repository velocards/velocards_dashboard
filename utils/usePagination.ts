import { useState } from 'react';

type UsePaginationResult = {
    currentPage: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (page: number) => void;
};

const usePagination = (totalItems: number, itemsPerPage: number): UsePaginationResult => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return {
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        nextPage,
        prevPage,
        goToPage,

    };
};

export default usePagination;
