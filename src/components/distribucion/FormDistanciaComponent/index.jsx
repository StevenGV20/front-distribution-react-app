import React, { useEffect } from "react";
import { useFormik } from "formik";

import { API_DISTRIBUCION, USERNAME_LOCAL } from "../../../utils/general";
import ComboUbigeo from "../../widgets/ComboUbigeo";
import { postFetchFunction } from "../../../utils/funciones";
import ComboSedes from "../../widgets/ComboSedes";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/features/utils/utilsSlice";

const FormDistanciaComponent = ({
  distanciaSelected,
  setDistanciaSelected,
  setOpenModal,
  setRefreshTable
}) => {
  
  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const formik = useFormik({
    initialValues: {
      sed_codsed: distanciaSelected ? distanciaSelected.sed_codsed : "",
      ubi_codubi: distanciaSelected ? distanciaSelected.ubi_codubi : "",
      ubi_des: distanciaSelected ? distanciaSelected.ubi_des : "",
      ruk_kilometros: distanciaSelected ? distanciaSelected.ruk_kilometros : "",
      ruk_usuupd: USERNAME_LOCAL,
      ubi_desdis: distanciaSelected ? distanciaSelected.ubi_des.split(", ")[0] : "",
      ubi_desprv: distanciaSelected ? distanciaSelected.ubi_des.split(", ")[1] : "",
      ubi_desdep: distanciaSelected ? distanciaSelected.ubi_des.split(", ")[2] : "",
    },
    onSubmit: (values) => {
      //alert(JSON.stringify(values, null, 2));
      const postRutaDistancia = async () => {
        const result = await postFetchFunction(
          `${API_DISTRIBUCION}/ruta/saveDistancia`,
          values,
          setOpenMessage
        );
        setRefreshTable((prev) => !prev);
        ////console.log("result postChofer", result);
      };
      postRutaDistancia();
      setOpenModal(false);
      /* setOpenModal(false);
      setDistanciaSelected(null); */
    },
    validate: (values) => {
      const errors = {};
      if (!values.sed_codsed) {
        errors.sed_codsed = "Debes seleccionar una sede";
      }
      if (values.ubi_desdis==="") {
        errors.ubi_desdis = "Debes escoger un distrito";
      }
      if (!values.ruk_kilometros) {
        errors.ruk_kilometros = "Debes ingresar los kilometros";
      }
      else if (!(values.ruk_kilometros > 0)) {
        errors.ruk_kilometros = "Debes ingresar kilometros mayor a 0";
      }
      return errors;
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-container modal-children-content items-center">
      <div className="form-container-group-content md:col-span-2">
        <ComboSedes formik={formik}/>
        </div>
        <ComboUbigeo formik={formik} />
        <div className="form-container-group-content">
          {/* <label
            htmlFor="ruk_kilometros"
            className="form-container-group-content-label"
          >
            Kilometros
          </label> */}
          <div className="mt-2">
            <input
              type="number"
              name="ruk_kilometros"
              id="ruk_kilometros"
              placeholder="Kilometros"
              value={formik.values.ruk_kilometros}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.ruk_kilometros
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.ruk_kilometros && (
              <span className="form-container-group-content-span-error">
                {formik.errors.ruk_kilometros}
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

export default FormDistanciaComponent;
