import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import ComboSedes from "../../widgets/ComboSedes";
import ComboUbigeo from "../../widgets/ComboUbigeo";
import { API_DISTRIBUCION } from "../../../utils/general";
import { postFetchFunctionCustomFunction } from "../../../utils/funciones";

export default function FormAgregarGrupoComponent({
  setOpenModal,
  fechaSalida,
  setOpenMessage,
  setRefreshTable,
}) {
  const formik = useFormik({
    initialValues: {
      cia_codcia: "01",
      sed_codsed: "",
      sed_sedcod: "",
      ubi_codubi: "",
      ubi_des: "",
      gru_desfch: fechaSalida,
      gru_observ: 0,
      gru_volumen: 0,
      gru_bultos: 0,
      gru_peso: 0,
      gru_monto: 0,
      ubi_desdis: "",
      ubi_desprv: "",
      ubi_desdep: "",
      gru_ubigeo: "",
      provincia: 0,
      gru_nroode: 0,
      gru_dirdes: "",
      gru_insusu: localStorage.getItem("USERNAME"),
    },
    onSubmit: (values) => {
      setBtnDisabled(true);

      values.gru_ubigeo = values.ubi_codubi;
      values.sed_sedcod = values.sed_codsed;

      delete values.ubi_desdep;
      delete values.ubi_desprv;
      delete values.ubi_desdis;
      delete values.ubi_codubi;
      delete values.ubi_des;

      let data = { grupo: values, listaOds: "" };

      // alert(JSON.stringify(values, null, 2));

      const afterPost = (data) => {
        if (data.statusCode === 200) {
          setTimeout(() => {
            setRefreshTable((prev) => !prev);
            setOpenModal(false);
            setBtnDisabled(false);
          }, 3000);
        }
      };
      postFetchFunctionCustomFunction(
        `${API_DISTRIBUCION}/grupo/save`,
        data,
        setOpenMessage,
        afterPost
      );
    },
    validate: (values) => {
      const errors = {};
      if (!values.sed_codsed) {
        errors.sed_codsed = "Debes seleccionar una sede";
      }
      if (!values.ubi_desdis) {
        errors.ubi_desdis = "Debes escoger un distrito";
      }
      return errors;
    },
  });

  const [btnDisabled, setBtnDisabled] = useState(false);

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="modal-children-content">
        <div className="form-container text-black z-50 sm:grid-cols-1 sm:gap-y-0">
          <div className="form-container-group-content grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-x-2">
            <div className="block col-span-1 items-center">
              <label htmlFor="" className="font-semibold">
                Sede
              </label>
              <ComboSedes formik={formik} />
            </div>
            <div className="block col-span-1 items-center">
              <label htmlFor="" className="font-semibold">
                Volumen
              </label>
              <input
                type="text"
                name="gru_volumen"
                className="form-container-group-content-input"
                value={formik.values.gru_volumen}
                onChange={formik.handleChange}
              />
            </div>
            <div className="block col-span-1 items-center">
              <label htmlFor="" className="font-semibold">
                Bulto
              </label>
              <input
                type="text"
                name="gru_bultos"
                className="form-container-group-content-input"
                value={formik.values.gru_bultos}
                onChange={formik.handleChange}
              />
            </div>
            <div className="block col-span-1 items-center">
              <label htmlFor="" className="font-semibold">
                Peso
              </label>
              <input
                type="text"
                name="gru_peso"
                className="form-container-group-content-input"
                value={formik.values.gru_peso}
                onChange={formik.handleChange}
              />
            </div>
            <div className="block col-span-1 items-center">
              <label htmlFor="" className="font-semibold">
                Monto
              </label>
              <input
                type="text"
                name="gru_monto"
                className="form-container-group-content-input"
                value={formik.values.gru_monto}
                onChange={formik.handleChange}
              />
            </div>
          </div>
          <div className="col-span-5 items-center">
            <label htmlFor="" className="font-semibold">
              Distrito más lejano
            </label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <ComboUbigeo formik={formik} />
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
          <button
            type="button"
            onClick={formik.handleSubmit}
            className={`form-buttons-btn form-buttons-btn-red ${
              btnDisabled && "form-buttons-btn-disabled"
            }`}
            disabled={btnDisabled}
          >
            Aceptar
          </button>
        </div>
      </form>
    </>
  );
}
