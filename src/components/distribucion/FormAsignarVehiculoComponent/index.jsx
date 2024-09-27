import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";

import { InputLabel, TextareaAutosize } from "@mui/material";
import { useFormik } from "formik";

import {
  convertirDateTimeToDate,
  convertirDateToTimeString,
  postFetchFunctionCustomFunction,
} from "../../../utils/funciones";
import { API_DISTRIBUCION, USERNAME_LOCAL } from "../../../utils/general";
import { FORM_ASIGNAR_VEHICULO } from "../../../utils/properties.text";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/features/utils/utilsSlice";

const FormAsignarVehiculoComponent = ({
  vehiculos,
  viaje,
  setOpenModal,
  setRefreshTable,
}) => {
  const [vehiculoSelected, setVehiculoSelected] = useState(null);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleChange = (event) => {
    const v_selected = event.target.value;
    ////console.log(v_selected);
    setVehiculoSelected(v_selected);
    formik.setFieldValue("utr_codutr", v_selected.utr_codutr);
    formik.setFieldValue("utr_plautr", v_selected.utr_plautr);
    formik.setFieldValue("cho_codcho", v_selected.cho_codcho);
    formik.setFieldValue("vehiculo", v_selected);
  };

  const onAsignarVehiculo = () => {
    setOpenModal(false);
  };

  const dispatch = useDispatch()
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  registerLocale("es", es);
  setDefaultLocale("es");

  /**
   * Uso de formik para el control de formularios
   */
  const formik = useFormik({
    initialValues: {
      idviaje: viaje.idviaje,
      cia_codcia: viaje.cia_codcia || "01",
      sed_sedcod: viaje.sed_sedcod || "01",
      utr_plautr: viaje.utr_plautr || "",
      via_volumen: viaje.via_volumen || 0,
      via_bultos: viaje.via_bultos || 0,
      via_peso: viaje.via_peso || 0,
      via_monto: viaje.via_monto || 0,
      via_nroode: viaje.via_nroode || 0,
      cho_codcho: viaje.cho_codcho || "",
      via_desfech: convertirDateTimeToDate(viaje.via_desfch) || "",
      via_retfch: new Date(viaje.via_retfch) || new Date(viaje.via_desfch),
      via_deshor: dayjs(new Date()),
      fechaCarga: new Date(),
      horaCarga: dayjs(new Date()),
      via_carfch: "",
      via_palets: 0,
      via_observ: "",
      sed_codsed: "",
    },
    onSubmit: (values) => {
      setBtnDisabled(true);
      values.horaCarga = convertirDateToTimeString(values.horaCarga);
      values.via_deshor = convertirDateToTimeString(values.via_deshor);
      values.via_carfch = new Date(
        convertirDateTimeToDate(values.fechaCarga) + " " + values.horaCarga
      );
      values.via_updusu = USERNAME_LOCAL;
      values.sed_sedcod = values.sed_codsed;
      //alert(JSON.stringify(values, null, 2));
      const updateTable = () => {
        setBtnDisabled(false);
        setRefreshTable((prev) => !prev);
      };
      postFetchFunctionCustomFunction(
        `${API_DISTRIBUCION}/viaje/cerrarVehiculo`,
        values,
        setOpenMessage,
        updateTable
      );
      setOpenModal(false);
    },
    validate: (values) => {
      const errors = {};
      // if (!(values.via_volumen > 0)) {
      //   errors.via_volumen = "Debes asignar un grupo a este vehiculo.";
      // }
      /* if (values.horaCarga == formik.initialValues.horaCarga) {
        errors.horaCarga = "Debes elegir una hora de carga";
      }
      if (values.via_deshor == formik.initialValues.via_deshor) {
        errors.via_deshor = "Debes elegir una hora de salida";
      } */
      if (values.via_palets < 0) {
        errors.numeroPalets = "El numero de Palets no puede ser menor a 0";
        formik.setFieldValue("via_palets", 0);
      }
      if (!values.via_observ) {
        errors.via_observ = "Debes agregar una observacion.";
      }
      /* let today = new Date();
      if (
        !(
          convertirDateTimeToDate(values.fechaCarga) >=
          convertirDateTimeToDate(today)
        )
      ) {
        errors.fechaCarga =
          "La Fecha de carga debe ser mayor o igual a la fecha actual";
      }
      if (!(convertirDateTimeToDate(values.fechaCarga) <= values.via_desfech)) {
        errors.fechaCarga =
          "La Fecha de carga debe ser menor o igual a la fecha de salida";
      } */
      if (convertirDateTimeToDate(values.via_retfch) < values.via_desfech) {
        errors.via_retfch =
          "La Fecha de retorno no puede ser menor a la fecha de salida";
      }
      return errors;
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-container modal-children-content">
        <div className="col-span-1 sm:col-span-6 block sm:flex justify-between md:justify-start md:space-x-8 px-2 mb-2">
          <div className="text-sm flex space-x-2">
            <label className="font-semibold">
              {FORM_ASIGNAR_VEHICULO.vehiculo_label}
            </label>
            <div>{formik.values.utr_plautr}</div>
          </div>
          <div className="text-sm flex space-x-2">
            <div className="font-semibold">
              {FORM_ASIGNAR_VEHICULO.volumen_label}
            </div>
            <div className="flex">{formik.values.via_volumen}</div>
          </div>
          <div className="text-sm flex space-x-2">
            <label className="font-semibold">
              {FORM_ASIGNAR_VEHICULO.fechaSalida_label}
            </label>
            <div>{formik.values.via_desfech}</div>
          </div>
        </div>

        {/* <div className="form-details-content-group sm:col-span-6 md:col-span-2">
          <label className="form-container-group-content-label">
            {FORM_ASIGNAR_VEHICULO.vehiculo_label}
          </label>
          <div>
            <input
              type="text"
              defaultValue={formik.values.utr_plautr}
              name="gru_grucod"
              readOnly
              className=""
            />
          </div>
        </div>
        <div className="form-details-content-group sm:col-span-6 md:col-span-2 flex">
          <div className="form-container-group-content-label flex w-52">
            {FORM_ASIGNAR_VEHICULO.volumen_label}
          </div>
          <div className="flex">
            <input
              type="text"
              defaultValue={formik.values.via_volumen}
              name="gru_volumen"
              readOnly
              className="text-sm"
            />
          </div>
          {formik.errors.via_volumen ? (
            <span className="text-xs text-red-500">
              {formik.errors.via_volumen}
            </span>
          ) : null}
        </div>

        <div className="form-details-content-group xs:col-span-6 md:col-span-2">
          <label className="form-container-group-content-label">
            {FORM_ASIGNAR_VEHICULO.fechaSalida_label}
          </label>
          <input
            type="text"
            defaultValue={formik.values.via_desfech}
            readOnly
          />
        </div> */}

        <div className="form-container-group-content sm:col-span-2">
          <label className="form-container-group-content-label">
            {FORM_ASIGNAR_VEHICULO.fechaRetorno_label}
          </label>
          <div>
            <DatePicker
              selected={formik.values.via_retfch}
              value={formik.values.via_retfch}
              onChange={(date) => formik.setFieldValue("via_retfch", date)}
              minDate={new Date(viaje.via_desfch)}
              locale="es"
              name="via_retfch"
              id="via_retfch"
              dateFormat="dd/MM/yyyy"
              popperPlacement="bottom-end"
              className={`form-container-group-content-input py-3 ${
                formik.errors.via_retfch
                  ? "form-container-group-content-input-error"
                  : "border-blue-700"
              }`}
            />
            {formik.errors.via_retfch ? (
              <span className="text-xs text-red-500">
                {formik.errors.via_retfch}
              </span>
            ) : null}
          </div>
        </div>
        <div className="form-container-group-content sm:col-span-2">
          <label className="form-container-group-content-label">
            {FORM_ASIGNAR_VEHICULO.horaSalida_label}
          </label>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                defaultValue={formik.values.via_deshor}
                onChange={(time) => formik.setFieldValue("horaSalida", time)}
                name="horaSalida"
                className="form-container-group-content-input"
              />
            </LocalizationProvider>
            {formik.errors.via_deshor ? (
              <span className="text-xs text-red-500">
                {formik.errors.via_deshor}
              </span>
            ) : null}
          </div>
        </div>
        <div className="form-container-group-content sm:col-span-2">
          <label className="form-container-group-content-label">
            {FORM_ASIGNAR_VEHICULO.nPalets_label}
          </label>
          <div>
            <input
              type="number"
              className="form-container-group-content-input py-3"
              value={formik.values.via_palets}
              name="via_palets"
              onChange={formik.handleChange}
            />
            {formik.errors.via_palets ? (
              <span className="text-xs text-red-500">
                {formik.errors.via_palets}
              </span>
            ) : null}
          </div>
        </div>
        <div className="form-container-group-content sm:col-span-2">
          <label className="form-container-group-content-label">
            {FORM_ASIGNAR_VEHICULO.fechaCarga_label}
          </label>
          <div className="w-full">
          {/* minDate={new Date()} */}
            <DatePicker
              selected={formik.values.fechaCarga}
              value={formik.values.fechaCarga}
              onChange={(time) => formik.setFieldValue("fechaCarga", time)}
              locale="es"
              
              name="fechaCarga"
              dateFormat="dd/MM/yyyy"
              popperPlacement="bottom-end"
              className={`form-container-group-content-input w-full py-3 ${
                formik.errors.fechaCarga
                  ? "form-container-group-content-input-error"
                  : "border-blue-700"
              }`}
            />
          </div>
          {formik.errors.fechaCarga ? (
            <div className="text-xs text-red-500">
              {formik.errors.fechaCarga}
            </div>
          ) : null}
        </div>

        <div className="form-container-group-content sm:col-span-2">
          <label className="form-container-group-content-label">
            {FORM_ASIGNAR_VEHICULO.horaCarga_label}
          </label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
              defaultValue={formik.values.horaCarga}
              name="horaCarga"
              onChange={(time) => formik.setFieldValue("horaCarga", time)}
              className="form-container-group-content-input"
              sx={{}}
            />
          </LocalizationProvider>
          {formik.errors.horaCarga ? (
            <div className="text-xs text-red-500">
              {formik.errors.horaCarga}
            </div>
          ) : null}
        </div>
        {/* <ComboSedes formik={formik} /> */}
        <div className="form-container-group-content col-span-3 sm:col-span-6">
          <label htmlFor="" className="w-full">
            {FORM_ASIGNAR_VEHICULO.observacion_label}
          </label>
          <TextareaAutosize
            minRows={4}
            className={`form-container-group-content-input px-4 py-2 ${
              formik.errors.via_observ &&
              "form-container-group-content-input-error"
            }`}
            value={formik.values.via_observ}
            name="via_observ"
            onChange={formik.handleChange}
          />
          {formik.errors.via_observ ? (
            <span className="text-xs text-red-500">
              {formik.errors.via_observ}
            </span>
          ) : null}
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 md:columns-2">
        <button
          type="submit"
          className={`form-buttons-btn form-buttons-btn-red sm:ml-3 ${
            btnDisabled && "form-buttons-btn-disabled"
          }`}
          disabled={btnDisabled}
        >
          Aceptar
        </button>
        <button
          type="button"
          className="form-buttons-btn form-buttons-btn-white sm:mt-0 items-center"
          onClick={() => onAsignarVehiculo()}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormAsignarVehiculoComponent;
