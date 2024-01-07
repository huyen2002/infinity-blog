const Pagination = ({
  total,
  current,
  pageSize,
  setPage,
}: {
  total: number;
  current: number;
  pageSize: number;
  setPage: (page: number) => void;
}) => {
  const pageCount: number =
    Math.ceil(total / pageSize) === 0 ? 1 : Math.ceil(total / pageSize);
  return (
    <div className="float-right">
      <nav aria-label="Page navigation example">
        <ul className="flex h-10 items-center -space-x-px text-base">
          <span className="mr-5 font-montserrat text-lg"> Total: {total}</span>

          <li onClick={() => setPage(current - 1)}>
            <button className="ms-0 flex h-10 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Previous</span>
              <svg
                className="h-3 w-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </button>
          </li>
          {pageCount >= 1 &&
            Array.from({ length: pageCount }).map((_, index) => {
              return (
                <li
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`flex h-10 items-center justify-center border  px-4 leading-tight  ${
                    index + 1 === current
                      ? "border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      : "border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
                >
                  {index + 1}
                </li>
              );
            })}

          <li onClick={() => setPage(current + 1)}>
            <button className="flex h-10 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Next</span>
              <svg
                className="h-3 w-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Pagination;
