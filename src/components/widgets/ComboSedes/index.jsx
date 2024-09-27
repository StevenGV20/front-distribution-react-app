import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchData } from "../../../redux/features/combos/sedeSlice";

const ComboSedes = ({ formik }) => {
  const sedesCombo = useSelector((state) => state.sedeState.lista);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!(sedesCombo.length > 0)) dispatch(fetchData());
  }, []);
  return (
    <>
      {/* <div className="form-container-group-content md:col-span-2 lg:col-span-3"> <label htmlFor="sed_codsed" className="form-container-group-content-label">
            Sede
          </label> */}
      <div className="">
        <select
          type="text"
          name="sed_codsed"
          id="sed_codsed"
          value={formik.values.sed_codsed}
          onChange={formik.handleChange}
          autoComplete="given-name"
          className={`form-container-group-content-input ${
            formik.errors.sed_codsed
              ? "form-container-group-content-input-error"
              : ""
          }`}
        >
          <option value="">[ Sel. Sede ]</option>
          {sedesCombo.map((sede) => (
            <option value={sede.sed_codsed} key={sede.sed_codsed}>
              {sede.sed_descor}
            </option>
          ))}
        </select>
        {formik.errors.sed_codsed && (
          <span className="form-container-group-content-span-error">
            {formik.errors.sed_codsed}
          </span>
        )}
      </div>
      {/* 
        </div> */}
    </>
  );
};

export default ComboSedes;
