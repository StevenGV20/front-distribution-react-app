import React, { useEffect, useState } from "react";
import { useFormik } from "formik";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { LLENADO_OT_PAGE } from "../../../utils/properties.text";
import TableCustom from "../../widgets/TableComponent";
import {
  convertirDateToTimeString,
  getFetchFunction,
  ordenarAlfabeticamente,
  parseZonaHoraria,
  putFetchFunction,
} from "../../../utils/funciones";
import { API_DISTRIBUCION, USERNAME_LOCAL } from "../../../utils/general";
import { ERRORS_TEXT } from "../../../utils/properties.error.text";
import FormButtons from "../../widgets/FormButtons";
import { TimePicker } from "@mui/x-date-pickers";
import TimePickerCustomComponent from "../../widgets/TimePickerCustomComponent";
import ExportarExcelAPIComponent from "../../widgets/ExportarExcelComponent/exportacionByAPI";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/features/utils/utilsSlice";



const FormLlenadoGRTComponent = ({ viaje, setOpenModal }) => {
  const [loadingTableGuias, setLoadingTableGuias] = useState(true);
  const [guiasTransportista, setGuiasTransportista] = useState([]);
  const [guiaSelected, setGuiaSelected] = useState();
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [showInUtc, setShowInUtc] = useState(false);
  const [showRowEditable, setShowRowEditable] = useState(false);
  const dispatch = useDispatch()
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault("America/Lima");
  // const [currentTimezone, setCurrentTimezone] = React.useState("UTC5");

  useEffect(() => {
    const updateData = (data) => {
      const newData = ordenarAlfabeticamente(data.result, "grt_codigo");
      setGuiasTransportista({ result: newData });
    };
    getFetchFunction(
      `${API_DISTRIBUCION}/viaje/listaGRT?viaje=${viaje.idviaje}`,
      setLoadingTableGuias,
      updateData
    ).then((data) => {
      if (
        typeof data !== "undefined" &&
        data.toString().includes("Failed to fetch")
      ) {
        dispatch(setMessage({
          state: true,
          message: ERRORS_TEXT.fetchError,
          type: "error",
        }));
      }
    });
  }, []);

  const initialValues = {
    idviaje: viaje.idviaje,
    grt_codigo: "",

    horaLlegada: dayjs(new Date()),
    horaIniDescarga: dayjs(new Date()),
    horaFinDescarga: dayjs(new Date()),
    horaSalida: dayjs(new Date()),

    grt_hor_llegada: viaje.via_partida, //dayjs(new Date()),
    grt_hor_ini_descarga: viaje.via_llegada, //dayjs(new Date()),
    grt_hor_fin_descarga: viaje.via_llegada, //dayjs(new Date()),
    grt_hor_salida: viaje.via_llegada, //dayjs(new Date()),

    grt_hor_descarga: null,
    grt_hor_total: null,
    grt_observ: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      /* setOpenModal(false);
      alert(values); */
      /* values.grt_hor_llegada = new Date(dayjs(values.horaLlegada).toDate());
      values.grt_hor_ini_descarga = new Date(
        dayjs(values.horaIniDescarga).toDate()
      );
      values.grt_hor_fin_descarga = new Date(
        dayjs(values.horaFinDescarga).toDate()
      );
      values.grt_hor_salida = new Date(dayjs(values.horaSalida).toDate());
 */
      values.grt_updusu = USERNAME_LOCAL;

      delete values.horaLlegada;
      delete values.horaIniDescarga;
      delete values.horaFinDescarga;
      delete values.horaSalida;

      //console.log(values);
      setShowRowEditable(false);
      setShowInUtc(true);

      let guiasSinEditar = [...guiasTransportista.result];

      guiasSinEditar = guiasSinEditar.filter(
        (g) => g.grt_codigo !== values.grt_codigo
      );

      guiasSinEditar.push(values);

      guiasSinEditar = ordenarAlfabeticamente(guiasSinEditar, "grt_codigo");

      setGuiasTransportista({ result: guiasSinEditar });
      setBtnDisabled(false);
    },
    validate: (values) => {
      const errors = {};
      if (
        convertirDateToTimeString(values.grt_hor_llegada) ===
        convertirDateToTimeString(values.grt_hor_ini_descarga)
      ) {
        errors.grt_hor_llegada = " ";
      }

      if (
        convertirDateToTimeString(values.grt_hor_ini_descarga) <
        convertirDateToTimeString(values.grt_hor_llegada)
      ) {
        errors.grt_hor_ini_descarga = " ";
      }

      if (
        convertirDateToTimeString(values.grt_hor_fin_descarga) <
        convertirDateToTimeString(values.grt_hor_ini_descarga)
      ) {
        errors.horaFigrt_hor_fin_descarganDescarga = " ";
      }

      if (
        convertirDateToTimeString(values.grt_hor_salida) <
        convertirDateToTimeString(values.grt_hor_fin_descarga)
      ) {
        errors.grt_hor_salida = "";
      }

      if (
        convertirDateToTimeString(values.grt_hor_llegada) <
        convertirDateToTimeString(viaje.via_partida)
      )
        errors.grt_hor_llegada = "";
      /* if (
        convertirDateToTimeString(values.grt_hor_salida) >
        convertirDateToTimeString(viaje.via_llegada)
      )
        errors.grt_hor_salida = "2"; */

      console.log(errors);
      return errors;
    },
  });

  const onChangeGuiaSelected = (nameProp, value) => {
    let obj = { ...guiaSelected };
    obj[nameProp] = value;
    //setGuiaSelected(obj);
    formik.setFieldValue(nameProp, value);
  };

  const onSelectGuia = (guia) => {
    setGuiaSelected(guia);
    setShowRowEditable(true);
    setBtnDisabled(true);

    formik.setValues({
      ...guia,
      grt_updusu: USERNAME_LOCAL,
      horaLlegada:
        (guia.grt_hor_llegada && dayjs(guia.grt_hor_llegada)) ||
        dayjs(new Date()),
      horaIniDescarga:
        (guia.grt_hor_ini_descarga && dayjs(guia.grt_hor_ini_descarga)) ||
        dayjs(new Date()),
      horaFinDescarga:
        (guia.grt_hor_fin_descarga && dayjs(guia.grt_hor_fin_descarga)) ||
        dayjs(new Date()),
      horaSalida:
        (guia.grt_hor_salida && dayjs(guia.grt_hor_salida)) ||
        dayjs(new Date()),
    });
    /* formik.setFieldValue("idviaje", guia.idviaje);
    formik.setFieldValue("grt_codigo", guia.grt_codigo); */
  };

  const cancelEditSelected = () => {
    setShowRowEditable(false);
    setGuiaSelected(null);
    //setBtnDisabled(false);
    formik.setValues(initialValues);
  };

  const onSubmitAll = () => {
    const values = guiasTransportista.result;
    values.forEach((objeto) => {
      objeto.grt_hor_llegada =
        (objeto.grt_hor_llegada &&
          parseZonaHoraria(5, objeto.grt_hor_llegada) >
            new Date("00").getTime() &&
          parseZonaHoraria(5, objeto.grt_hor_llegada)) ||
        null;
      objeto.grt_hor_ini_descarga =
        (objeto.grt_hor_ini_descarga &&
          parseZonaHoraria(5, objeto.grt_hor_ini_descarga) >
            new Date("00").getTime() &&
          parseZonaHoraria(5, objeto.grt_hor_ini_descarga)) ||
        null;
      objeto.grt_hor_fin_descarga =
        (objeto.grt_hor_fin_descarga &&
          parseZonaHoraria(5, objeto.grt_hor_fin_descarga) >
            new Date("00").getTime() &&
          parseZonaHoraria(5, objeto.grt_hor_fin_descarga)) ||
        null;
      objeto.grt_hor_salida =
        (objeto.grt_hor_salida &&
          parseZonaHoraria(5, objeto.grt_hor_salida) >
            new Date("00").getTime() &&
          parseZonaHoraria(5, objeto.grt_hor_salida)) ||
        null;
    });

    const afterUpdate = (data) => {
      dispatch(setMessage({
        state: true,
        message: data.mensaje,
        type: data.status.toLowerCase(),
      }));
      setOpenModal(false);
    };
    //console.log(values);
    putFetchFunction(
      `${API_DISTRIBUCION}/viaje/registroHorasGRT`,
      guiasTransportista.result,
      afterUpdate
    );
  };

  const inputStyles = {
    padding: "0",
    borderRadius: "0",
    width: "6em",
    ".css-1bn53lx": {
      padding: "0",
      borderRadius: "0px",
    },
    ".css-1nvf7g0": {
      marginLeft: "0",
      marginRight: "2px",
      scale: "0.8",
      padding: "0.1em",
      paddingRight: "0.2em",
      paddingLeft: "0em",
    },
    ".css-1uvydh2": {
      padding: "0.25em",
      paddingRight: "0",
      borderRadius: "0px",
      fontSize: "14px",
      textAlign: "center",
    },
    ".css-slyssw": {
      paddingLeft: "0em",
      marginRight: "0.005em",
    },
    ".css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root": {
      padding: "0",
      borderRadius: "0px",
    },
    ".css-1laqsz7-MuiInputAdornment-root": {
      marginLeft: "0",
      scale: "0.8",
      padding: "0.1em",
      paddingRight: "0.2em",
      paddingLeft: "0em",
    },
    ".css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
      padding: "0.25em",
      paddingRight: "0",
      borderRadius: "0px",
      fontSize: "14px",
      textAlign: "center",
    },
    ".css-1yq5fb3-MuiButtonBase-root-MuiIconButton-root": {
      paddingLeft: "0em",
      marginRight: "0.005em",
    },
  };

  const stylesTimePicker = {
    padding: "0.25em",
    width: "100px",
  };
  return (
    <div className="modal-children-content">
      <div className="flex w-full justify-end mb-2">
        <ExportarExcelAPIComponent
          data={guiasTransportista && guiasTransportista.result}
          headers={LLENADO_OT_PAGE.headersExportExcelGRT}
          filename={
            `GRT_` +viaje.via_otrcod 
          }
          msgTooltip="Exportar a Excel las GRT de la OT"
        />
      </div>
      <TableCustom
        cols={LLENADO_OT_PAGE.formLlenadoGRT.tableHeaders}
        maxHeight={50}
      >
        {!loadingTableGuias &&
          guiasTransportista.result.map((g) => (
            <>
              <tr key={g.idgrt}>
                <td>
                  <span>{g.grt_codigo}</span>
                </td>
                <td>{""}</td>
                {showRowEditable && g.grt_codigo === guiaSelected.grt_codigo ? (
                  <>
                    <td>
                      <div>
                        <TimePickerCustomComponent
                          labelTitle=""
                          styles={stylesTimePicker}
                          valueTime={formik.values.grt_hor_llegada}
                          minTime={viaje.via_partida}
                          maxTime={viaje.via_llegada}
                          nameValue="grt_hor_llegada"
                          formik={formik}
                        />
                        {formik.errors.horaLlegada ? (
                          <span className="text-xs text-red-500">
                            {formik.errors.horaLlegada}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td>
                      <div>
                        <TimePickerCustomComponent
                          labelTitle=""
                          styles={stylesTimePicker}
                          valueTime={formik.values.grt_hor_ini_descarga}
                          minTime={formik.values.grt_hor_llegada}
                          maxTime={viaje.via_llegada}
                          nameValue="grt_hor_ini_descarga"
                          formik={formik}
                        />
                        {formik.errors.grt_hor_ini_descarga ? (
                          <span className="text-xs text-red-500">
                            {formik.errors.grt_hor_ini_descarga}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td>
                      <div>
                        <TimePickerCustomComponent
                          labelTitle=""
                          styles={stylesTimePicker}
                          valueTime={formik.values.grt_hor_fin_descarga}
                          minTime={formik.values.grt_hor_ini_descarga}
                          maxTime={viaje.via_llegada}
                          nameValue="grt_hor_fin_descarga"
                          formik={formik}
                        />
                        {formik.errors.grt_hor_fin_descarga ? (
                          <span className="text-xs text-red-500">
                            {formik.errors.grt_hor_fin_descarga}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td>
                      <div>
                        <TimePickerCustomComponent
                          labelTitle=""
                          styles={stylesTimePicker}
                          valueTime={formik.values.grt_hor_salida}
                          minTime={formik.values.grt_hor_fin_descarga}
                          maxTime={viaje.via_llegada}
                          nameValue="grt_hor_salida"
                          formik={formik}
                        />
                        {formik.errors.grt_hor_salida ? (
                          <span className="text-xs text-red-500">
                            {formik.errors.grt_hor_salida}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td>
                      <textarea
                        onChange={(e) =>
                          onChangeGuiaSelected("grt_observ", e.target.value)
                        }
                        value={formik.values.grt_observ}
                        className="border-1 border-blue-800 focus:outline-none px-1"
                        rows={2}
                      ></textarea>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      {g.grt_hor_llegada &&
                        convertirDateToTimeString(g.grt_hor_llegada)}
                    </td>
                    <td>
                      {g.grt_hor_ini_descarga &&
                        convertirDateToTimeString(g.grt_hor_ini_descarga)}
                    </td>
                    <td>
                      {g.grt_hor_fin_descarga &&
                        convertirDateToTimeString(g.grt_hor_fin_descarga)}
                    </td>
                    <td>
                      {g.grt_hor_salida &&
                        convertirDateToTimeString(g.grt_hor_salida)}
                    </td>
                    <td>{g.grt_observ}</td>
                  </>
                )}
                <td>
                  {showRowEditable &&
                  guiaSelected &&
                  g.grt_codigo === guiaSelected.grt_codigo ? (
                    <>
                      <button onClick={formik.handleSubmit}>
                        <CheckCircleIcon className="text-green-600" />
                      </button>
                      <button onClick={() => cancelEditSelected()}>
                        <CancelIcon className="text-red-600" />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => onSelectGuia(g)}>
                      <EditIcon className="text-gray-600" />
                    </button>
                  )}
                </td>
              </tr>
            </>
          ))}
      </TableCustom>
      <FormButtons
        titleAccept="Guardar"
        titleCancel="Cancelar"
        onCancel={() => setOpenModal(false)}
        onAccept={() => onSubmitAll()}
        btnDisabled={btnDisabled}
      />
    </div>
  );
};

export default FormLlenadoGRTComponent;
