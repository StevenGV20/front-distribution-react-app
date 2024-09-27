import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Pagination({
  totalPages,
  onPage,
  pageActual,
  numberOfElements,
  totalElements,
}) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    let elements = [];
    for (let index = 0; index < totalPages; index++) {
      elements.push(<>{index}</>);
    }
    setPages([...elements]);
  }, []);

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <Link
          to="#"
          className="relative inline-flex items-center px-4 py-2 border-1 border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </Link>
        <Link
          to="#"
          className="ml-3 relative inline-flex items-center px-4 py-2 border-1 border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Next
        </Link>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrar <span className="font-medium">1</span> a{" "}
            <span className="font-medium">{numberOfElements}</span> de{" "}
            <span className="font-medium">{totalElements}</span> resultados
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <Link
              to="#"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border-1 border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous {"<"} </span>
              <div
                className="h-5 w-5"
                aria-hidden="true"
                onClick={() => pageActual > 0 && onPage(pageActual - 1)}
              >
                {" < "}
              </div>
            </Link>
            {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
            {pages.map((page, index) => (
              <Link
                to="#"
                className={`pagination-page ${
                  index === pageActual && "active"
                }`}
                key={index}
                onClick={() => onPage(index)}
              >
                {index + 1}
              </Link>
            ))}
            {/* <Link to="#" aria-current="page" className="pagination-page active">
              1
            </Link>
            <Link to="#" className="pagination-page">
              2
            </Link>
            <Link
              to="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border-1 text-sm font-medium"
            >
              3
            </Link>
            <span className="relative inline-flex items-center px-4 py-2 border-1 border-gray-300 bg-white text-sm font-medium text-gray-700">
              ...
            </span>
            <Link
              to="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border-1 text-sm font-medium"
            >
              8
            </Link>
            <Link
              to="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border-1 text-sm font-medium"
            >
              9
            </Link>
            <Link
              to="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border-1 text-sm font-medium"
            >
              10
            </Link> */}
            <Link
              to="#"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border-1 border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <div
                className="h-5 w-5"
                aria-hidden="true"
                onClick={() =>
                  pageActual < totalPages - 1 && onPage(pageActual + 1)
                }
              >
                {" "}
                &gt;{" "}
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}