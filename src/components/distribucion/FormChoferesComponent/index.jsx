import React, { useEffect, useState } from "react";

import { useFormik } from "formik";
import { API_MAESTRO, COD_CIA } from "../../../utils/general";
import { postFetchFunction } from "../../../utils/funciones";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/features/utils/utilsSlice";

const FormChoferesComponent = ({
  choferSelected,
  setChoferSelected,
  setOpenModal,
  setRefreshTable,
}) => {

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const formik = useFormik({
    initialValues: {
      id: choferSelected ? choferSelected.id : 0,
      cia_codcia: COD_CIA,
      cho_codcho: choferSelected ? choferSelected.cho_codcho : "",
      cho_nombre: choferSelected ? choferSelected.cho_nombre : "",
      cho_nrolic: choferSelected ? choferSelected.cho_nrolic : "",
      cho_indest: choferSelected ? choferSelected.cho_indest : "01",
      cho_codusu: choferSelected ? choferSelected.cho_codusu : "",
      cho_codemp: choferSelected ? choferSelected.cho_codemp : "",
      cho_nrodoc: choferSelected ? choferSelected.cho_nrodoc : "",
      cho_value1: choferSelected ? choferSelected.cho_value1 : "",
      cho_value2: choferSelected ? choferSelected.cho_value2 : "",
      cho_value3: choferSelected ? choferSelected.cho_value3 : "",
    },
    onSubmit: (values) => {
      ////console.log(JSON.stringify(values, null, 2));

      const postChofer = async () => {
        const result = await postFetchFunction(`${API_MAESTRO}/choferes/save`,values,setOpenMessage);
        ////console.log("result postChofer",result);
      }
      postChofer();
      setRefreshTable((prev) => !prev);
      setOpenModal(false);
      setChoferSelected(null);
    },
    validate: (values) => {
      const errors = {};
      if (!values.cho_codcho) {
        errors.cho_codcho = "Debes ingresar su codigo de chofer";
      }
      if (!values.cho_nombre) {
        errors.cho_nombre = "Debes ingresar sus nombres y apellidos completos";
      }
      if (!values.cho_nrolic) {
        errors.cho_nrolic = "Debes ingresar su número de licencia";
      }
      if (!values.cho_codusu) {
        errors.cho_codusu = "Debes ingresar su codigo de usuario";
      }
      return errors;
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-container modal-children-content">
        <div className="form-container-group-content">
          <input type="text" hidden defaultValue={formik.values.id} name="id" />
          <input type="text" hidden defaultValue={formik.values.cia_codcia} name="cia_codcia" />
          <label
            htmlFor="cho_codcho"
            className="form-container-group-content-label"
          >
            Codigo Chofer
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="cho_codcho"
              id="cho_codcho"
              value={formik.values.cho_codcho}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.cho_codcho
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.cho_codcho && (
              <span className="form-container-group-content-span-error">
                {formik.errors.cho_codcho}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label
            htmlFor="cho_nombre"
            className="form-container-group-content-label"
          >
            Nombre
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="cho_nombre"
              id="cho_nombre"
              value={formik.values.cho_nombre}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.cho_nombre
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.cho_nombre && (
              <span className="form-container-group-content-span-error">
                {formik.errors.cho_nombre}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label
            htmlFor="cho_nrolic"
            className="form-container-group-content-label"
          >
            Número de Licencia
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="cho_nrolic"
              id="cho_nrolic"
              value={formik.values.cho_nrolic}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.cho_nrolic
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.cho_nrolic && (
              <span className="form-container-group-content-span-error">
                {formik.errors.cho_nrolic}
              </span>
            )}
          </div>
        </div>

        <input type="text" hidden defaultValue={formik.values.cho_indest} />

        <div className="form-container-group-content">
          <label
            htmlFor="cho_codusu"
            className="form-container-group-content-label"
          >
            Codigo Usuario
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="cho_codusu"
              id="cho_codusu"
              value={formik.values.cho_codusu}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.cho_codusu
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.cho_codusu && (
              <span className="form-container-group-content-span-error">
                {formik.errors.cho_codusu}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label
            htmlFor="cho_codemp"
            className="form-container-group-content-label"
          >
            Codigo Empleado
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="cho_codemp"
              id="cho_codemp"
              value={formik.values.cho_codemp}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.cho_codemp
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.cho_codemp && (
              <span className="form-container-group-content-span-error">
                {formik.errors.cho_codemp}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label
            htmlFor="cho_nrodoc"
            className="form-container-group-content-label"
          >
            cho_nrodoc
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="cho_nrodoc"
              id="cho_nrodoc"
              value={formik.values.cho_nrodoc}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.cho_nrodoc
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.cho_nrodoc && (
              <span className="form-container-group-content-span-error">
                {formik.errors.cho_nrodoc}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label
            htmlFor="cho_value1"
            className="form-container-group-content-label"
          >
            cho_value1
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="cho_value1"
              id="cho_value1"
              value={formik.values.cho_value1}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.cho_value1
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.cho_value1 && (
              <span className="form-container-group-content-span-error">
                {formik.errors.cho_value1}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label
            htmlFor="cho_value2"
            className="form-container-group-content-label"
          >
            cho_value2
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="cho_value2"
              id="cho_value2"
              value={formik.values.cho_value2}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.cho_value2
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.cho_value2 && (
              <span className="form-container-group-content-span-error">
                {formik.errors.cho_value2}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label
            htmlFor="cho_value3"
            className="form-container-group-content-label"
          >
            cho_value3
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="cho_value3"
              id="cho_value3"
              value={formik.values.cho_value3}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.cho_value3
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.cho_value3 && (
              <span className="form-container-group-content-span-error">
                {formik.errors.cho_value3}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="form-buttons-container">
        <button
          type="button"
          className="form-buttons-btn form-buttons-btn-white"
          onClick={() => setOpenModal(false)}
        >
          Cancelar
        </button>
        <button type="submit" className="form-buttons-btn form-buttons-btn-red">
          Guardar
        </button>
      </div>
    </form>
  );
};

export default FormChoferesComponent;
