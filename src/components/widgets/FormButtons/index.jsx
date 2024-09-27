import React from "react";

const FormButtons = ({
  numButtons = 2,
  onCancel = () => {},
  onAccept = () => {},
  titleCancel = "",
  titleAccept = "",
  btnDisabled = false,
}) => {
  return (
    <>
      {numButtons == 1 ? (
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 md:columns-2">
          <button
            type="button"
            className="flex w-full col-span-1 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3"
            onClick={() => onAccept()}
          >
            {titleAccept}
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 md:columns-2">
          <button
            type="button"
            disabled={btnDisabled}
            className={`flex w-full col-span-1 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 ${
              btnDisabled ? "bg-red-500 opacity-60" : "hover:bg-red-500 "
            }`}
            onClick={() => onAccept()}
          >
            {titleAccept}
          </button>
          <button
            type="button"
            className="flex w-full col-span-1 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 items-center"
            onClick={() => onCancel()}
          >
            {titleCancel}
          </button>
        </div>
      )}
    </>
  );
};

export default FormButtons;
