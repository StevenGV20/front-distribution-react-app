import React, { useState } from "react";
import { useFormik } from "formik";
import { putFetchFunction } from "../../../utils/funciones";
import { API_DISTRIBUCION } from "../../../utils/general";
import FormEditarLugarDespachoComponent from "../FormEditarLugarDespachoComponent";
import { AGRUPAR_ORDENES_DESPACHO_PAGE } from "../../../utils/properties.text";
const FormEditCargaOrdenDespachoComponent = ({
  ordenSelected,
  setOpenModal,
  setCarritoOrdenesDespacho,
  handleSelectRowToCart,
}) => {
  console.log(ordenSelected);
  const [lugaresDespachoSelected, setLugaresDespachoSelected] = useState({
    lug_cod: ordenSelected.odc_lugcod,
    ubi_desdep: ordenSelected.odc_desubigeo.split(",")[0] || "",
    ubi_desprv: ordenSelected.odc_desubigeo.split(",")[1] || "",
    ubi_desdis: ordenSelected.odc_desubigeo.split(",")[2] || "",
  });

  const [disabledBtnUpdate, setDisabledBtnUpdate] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: ordenSelected.id,
      odc_bultos: ordenSelected.odc_bultos || 0,
      odc_peso: ordenSelected.odc_peso || 0,
      odc_volumen: ordenSelected.odc_volumen || 0,
      odc_ranrec: ordenSelected.odc_ranrec || "",
      lugcod: ordenSelected.odc_lugcod || "",
      dirdes: ordenSelected.odc_dirdes || "",
      ubigeo: ordenSelected.odc_ubigeo || "",
      departamento: "",
      provincia: "",
      ubi_desprv: "",
      peso: ordenSelected.peso || 0,
    },
    // validate: (values) => {
    //   const errors = {};
    //   if (!(values.odc_volumen > 0))
    //     errors.odc_volumen = "Debes agregar el volumen a los item";

    //   if (!(values.odc_bultos > 0))
    //     errors.odc_bultos = "Debes agregar el bulto a los item";


    //   if (!values.ubigeo) errors.lugcod = "Debes elegir un lugar de despacho";

    //   return errors;
    // },
    onSubmit: (values) => {
      //alert(JSON.stringify(values, null, 2));
      setDisabledBtnUpdate(true);
      ordenSelected.odc_bultos = values.odc_bultos;
      ordenSelected.odc_peso = values.odc_peso;
      ordenSelected.odc_volumen = values.odc_volumen;
      ordenSelected.odc_ranrec = values.odc_ranrec;

      ordenSelected.odc_desubigeo =
        lugaresDespachoSelected.ubi_desdep +
        "," +
        lugaresDespachoSelected.ubi_desprv +
        "," +
        lugaresDespachoSelected.ubi_desdis;

      delete formik.values.departamento;
      delete formik.values.provincia;
      delete formik.values.ubi_desprv;

      ////console.log(values);

      const updateCarritoOD = (data) => {
        if (data.statusCode === 200) {
          let localODGroup =
            JSON.parse(localStorage.getItem("ODSAGRUPAR")) || [];

          let existsThis = localODGroup.filter((o) => o.id === values.id);
          //console.log(existsThis);
          ordenSelected.odc_lugcod = values.lugcod;
          ordenSelected.odc_dirdes = values.dirdes;
          ordenSelected.odc_ubigeo = values.ubigeo;

          if (existsThis.length > 0) {
            localODGroup = localODGroup.filter((o) => o.id !== values.id);
            localODGroup.push(ordenSelected);
            setCarritoOrdenesDespacho(localODGroup);
          }
          setOpenModal(false);
          //handleSelectRowToCart(ordenSelected);
        } else {
          setDisabledBtnUpdate(false);
        }
      };

      putFetchFunction(
        `${API_DISTRIBUCION}/ordenDespacho/updateCarga`,
        values,
        updateCarritoOD
      );
    },
  });

  return (
    <>
      <div className="modal-children-content">
        <div className="form-container text-black z-50 sm:grid-cols-8 sm:gap-y-0 sm:-mt-6">
          <div className="form-container-group-content sm:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-row col-span-1 items-center">
              <label htmlFor="" className="font-semibold  w-1/2">
                {
                  AGRUPAR_ORDENES_DESPACHO_PAGE.formParticionarOrdenesDespacho
                    .numOrden_label
                }
              </label>
              <input
                type="text"
                defaultValue={ordenSelected.odc_numodc}
                readOnly
                className="w-1/2"
              />
            </div>
            <div className="flex flex-row col-span-1 items-center">
              <label htmlFor="" className="font-semibold">
                {
                  AGRUPAR_ORDENES_DESPACHO_PAGE.formParticionarOrdenesDespacho
                    .cliente_label
                }
              </label>
              <input
                type="text"
                defaultValue={ordenSelected.aux_nomaux}
                readOnly
              />
            </div>
          </div>

          <div className="form-container-group-content sm:col-span-2">
            <input
              type="text"
              name="id"
              defaultValue={formik.values.id}
              hidden
            />
            <label className="form-container-group-content-label">
              Volumen (m3):
            </label>
            <div className="flex">
              <input
                type="number"
                name="odc_volumen"
                id="odc_volumen"
                value={formik.values.odc_volumen}
                onChange={formik.handleChange}
                autoComplete="given-name"
                className={`form-container-group-content-input ${
                  formik.errors.odc_volumen
                    ? "form-container-group-content-input-error"
                    : ""
                }`}
              />
            </div>
            {formik.errors.odc_volumen ? (
              <div className="text-sm text-red-500 col-span-2 text-center">
                {formik.errors.odc_volumen}
              </div>
            ) : null}
          </div>

          <div className="form-container-group-content sm:col-span-2">
            <label className="form-container-group-content-label">
              Bultos:
            </label>
            <div className="flex">
              <input
                type="number"
                value={formik.values.odc_bultos}
                onChange={formik.handleChange}
                name="odc_bultos"
                className={`form-container-group-content-input ${
                  formik.errors.odc_bultos
                    ? "form-container-group-content-input-error"
                    : ""
                }`}
              />
            </div>
            {formik.errors.odc_bultos ? (
              <div className="text-sm text-red-500 col-span-2 text-center">
                {formik.errors.odc_bultos}
              </div>
            ) : null}
          </div>

          <div className="form-container-group-content sm:col-span-2">
            <label className="form-container-group-content-label">Peso (Tn):</label>
            <div className="flex">
              <input
                type="number"
                value={formik.values.odc_peso}
                onChange={formik.handleChange}
                name="odc_peso"
                className={`form-container-group-content-input ${
                  formik.errors.odc_peso
                    ? "form-container-group-content-input-error"
                    : ""
                }`}
                disabled={true}
              />
            </div>
            {formik.errors.odc_peso ? (
              <div className="text-sm text-red-500 col-span-2 text-center">
                {formik.errors.odc_peso}
              </div>
            ) : null}
          </div>

          <div className="form-container-group-content sm:col-span-2">
            <label className="form-container-group-content-label">
              Rango de Hora:
            </label>
            <div className="flex">
              <input
                type="text"
                value={formik.values.odc_ranrec}
                onChange={formik.handleChange}
                name="odc_ranrec"
                className={`form-container-group-content-input ${
                  formik.errors.odc_ranrec
                    ? "form-container-group-content-input-error"
                    : ""
                }`}
              />
            </div>
            {formik.errors.odc_ranrec ? (
              <div className="text-sm text-red-500 col-span-2 text-center">
                {formik.errors.odc_ranrec}
              </div>
            ) : null}
          </div>
        </div>

        <FormEditarLugarDespachoComponent
          formik={formik}
          ordenSelected={ordenSelected}
          setOpenModal={setOpenModal}
          setCarritoOrdenesDespacho={setCarritoOrdenesDespacho}
          lugaresDespachoSelected={lugaresDespachoSelected}
          setLugaresDespachoSelected={setLugaresDespachoSelected}
        />
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
          type="submit"
          className="form-buttons-btn form-buttons-btn-red"
          onClick={formik.handleSubmit}
          disabled={disabledBtnUpdate}
        >
          Agregar
        </button>
      </div>
    </>
  );
};

export default FormEditCargaOrdenDespachoComponent;
