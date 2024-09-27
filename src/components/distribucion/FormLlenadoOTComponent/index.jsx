import React, { useState } from "react";
import { useFormik } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";

import { LLENADO_OT_PAGE } from "../../../utils/properties.text";
import {
  convertirDateToTimeString,
  convertirTimeStringToDate,
  diferenciaHorasString,
  putFetchFunction,
} from "../../../utils/funciones";
import { API_DISTRIBUCION, USERNAME_LOCAL } from "../../../utils/general";
import { FormControlLabel, Switch } from "@mui/material";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/features/utils/utilsSlice";

const FormLlenadoOTComponent = ({
  setOpenModal,
  viaje,
  setRefreshTable,
}) => {
  const dispatch = useDispatch();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const formik = useFormik({
    initialValues: {
      idviaje: viaje.idviaje,
      horaInicial:
        (viaje.via_partida && dayjs(viaje.via_partida)) || dayjs(new Date()),
      horaFinal:
        (viaje.via_llegada && dayjs(viaje.via_llegada)) || dayjs(new Date()),
      via_tot_horas: viaje.via_tot_horas || 0,
      via_klmini: viaje.via_klmini || 0,
      via_klmfin: viaje.via_klmfin || 0,
      via_tot_klm: viaje.via_tot_klm || 0,
      via_partida: viaje.via_partida,
      via_llegada: viaje.via_llegada,
      via_otrcod: viaje.via_otrcod,
      cia_codcia: viaje.cia_codcia,
      via_updusu: USERNAME_LOCAL,
      almuerzo:
        viaje.via_tot_horas -
          diferenciaHorasString(
            convertirDateToTimeString(dayjs(viaje.via_partida)),
            convertirDateToTimeString(dayjs(viaje.via_llegada))
          ) !==
        0,
    },
    onSubmit: (values) => {
      //setOpenModal(false);
      setBtnDisabled(true);
      values.via_partida = convertirDateToTimeString(dayjs(values.horaInicial));
      values.via_llegada = convertirDateToTimeString(dayjs(values.horaFinal));
      values.via_tot_horas =
        diferenciaHorasString(
          convertirDateToTimeString(dayjs(values.horaInicial)),
          convertirDateToTimeString(dayjs(values.horaFinal))
        ) - (values.almuerzo ? 1 : 0);
      values.via_tot_klm = values.via_klmfin - values.via_klmini;

      /* //console.log(convertirDateToTimeString(dayjs(values.horaInicial)));
      //console.log(values); */

      const afterUpdate = (data) => {
        setOpenModal(false);
        setBtnDisabled(false);
        setRefreshTable((prev) => !prev);
        dispatch(
          setMessage({
            state: true,
            message: data.mensaje,
            type: data.status.toLowerCase(),
          })
        );
      };
      putFetchFunction(
        `${API_DISTRIBUCION}/viaje/registroHorasOT`,
        values,
        afterUpdate
      );
    },
    validate: (values) => {
      const errors = {};
      if (!values.horaInicial.isValid()) {
        errors.horaInicial = "Este campo es obligatorio";
      }
      if (!values.horaFinal.isValid()) {
        errors.horaFinal = "Este campo es obligatorio";
      }
      if (!values.via_klmini) {
        errors.via_klmini = "Este campo es obligatorio";
      }
      if (!values.via_klmfin) {
        errors.via_klmfin = "Este campo es obligatorio";
      }

      if (!(values.via_klmini >= 0)) {
        errors.via_klmini = "El kilometraje inicial no puede ser menor a 0";
      }
      if (!(values.via_klmfin >= 0)) {
        errors.via_klmfin = "El kilometraje final no puede ser menor a 0";
      }
      if (!(dayjs(values.horaInicial) < dayjs(values.horaFinal))) {
        errors.horaFinal =
          "La hora final no puede ser menor o igual a la hora inicial";
      }
      if (values.via_klmfin < values.via_klmini) {
        errors.via_klmfin =
          "El kilometraje final no puede ser menor al kilometraje inicial";
      }
      return errors;
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-container modal-children-content">
        <div className="form-container-group-content sm:col-span-2">
          <label className="form-container-group-content-label">
            {LLENADO_OT_PAGE.formLlenadoOT.horaInicio_label}
          </label>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                defaultValue={formik.values.horaInicial}
                onChange={(time) => formik.setFieldValue("horaInicial", time)}
                name="horaInicial"
                className={`form-container-group-content-input ${
                  formik.errors.horaInicial &&
                  "form-container-group-content-input-error"
                }`}
              />
            </LocalizationProvider>
            {formik.errors.horaInicial ? (
              <span className="text-xs text-red-500">
                {formik.errors.horaInicial}
              </span>
            ) : null}
          </div>
        </div>
        <div className="form-container-group-content sm:col-span-2">
          <label className="form-container-group-content-label">
            {LLENADO_OT_PAGE.formLlenadoOT.horaFinal_label}
          </label>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                defaultValue={formik.values.horaFinal}
                onChange={(time) => formik.setFieldValue("horaFinal", time)}
                name="horaFinal"
                className={`form-container-group-content-input ${
                  formik.errors.horaFinal &&
                  "form-container-group-content-input-error"
                }`}
                minTime={dayjs(formik.values.horaInicial)}
              />
            </LocalizationProvider>
            {formik.errors.horaFinal ? (
              <span className="text-xs text-red-500">
                {formik.errors.horaFinal}
              </span>
            ) : null}
          </div>
        </div>
        <div className="form-container-group-content sm:col-span-1">
          <label className="form-container-group-content-label">
            {LLENADO_OT_PAGE.formLlenadoOT.almuerzo_label}
          </label>
          <div>
            <FormControlLabel
              control={
                <Switch
                  onChange={(e) =>
                    formik.setFieldValue("almuerzo", e.target.checked)
                  }
                  checked={formik.values.almuerzo}
                  name="almuerzo"
                />
              }
              label={formik.values.almuerzo ? "SI" : "NO"}
            />
          </div>
        </div>
        <div className="form-container-group-content sm:col-span-1">
          <label className="form-container-group-content-label">
            {LLENADO_OT_PAGE.formLlenadoOT.horas_label}
          </label>
          <div>
            <input
              type="number"
              className={`form-container-group-content-input py-4 ${
                formik.errors.via_tot_horas &&
                "form-container-group-content-input-error"
              }`}
              value={(
                diferenciaHorasString(
                  convertirDateToTimeString(dayjs(formik.values.horaInicial)),
                  convertirDateToTimeString(dayjs(formik.values.horaFinal))
                ) - (formik.values.almuerzo ? 1 : 0)
              ).toFixed(2)}
              name="via_tot_horas"
              onChange={formik.handleChange}
              readOnly
            />
            {formik.errors.via_tot_horas ? (
              <span className="text-xs text-red-500">
                {formik.errors.via_tot_horas}
              </span>
            ) : null}
          </div>
        </div>

        <div className="form-container-group-content sm:col-span-2">
          <label className="form-container-group-content-label">
            {LLENADO_OT_PAGE.formLlenadoOT.kmInicial_label}
          </label>
          <div>
            <input
              type="number"
              className={`form-container-group-content-input py-4 ${
                formik.errors.via_klmini &&
                "form-container-group-content-input-error"
              }`}
              value={formik.values.via_klmini}
              name="via_klmini"
              onChange={formik.handleChange}
            />
            {formik.errors.via_klmini ? (
              <span className="text-xs text-red-500">
                {formik.errors.via_klmini}
              </span>
            ) : null}
          </div>
        </div>
        <div className="form-container-group-content sm:col-span-2">
          <label className="form-container-group-content-label">
            {LLENADO_OT_PAGE.formLlenadoOT.kmFinal_label}
          </label>
          <div>
            <input
              type="number"
              className={`form-container-group-content-input py-4 ${
                formik.errors.via_klmfin &&
                "form-container-group-content-input-error"
              }`}
              value={formik.values.via_klmfin}
              name="via_klmfin"
              onChange={formik.handleChange}
            />
            {formik.errors.via_klmfin ? (
              <span className="text-xs text-red-500">
                {formik.errors.via_klmfin}
              </span>
            ) : null}
          </div>
        </div>
        <div className="form-container-group-content sm:col-span-2">
          <label className="form-container-group-content-label">
            {LLENADO_OT_PAGE.formLlenadoOT.kmRecorrido_label}
          </label>
          <div>
            <input
              type="number"
              className={`form-container-group-content-input py-4 ${
                formik.errors.via_tot_klm &&
                "form-container-group-content-input-error"
              }`}
              value={formik.values.via_klmfin - formik.values.via_klmini}
              name="via_tot_klm"
              onChange={formik.handleChange}
              readOnly
            />
            {formik.errors.via_tot_klm ? (
              <span className="text-xs text-red-500">
                {formik.errors.via_tot_klm}
              </span>
            ) : null}
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
          type="submit"
          className={`form-buttons-btn form-buttons-btn-red ${
            btnDisabled && "form-buttons-btn-disabled"
          }`}
          disabled={btnDisabled}
        >
          Aceptar
        </button>
      </div>
    </form>
  );
};

export default FormLlenadoOTComponent;
