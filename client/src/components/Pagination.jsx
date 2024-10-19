import {useState, useEffect} from "react";
import {useSearchParams} from "react-router-dom";

const Pagination = ({total, callback}) => {
  const [page, setPage] = useState(1);

  const newArr = [...Array(total)].map((_, i) => i + 1);

  const [searchParams, setSearchParams] = useSearchParams();

  const search = window.location.search;

  const isActive = (index) => {
    if (index === page) return "active";
    return "";
  };

  const handlePagination = (num) => {
    setSearchParams({page: num});
    callback(num);
  };

  useEffect(() => {
    const num = searchParams.get("page");
    setPage(Number(num));
  }, [search]);

  return (
    <div className="mt-5">
      <ul className="flex items-center justify-between">
        {page > 1 && (
          <li
            onClick={() => handlePagination(page - 1)}
            className="bg-gray-400 text-white py-2 px-4 rounded cursor-pointer"
          >
            <span aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </span>
          </li>
        )}
        {newArr.map((num) => (
          <li
            key={num}
            className={`page-item text-white py-2 px-4 rounded cursor-pointer ${
              isActive(num) === "active" ? "bg-blue-700" : "bg-gray-700"
            }`}
            onClick={() => handlePagination(num)}
          >
            <span>{num}</span>
          </li>
        ))}
        {page < total && (
          <li
            onClick={() => handlePagination(page + 1)}
            className="bg-gray-400 text-white py-2 px-4 rounded cursor-pointer"
          >
            <span aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Pagination;
