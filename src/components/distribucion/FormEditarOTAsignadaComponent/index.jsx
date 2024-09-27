import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";

import TimePickerCustomComponent from "../../widgets/TimePickerCustomComponent";
import {
  convertirDateToTimeString,
  convertirHoraFormato12,
  diferenciaHorasString,
  parseZonaHoraria,
  putFetchFunction,
} from "../../../utils/funciones";
import { API_DISTRIBUCION } from "../../../utils/general";

import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../../redux/features/utils/utilsSlice"
import { fetchRoles } from "../../../redux/features/combos/rolesDistribucionSlice";

const FormEditarOTAsignadaComponent = ({
  otSelected,
  reiniciarData,
  setRefreshTable,
  setOpenModal,
  trabajadorSelected,
}) => {
  const [btnDisabled, setBtnDisabled] = useState(false);

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };
  const [roles, setRoles] = useState([]);
  const rolesRedux = useSelector((state) => state.rolesDistribucionState.lista);

  useEffect(() => {
    if (!(rolesRedux.length > 0)) {
      dispatch(fetchRoles());
    }

    setRoles(rolesRedux);
  }, [rolesRedux]);

  const initialValues = {
    via_otrcod: otSelected.via_otrcod || "",
    tra_cmdrol: otSelected.tra_cmdrol || "",
    cmc_ingreso: otSelected.cmc_ingreso || "",
    cmc_salida: otSelected.cmc_salida || "",
    almuerzo: otSelected.cmc_comida === "S",
    cmc_hormod: 0,
    cmd_id: otSelected.cmd_id,
    cmc_id: otSelected.cmc_id,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      setBtnDisabled(true)
      values.cmc_comida = values.almuerzo ? "S" : "N";
      values.cmc_hormod =
        diferenciaHorasString(
          convertirDateToTimeString(new Date(values.cmc_ingreso)),
          convertirDateToTimeString(new Date(values.cmc_salida))
        ) - (values.almuerzo ? 1 : 0);
      values.cmc_hormoi = 0.0;
      values.cmc_horede = 0.0;
      values.cmc_ingreso = parseZonaHoraria(5, values.cmc_ingreso);
      values.cmc_salida = parseZonaHoraria(5, values.cmc_salida);

      delete values.almuerzo;

      const afterPut = (data) => {
        setBtnDisabled(false)
        //reiniciarData();
        setRefreshTable((prev) => !prev);
        setOpenModal(false);
      };
      putFetchFunction(
        `${API_DISTRIBUCION}/cuadreMano/modificarOTAsignada`,
        values,
        afterPut
      );
    },
    validate: (values) => {
      const errors = {};
      if (convertirDateToTimeString(values.cmc_ingreso) < convertirDateToTimeString(otSelected.via_partida))
        errors.cmc_ingreso = "La Hora de inicio no puede ser inferior a la hora de partida de la OT";

      if (convertirDateToTimeString(values.cmc_salida) < convertirDateToTimeString(otSelected.via_partida))
        errors.cmc_salida = "La Hora final no puede ser inferior a la hora de partida de la OT";

      if (convertirDateToTimeString(values.cmc_ingreso) > convertirDateToTimeString(otSelected.via_llegada))
        errors.cmc_ingreso = "La Hora de inicio no puede ser superior a la hora de llegada de la OT";

      if (convertirDateToTimeString(values.cmc_salida) > convertirDateToTimeString(otSelected.via_llegada))
        errors.cmc_salida = "La Hora final no puede ser superior a la hora de llegada de la OT";

      if (convertirDateToTimeString(values.cmc_ingreso) === convertirDateToTimeString(values.cmc_salida))
        errors.cmc_salida = "La Hora de inicio no puede ser igual a la hora final de trabajo";

      if (values.cmc_hormod < 0) errors.cmc_hormod = "No puede ser menor a 0";
      return errors;
    },
  });


  return (
    <div>
      <div className="form-container sm:grid-cols-4">
        <div className="form-container-group-content text-xs">
          <div className="form-container-group-content-input-mini">
            <span>Codigo de OT: </span>
            {formik.values.via_otrcod}
          </div>
        </div>

        <div className="form-container-group-content text-xs sm:col-span-2">
          <div className="form-container-group-content-input-mini">
            <span>Hora partida: </span>
            {convertirHoraFormato12(
              convertirDateToTimeString(otSelected.via_partida)
            )}
          </div>
        </div>

        <div className="form-container-group-content text-xs sm:col-span-2">
          <div className="form-container-group-content-input-mini">
            <span>Hora llegada: </span>
            {convertirHoraFormato12(
              convertirDateToTimeString(otSelected.via_llegada)
            )}
          </div>
        </div>

        <div className="form-container-group-content sm:col-span-4 text-xs pt-1">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Rol</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Rol"
              sx={{
                padding: "0",
                width: "100%",
                ".css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                  {
                    padding: "0.4em 1em",
                    paddingRight: "0",
                    borderRadius: "0px",
                    fontSize: "14px",
                    textAlign: "center",
                  },
                fieldset: {
                  border: "blue 1px solid",
                  borderRadius: "0.3em",
                },
              }}
              value={formik.values.tra_cmdrol}
              onChange={formik.handleChange}
              name="tra_cmdrol"
            >
              {roles &&
                roles.map((r) => (
                  <MenuItem value={r.id}>{r.rol_nombre}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>

        <div className="form-container-group-content sm:col-span-4 pt-1">
          <TimePickerCustomComponent
            labelTitle="Hora Inicio"
            styles={{ padding: "0.5em", width: "100%" }}
            valueTime={formik.values.cmc_ingreso}
            minTime={otSelected.via_partida}
            maxTime={otSelected.via_llegada}
            nameValue="cmc_ingreso"
            formik={formik}
          />
          {formik.errors.cmc_ingreso && (
            <span className="form-container-group-content-span-error">{formik.errors.cmc_ingreso}</span>
          )}
        </div>

        <div className="form-container-group-content sm:col-span-4 pt-1">
          <TimePickerCustomComponent
            labelTitle="Hora final"
            styles={{ padding: "0.5em", width: "100%" }}
            minTime={formik.values.cmc_ingreso}
            maxTime={otSelected.via_llegada}
            valueTime={formik.values.cmc_salida}
            nameValue="cmc_salida"
            formik={formik}
          />
          {formik.errors.cmc_salida && (
            <span className="form-container-group-content-span-error">{formik.errors.cmc_salida}</span>
          )}
        </div>

        <div className="form-container-group-content sm:col-span-2">
          <div>
            <FormControlLabel
              control={
                <Switch
                  onChange={(e) =>
                    formik.setFieldValue("almuerzo", e.target.checked)
                  }
                  checked={formik.values.almuerzo}
                />
              }
              sx={{ label: { fontSize: "10px" } }}
              label={"¿Almorzó?"}
            />
          </div>
        </div>

        <div className="form-container-group-content sm:col-span-2 pt-1">
          <TextField
            id="outlined-basic"
            label="Mano de Obra Directa"
            defaultValue={5}
            size="small"
            fullWidth={true}
            sx={{ fieldset: { border: "blue 1px solid" } }}
            value={
              diferenciaHorasString(
                convertirDateToTimeString(new Date(formik.values.cmc_ingreso)),
                convertirDateToTimeString(new Date(formik.values.cmc_salida))
              ) - (formik.values.almuerzo ? 1 : 0)
            }
            readOnly
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        {/* 
        <div className="form-container-group-content text-xs pt-1 flex w-full md:w-auto md:block">
          <div>MOD: {4}</div>
          <div>MOI: {5}</div>
          <div className="flex">
            <div>Est/Des:</div>
            <div>{3}</div>
          </div>
        </div> */}
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
          className={`form-buttons-btn form-buttons-btn-red ${btnDisabled && 'form-buttons-btn-disabled'}`}
          onClick={formik.handleSubmit}
          disabled={btnDisabled}
        >
          Asignar
        </button>
      </div>
    </div>
  );
};

export default FormEditarOTAsignadaComponent;
