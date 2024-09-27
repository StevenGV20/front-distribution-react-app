import React, { Fragment, useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { fetchData } from "../../../redux/features/combos/sedeSlice";
import { API_MAESTRO, COD_CIA } from "../../../utils/general";
import { getFetchFunction, postFetchFunction } from "../../../utils/funciones";
import { ERRORS_TEXT } from "../../../utils/properties.error.text";
import { setMessage } from "../../../redux/features/utils/utilsSlice";

const FormUnidadesTransporteComponent = ({
  vehiculoSelected,
  setVehiculoSelected,
  setOpenModal,
  setRefreshTable,
}) => {
  const formik = useFormik({
    initialValues: {
      id: vehiculoSelected ? vehiculoSelected.id : 0,
      cia_codcia: COD_CIA,
      utr_codutr: vehiculoSelected ? vehiculoSelected.utr_codutr : "",
      utr_desutr: vehiculoSelected ? vehiculoSelected.utr_desutr : "",
      utr_plautr: vehiculoSelected ? vehiculoSelected.utr_plautr : "",
      utr_nrocer: vehiculoSelected ? vehiculoSelected.utr_nrocer : "",
      utr_marutr: vehiculoSelected ? vehiculoSelected.utr_marutr : "",
      utr_config: vehiculoSelected ? vehiculoSelected.utr_config : "",
      cho_codcho: vehiculoSelected ? vehiculoSelected.cho_codcho : "",
      utr_indest: vehiculoSelected ? vehiculoSelected.utr_indest : "1",
      utr_codusu: vehiculoSelected ? vehiculoSelected.utr_codusu : "",
      utr_conrep: vehiculoSelected ? vehiculoSelected.utr_conrep : 0,
      utr_coddec:
        vehiculoSelected && vehiculoSelected.length > 0
          ? vehiculoSelected.utr_coddec
          : "",
      tcv_codtcv:
        vehiculoSelected && vehiculoSelected.length > 0
          ? vehiculoSelected.tcv_codtcv
          : 0,
      utr_coduni: vehiculoSelected ? vehiculoSelected.utr_coduni : "",
      utr_tercero: vehiculoSelected ? vehiculoSelected.utr_tercero : "",
      utr_prvruc: vehiculoSelected ? vehiculoSelected.utr_prvruc : "",
      utr_prvrso: vehiculoSelected ? vehiculoSelected.utr_prvrso : "",
      utr_carvol: vehiculoSelected ? vehiculoSelected.utr_carvol : "",
      utr_carton: vehiculoSelected ? vehiculoSelected.utr_carton : "",
      acople: vehiculoSelected ? vehiculoSelected.acople : "",
    },
    onSubmit: (values) => {
      ////console.log(JSON.stringify(values, null, 2));

      const postVehiculo = async () => {
        const result = await postFetchFunction(
          `${API_MAESTRO}/unidadesTransporte/save`,
          values,
          setOpenMessage
        );
        setRefreshTable((prev) => !prev);
        ////console.log("result postChofer", result);
      };
      postVehiculo();
      setOpenModal(false);
      setVehiculoSelected(null);
    },
    validate: (values) => {
      const errors = {};
      if (!values.utr_codutr) {
        errors.utr_codutr =
          "Debes ingresar el codigo de la unidad de transporte";
      }
      /* if (!values.utr_desutr) {
        errors.utr_desutr =
          "Debes ingresar la descripcion de la unidad de transporte";
      } */
      if (!values.utr_plautr) {
        errors.utr_plautr =
          "Debes ingresar la placa de la unidad de transporte";
      }
      if (!values.utr_nrocer) {
        errors.utr_nrocer =
          "Debes ingresar el utr_nrocer de la unidad de transporte";
      }
      if (!values.utr_marutr) {
        errors.utr_marutr =
          "Debes ingresar el utr_marutr de la unidad de transporte";
      }
      if (!values.utr_config) {
        errors.utr_config =
          "Debes ingresar el utr_config de la unidad de transporte";
      }
      /* if (!values.utr_codusu) {
        errors.utr_codusu =
          "Debes ingresar el utr_codusu de la unidad de transporte";
      } */
      if (values.utr_conrep < 0) {
        errors.utr_conrep =
          "Debes ingresar el utr_conrep de la unidad de transporte";
      }
      if (!values.utr_tercero) {
        errors.utr_tercero = "Debes elegir el tipo de la unidad de transporte";
      }
      if (values.utr_tercero === "S" && !values.utr_prvruc) {
        errors.utr_prvruc = "Debes ingresar el ruc de la empresa proveedora";
      }
      if (values.utr_tercero === "S" && !values.utr_prvrso) {
        errors.utr_prvrso =
          "Debes ingresar la razón social de la empresa proveedora";
      }
      return errors;
    },
  });

  const sedesCombo = useSelector((state) => state.sedeState.lista);
  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const [choferes, setChoferes] = useState([]);
  const [loadingChoferes, setLoadingChoferes] = useState(true);

  useEffect(() => {
    if (!(sedesCombo.length > 0)) dispatch(fetchData());

    const fetchChoferes = async () => {
      try {
        await getFetchFunction(
          `${API_MAESTRO}/choferes/lista?orderby=nombre`,
          setLoadingChoferes,
          setChoferes
        ).then((data) => {
          if (
            typeof data !== "undefined" &&
            data.toString().includes("Failed to fetch")
          ) {
            setOpenMessage({
              state: true,
              message: ERRORS_TEXT.fetchError,
              type: "error",
            });
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchChoferes();
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-container modal-children-content">
        <input type="text" hidden name="id" defaultValue={formik.values.id} />
        <input
          type="text"
          hidden
          name="cia_codcia"
          defaultValue={formik.values.cia_codcia}
        />

        <div className="form-container-group-content">
          <label htmlFor="placa" className="form-container-group-content-label">
            Codigo
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="utr_codutr"
              id="utr_codutr"
              value={formik.values.utr_codutr}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.utr_codutr
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.utr_codutr && (
              <span className="form-container-group-content-span-error">
                {formik.errors.utr_codutr}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label htmlFor="placa" className="form-container-group-content-label">
            Descripcion
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="utr_desutr"
              id="utr_desutr"
              value={formik.values.utr_desutr}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.utr_desutr
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.utr_desutr && (
              <span className="form-container-group-content-span-error">
                {formik.errors.utr_desutr}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label htmlFor="placa" className="form-container-group-content-label">
            Placa
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="utr_plautr"
              id="utr_plautr"
              value={formik.values.utr_plautr}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.utr_plautr
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.utr_plautr && (
              <span className="form-container-group-content-span-error">
                {formik.errors.utr_plautr}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label htmlFor="placa" className="form-container-group-content-label">
            NroCer
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="utr_nrocer"
              id="utr_nrocer"
              value={formik.values.utr_nrocer}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.utr_nrocer
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.utr_nrocer && (
              <span className="form-container-group-content-span-error">
                {formik.errors.utr_nrocer}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label htmlFor="placa" className="form-container-group-content-label">
            Marca
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="utr_marutr"
              id="utr_marutr"
              value={formik.values.utr_marutr}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.utr_marutr
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.utr_marutr && (
              <span className="form-container-group-content-span-error">
                {formik.errors.utr_marutr}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label htmlFor="placa" className="form-container-group-content-label">
            Config
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="utr_config"
              id="utr_config"
              value={formik.values.utr_config}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.utr_config
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.utr_config && (
              <span className="form-container-group-content-span-error">
                {formik.errors.utr_config}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          {/* <input
            type="text"
            name="cho_codcho"
            id="cho_codcho"
            value={formik.values.cho_codcho}
            hidden
            readOnly
          /> */}
          <label
            htmlFor="cho_codcho"
            className="form-container-group-content-label"
          >
            Codigo Chofer
          </label>
          <div className="mt-2">
            <select
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
            >
              <option value="">[Seleccione]</option>
              {loadingChoferes ? (
                <></>
              ) : (
                choferes &&
                choferes.result.map((c) => (
                  <option key={c.cho_codcho} value={c.cho_codcho}>
                    {c.cho_nombre}
                  </option>
                ))
              )}
            </select>
            {formik.errors.cho_codcho && (
              <span className="form-container-group-content-span-error">
                {formik.errors.cho_codcho}
              </span>
            )}
          </div>
        </div>

        <input type="text" hidden defaultValue={formik.values.utr_indest} />

        <div className="form-container-group-content">
          <label
            htmlFor="utr_codusu"
            className="form-container-group-content-label"
          >
            Codigo Usuario
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="utr_codusu"
              id="utr_codusu"
              value={formik.values.utr_codusu}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.utr_codusu
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.utr_codusu && (
              <span className="form-container-group-content-span-error">
                {formik.errors.utr_codusu}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label
            htmlFor="utr_conrep"
            className="form-container-group-content-label"
          >
            utr_conrep
          </label>
          <div className="mt-2">
            <input
              type="number"
              name="utr_conrep"
              id="utr_conrep"
              value={formik.values.utr_conrep}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.utr_conrep
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.utr_conrep && (
              <span className="form-container-group-content-span-error">
                {formik.errors.utr_conrep}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label
            htmlFor="utr_coddec"
            className="form-container-group-content-label"
          >
            utr_coddec
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="utr_coddec"
              id="utr_coddec"
              value={formik.values.utr_coddec}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.utr_coddec
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.utr_coddec && (
              <span className="form-container-group-content-span-error">
                {formik.errors.utr_coddec}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label
            htmlFor="tcv_codtcv"
            className="form-container-group-content-label"
          >
            tcv_codtcv
          </label>
          <div className="mt-2">
            <input
              type="number"
              name="tcv_codtcv"
              id="tcv_codtcv"
              value={formik.values.tcv_codtcv}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.tcv_codtcv
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.tcv_codtcv && (
              <span className="form-container-group-content-span-error">
                {formik.errors.tcv_codtcv}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label
            htmlFor="utr_coduni"
            className="form-container-group-content-label"
          >
            utr_coduni
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="utr_coduni"
              id="utr_coduni"
              value={formik.values.utr_coduni}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.utr_coduni
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.utr_coduni && (
              <span className="form-container-group-content-span-error">
                {formik.errors.utr_coduni}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label
            htmlFor="utr_carvol"
            className="form-container-group-content-label"
          >
            Volumen máximo (m3):
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="utr_carvol"
              id="utr_carvol"
              value={formik.values.utr_carvol}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.utr_carvol
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.utr_carvol && (
              <span className="form-container-group-content-span-error">
                {formik.errors.utr_carvol}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label
            htmlFor="utr_carton"
            className="form-container-group-content-label"
          >
            Peso máximo (tn):
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="utr_carton"
              id="utr_carton"
              value={formik.values.utr_carton}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.utr_carton
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            />
            {formik.errors.utr_carton && (
              <span className="form-container-group-content-span-error">
                {formik.errors.utr_carton}
              </span>
            )}
          </div>
        </div>

        <div className="form-container-group-content">
          <label
            htmlFor="utr_tercero"
            className="form-container-group-content-label"
          >
            Tipo
          </label>
          <div className="mt-2">
            <select
              name="utr_tercero"
              id="utr_tercero"
              value={formik.values.utr_tercero}
              onChange={formik.handleChange}
              className={`form-container-group-content-input ${
                formik.errors.utr_tercero
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            >
              <option value="">[Seleccione]</option>
              <option value="N">Es de Decapolis</option>
              <option value="S">Es Tercero</option>
            </select>

            {formik.errors.utr_tercero && (
              <span className="form-container-group-content-span-error">
                {formik.errors.utr_tercero}
              </span>
            )}
          </div>
        </div>
        {formik.values.utr_tercero === "S" && (
          <>
            <div className="form-container-group-content">
              <label
                htmlFor="utr_prvruc"
                className="form-container-group-content-label"
              >
                RUC Proveedor
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="utr_prvruc"
                  id="utr_prvruc"
                  value={formik.values.utr_prvruc}
                  onChange={formik.handleChange}
                  autoComplete="given-name"
                  className={`form-container-group-content-input ${
                    formik.errors.utr_prvruc
                      ? "form-container-group-content-input-error"
                      : ""
                  }`}
                />
                {formik.errors.utr_prvruc && (
                  <span className="form-container-group-content-span-error">
                    {formik.errors.utr_prvruc}
                  </span>
                )}
              </div>
            </div>

            <div className="form-container-group-content">
              <label
                htmlFor="utr_prvrso"
                className="form-container-group-content-label"
              >
                Razon Social Proveedor
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="utr_prvrso"
                  id="utr_prvrso"
                  value={formik.values.utr_prvrso}
                  onChange={formik.handleChange}
                  autoComplete="given-name"
                  className={`form-container-group-content-input ${
                    formik.errors.utr_prvrso
                      ? "form-container-group-content-input-error"
                      : ""
                  }`}
                />
                {formik.errors.utr_prvrso && (
                  <span className="form-container-group-content-span-error">
                    {formik.errors.utr_prvrso}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
        
        <div className="form-container-group-content">
          <label
            htmlFor="cho_codcho"
            className="form-container-group-content-label"
          >
            Acople
          </label>
          <div className="mt-2">
            <select
              type="text"
              name="acople"
              id="acople"
              value={formik.values.acople}
              onChange={formik.handleChange}
              autoComplete="given-name"
              className={`form-container-group-content-input ${
                formik.errors.acople
                  ? "form-container-group-content-input-error"
                  : ""
              }`}
            >
              <option value="">[Seleccione]</option>
              <option value="0">NO</option>
              <option value="1">SI</option>
            </select>
            {formik.errors.acople && (
              <span className="form-container-group-content-span-error">
                {formik.errors.acople}
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

export default FormUnidadesTransporteComponent;
