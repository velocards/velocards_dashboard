import cn from "@/utils/cn";
type paginationProps = {
  totalPages: number;
  currentPage: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  startIndex: number;
  endIndex: number;
  total: number;
};
const Pagination = ({
  totalPages,
  currentPage,
  goToPage,
  total,
  startIndex,
  endIndex,
  nextPage,
  prevPage,
}: paginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <div className="flex col-span-12 gap-4 sm:justify-between justify-center items-center flex-wrap">
      <p>
        Showing {startIndex + 1} to {endIndex + 1} of {total} entries
      </p>

      <ul className="flex gap-2 md:gap-3 flex-wrap md:font-semibold items-center">
        <li>
          <button
            onClick={prevPage}
            className={cn(
              "hover:bg-primary text-primary hover:text-n0 border md:w-10 duration-300 md:h-10 w-8 h-8 flex items-center rounded-full justify-center border-primary"
            )}>
            <i className="las la-angle-left text-lg"></i>
          </button>
        </li>
        {pages.map((page, i) => (
          <li key={i}>
            <button
              onClick={() => goToPage(page)}
              className={cn(
                "hover:bg-primary text-primary hover:text-n0 border md:w-10 duration-300 md:h-10 w-8 h-8 flex items-center rounded-full justify-center border-primary",
                {
                  "bg-primary text-n0": currentPage == page,
                }
              )}>
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={nextPage}
            className={cn(
              "hover:bg-primary text-primary hover:text-n0 border md:w-10 duration-300 md:h-10 w-8 h-8 flex items-center rounded-full justify-center border-primary"
            )}>
            <i className="las la-angle-right text-lg"></i>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
