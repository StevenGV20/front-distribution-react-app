import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchDepartamentos,
  fetchDistritos,
  fetchProvincias,
} from "../../../redux/features/combos/ubigeoSlice";

const ComboUbigeo = ({ formik }) => {
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [loadingDepartaments, setLoadingDepartaments] = useState(true);
  const [loadingProvincias, setLoadingProvincias] = useState(true);
  const [loadingDistritos, setLoadingDistritos] = useState(true);

  const dispatch = useDispatch();
  const departamentosRedux = useSelector((state) => state.ubigeoState.departamentos);
  const provinciasRedux = useSelector((state) => state.ubigeoState.provincias);
  const distritosRedux = useSelector((state) => state.ubigeoState.distritos);
  useEffect(() => {
    if (!(departamentosRedux.length > 0)) {
      dispatch(fetchDepartamentos());
    }
    if (!(provinciasRedux.length > 0)) {
      dispatch(fetchProvincias());
    }
    if (!(distritosRedux.length > 0)) {
      dispatch(fetchDistritos());
    }
    //////console.log(departamentosRedux);
    setDepartamentos(departamentosRedux);
    setLoadingDepartaments(false);
    if (formik.values.ubi_desdep) {
      handleSelectedDepartamento({
        target: { value: formik.values.ubi_desdep },
      });
      if (formik.values.ubi_desprv) {
        handleSelectedProvincias({
          target: { value: formik.values.ubi_desprv },
        });
      }
    }
  }, [departamentosRedux]);

  const handleSelectedDepartamento = (e) => {
    const departamento = e.target.value;
    formik.setFieldValue("ubi_desdep", departamento);
    const listPrv = provinciasRedux.filter(
      (p) => p.ubi_desdep === departamento
    );
    setProvincias(listPrv);
    setLoadingProvincias(false);
    setDistritos([]);
  };

  const handleSelectedProvincias = (e) => {
    const provincia = e.target.value;
    formik.setFieldValue("ubi_desprv", provincia);
    /* setDistritos([]); */
    const listDis = distritosRedux.filter((d) => d.ubi_desprv === provincia);
    setDistritos(listDis);
    setLoadingDistritos(false);
  };

  const handleSelectedDistrito = (e) => {
    //setDistritoSelected(distrito);
    const distrito = e.target.value;
    formik.setFieldValue("ubi_desdis", distrito.split("|")[1]);
    formik.setFieldValue("ubi_codubi", distrito.split("|")[0]);
  };

  return (
    <>
      <div className="form-container-group-content md:col-span-2">
        {/* <label
          htmlFor="ubi_desdep"
          className="form-container-group-content-label"
        >
          Departamento
        </label> */}
        <div className="">
          <input
            type="text"
            hidden
            defaultValue={formik.values.ruta}
            name="rut_codigo"
          />
          <input
            type="text"
            hidden
            defaultValue={formik.values.rud_usuupd}
            name="rud_usuupd"
          />

          <select
            type="text"
            name="ubi_desdep"
            id="ubi_desdep"
            value={formik.values.ubi_desdep}
            onChange={(e) => handleSelectedDepartamento(e)}
            autoComplete="given-name"
            className={`form-container-group-content-input ${
              formik.errors.ubi_desdep
                ? "form-container-group-content-input-error"
                : ""
            }`}
          >
            <option value="">[Sel. Departamento]</option>
            {!loadingDepartaments &&
              departamentos.map((d) => (
                <option key={d.ubi_desdep} value={d.ubi_desdep}>
                  {d.ubi_desdep}
                </option>
              ))}
          </select>
          {formik.errors.ubi_desdep && (
            <span className="form-container-group-content-span-error">
              {formik.errors.ubi_desdep}
            </span>
          )}
        </div>
      </div>

      <div className="form-container-group-content md:col-span-2">
        {/* <label
          htmlFor="ubi_desprv"
          className="form-container-group-content-label"
        >
          Provincia
        </label> */}
        <div className="">
          <select
            type="text"
            name="ubi_desprv"
            id="ubi_desprv"
            value={formik.values.ubi_desprv}
            onChange={(e) => handleSelectedProvincias(e)}
            autoComplete="given-name"
            className={`form-container-group-content-input ${
              formik.errors && formik.errors.ubi_desprv
                ? "form-container-group-content-input-error"
                : ""
            }`}
          >
            <option value="">[Sel. Provincia ]</option>
            {!loadingProvincias &&
              provincias.map((p) => (
                <option key={p.ubi_desprv} value={p.ubi_desprv}>
                  {p.ubi_desprv}
                </option>
              ))}
          </select>
          {formik.errors && formik.errors.ubi_desprv && (
            <span className="form-container-group-content-span-error">
              {formik.errors.ubi_desprv}
            </span>
          )}
        </div>
      </div>

      <div className="form-container-group-content md:col-span-2">
        {/* <label
          htmlFor="ubi_desdis"
          className="form-container-group-content-label"
        >
          Distrito
        </label> */}
        <div className="">
          <select
            type="text"
            name="ubi_desdis"
            id="ubi_desdis"
            value={formik.values.ubi_codubi + "|" + formik.values.ubi_desdis}
            onChange={(e) => handleSelectedDistrito(e)}
            autoComplete="given-name"
            className={`form-container-group-content-input ${
              formik.errors && formik.errors.ubi_desdis && !formik.values.ubi_desdis
                ? "form-container-group-content-input-error"
                : ""
            }`}
          >
            <option value={-1}>[Sel.  Distrito]</option>
            {!loadingDistritos &&
              distritos.map((p) => (
                <option
                  key={p.ubi_codubi}
                  value={p.ubi_codubi + "|" + p.ubi_desdis}
                >
                  {p.ubi_desdis}
                </option>
              ))}
          </select>
          {formik.errors && !formik.values.ubi_desdis && (
            <span className="form-container-group-content-span-error">
              {formik.errors.ubi_desdis}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default ComboUbigeo;
