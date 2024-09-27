import { useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SlideOverComponent from "../SlideOverComponent";

const FilterComponent = ({
  title,
  children,
  showBtnFilter = true,
  showBtnAccept,
  onSearch,
}) => {
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <>
      {showBtnFilter && (
        <div className="w-5">
          <button onClick={() => setOpenFilter(true)}>
            <FilterAltIcon className="text-blue-600" />
          </button>
        </div>
      )}
      <SlideOverComponent
        open={openFilter}
        setOpen={setOpenFilter}
        title={title}
      >
        <div className="filter-content">{children}</div>
        <button
          className="bg-black w-full py-2 text-white my-4 rounded-md"
          onClick={() => onSearch()}
        >
          Buscar
        </button>
      </SlideOverComponent>
    </>
  );
};

export default FilterComponent;
