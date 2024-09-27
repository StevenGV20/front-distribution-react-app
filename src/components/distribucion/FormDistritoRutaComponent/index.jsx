import React from "react";
import { useFormik } from "formik";

const FormDistritoRutaComponent = ({
  distritoSelected,
  setDistritoSelected,
  setOpenModal,
}) => {
  const formik = useFormik({
    initialValues: {
      codigoRuta: distritoSelected ? distritoSelected.codigoRuta : "",
      distrito: distritoSelected ? distritoSelected.distrito : "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      setOpenModal(false);
      setDistritoSelected(null);
    },
    validate: (values) => {
      const errors = {};
      if (!values.codigoRuta) {
        errors.codigoRuta = "Debes seleccionar una ruta";
      }
      if (!values.distrito) {
        errors.distrito = "Debes ingresar un distrito";
      }
      return errors;
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-container">
        <div className="form-container-group-content">
          <label
            htmlFor="codigoRuta"
            className="form-container-group-content-label"
          >
            Codigo de Ruta
          </label>
          <div className="mt-2">
            <select
              type="text"
              name="codigoRuta"
              id="codigoRuta"
              value={formik.values.codigoRuta}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.codigoRuta
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            >
              <option value="">[ Seleecione ]</option>
              <option value="RUTA01">RUTA01</option>
              <option value="RUTA01">RUTA01</option>
            </select>
            {formik.errors.codigoRuta && (
              <span className="form-container-group-content-span-error">
                {formik.errors.codigoRuta}
              </span>
            )}
          </div>
        </div>
        <div className="form-container-group-content">
          <label
            htmlFor="distrito"
            className="form-container-group-content-label"
          >
            Distrito
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="distrito"
              id="distrito"
              value={formik.values.distrito}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.distrito
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.distrito && (
              <span className="form-container-group-content-span-error">
                {formik.errors.distrito}
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

export default FormDistritoRutaComponent;
