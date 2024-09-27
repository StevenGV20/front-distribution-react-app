import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";

import "react-datepicker/dist/react-datepicker.css";
import DatePickerCustom from "../../components/widgets/DatePickerCustom";
import Autocomplete from "../../components/widgets/AutocompletadoCliente";
import DeleteIcon from "@mui/icons-material/Delete";

import BreadcrumbComponent from "../../components/widgets/BreadcrumbComponent";
import SlideOverComponent from "../../components/widgets/SlideOverComponent";
import LoaderAllComponent from "../../components/widgets/ModalComponent/LoaderAllComponent";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { useDispatch } from "react-redux";
import { setMessage } from "../../redux/features/utils/utilsSlice";

import {
  URL_MASTERLOGIC_API,
  API_ORDENES,
  API_DISTRIBUCION,
  API_MAESTRO,
} from "../../utils/general";
import {
  convertirDateTimeToDate,
  getFetchFunction,
  getPesoOD,
  convertirDateToTimeString,
  parseZonaHoraria,
  enviarOrdenesSeleccionadas,
  postFetchFunction,
  convertirDateTimeToDateYYYYMMDD,
} from "../../utils/funciones";

import { useFormik } from "formik";
import ExportarExcelAPIComponent from "../../components/widgets/ExportarExcelComponent/exportacionByAPI";
import { PRE_ORDEN_PAGE } from "../../utils/properties.text";
import TableCustom from "../../components/widgets/TableComponent";
import { FaFileExcel } from "react-icons/fa6";
import { ERRORS_TEXT } from "../../utils/properties.error.text";

const PreOrden = () => {
  const inputRefHoraCita = useRef(null);
  const inputRefAddon = useRef(null);

  registerLocale("es", es);
  setDefaultLocale("es");
  const apiUrl = `${URL_MASTERLOGIC_API}${API_ORDENES}/clientes`;

  const [horaCita, setHoraCita] = useState("");

  const [clientesViajes, setClientesViajes] = useState([]);
  const [preOrden, setPreOrden] = useState({
    title: "",
    horaCarga: "",
    horaSalida: "",
    horaRetorno: "",
  });

  const styles = {
    padding: "0.25em",
    width: "100%",
  };
  const minTime = null;
  const maxTime = null;
  const inputStyles = {
    padding: "0",
    borderRadius: "0",
    border: "",
    width: styles.width,
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
      padding: styles.padding,
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
      padding: "0.2em",
      paddingRight: "0.2em",
      paddingLeft: "0em",
    },
    ".css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
      padding: styles.padding,
      paddingRight: "0",
      borderRadius: "0px",
      fontSize: "14px",
      textAlign: "center",
    },
    ".css-1yq5fb3-MuiButtonBase-root-MuiIconButton-root": {
      paddingLeft: "0em",
      marginRight: "0.005em",
    },
    fieldset: {
      border: "blue 1px solid",
      borderRadius: "0.3em",
    },
  };

  const [inputValue, setInputValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openFilterViaje, setOpenFilterViaje] = useState(false);

  const [openFilter, setOpenFilter] = useState(false);
  const [titlefilter, setTitlefilter] = useState("");
  const [titlefilterViaje, setTitlefilterViaje] = useState("");

  const [filterFechaEntrega, setFilterFechaEntrega] = useState(new Date());
  const [refreshTable, setRefreshTable] = useState(false);
  const [vehiculos, setVehiculos] = useState({ result: [] });
  const [loadingTableVehiculos, setLoadingTableVehiculos] = useState(true);
  const userLocal = localStorage.getItem("USERNAME");
  const [openLoader, setOpenLoader] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedViaje, setSelectedViaje] = useState(null);
  const [ifSelectViaje, setIfSelectViaje] = useState(false);

  const [listViajes, setListViajes] = useState([]);

  const [dataExcel, setDataExcel] = useState([]);

  const handleChangeFechaEntrega = (date) => {
    setFilterFechaEntrega(date);
    setDataExcel([]);
    setRefreshTable((prev) => !prev);
    //
  };

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const listheader = () => {
    return PRE_ORDEN_PAGE.times.map((time, index) => (
      <li
        key={index}
        className={`timecontent timecontent-${index}`}
        data={time.order}
      >
        {time.data}
      </li>
    ));
  };

  const handleAddHorario = (vehiculo) => {
    if (clientesViajes.length < 1) {
      setOpenMessage({
        state: true,
        message: "Debes seleccionar al menos un cliente",
        type: ERRORS_TEXT.typeError,
      });
      return false;
    }
    //aqui va la logica
    const viajeobject = {
      cia_codcia: "01",
      fecha_salida: filterFechaEntrega,
      codigo_vehiculo: vehiculo.utr_codutr,
      placa_vehiculo: vehiculo.utr_plautr,
      title: preOrden.title,
      hora_carga: preOrden.horaCarga,
      hora_salida: preOrden.horaSalida,
      hora_retorno: preOrden.horaRetorno,
      username_update: localStorage.getItem("USERNAME"),
      details: clientesViajes,
    };
    //vehiculo.viajes.push(viajeobject);

    setListViajes((prev) => [...prev, viajeobject]);
    //end logica
    setOpenFilter(false);
    setSelectedVehicle(null);

    setPreOrden({
      title: "",
      horaCarga: "",
      horaSalida: "",
      horaRetorno: "",
    });

    setClientesViajes([]);

    const postPreOrden = async () => {
      try {
        await postFetchFunction(
          `${API_DISTRIBUCION}/preOrden/save`,
          viajeobject,
          setOpenMessage
        );
        setRefreshTable((prev) => !prev);
        formik.setValues({
          cia_codcia: "01",
          pre_title: "",
          pre_carhor: "",
          pre_salhor: "",
          pre_rethor: "",
          pre_cithor: "",
          pre_cliente: "",
          pre_updusu: localStorage.getItem("USERNAME"),
        });
        formik.setErrors({});
      } catch (error) {
        console.error(error);
      }
    };
    postPreOrden();
  };

  const handleUpdateViaje = (vehiculo, viajeSel) => {
    const viajeobject = {
      cia_codcia: "01",
      fecha_salida: filterFechaEntrega,
      title: formik.values.pre_title,
      hora_carga: formik.values.pre_carhor,
      hora_salida: formik.values.pre_salhor,
      hora_retorno: formik.values.pre_rethor,
      details: clientesViajes,
      id: viajeSel.id,
    };

    //const index = findObjectIndex(vehiculo.viajes, selectedViaje);
    //console.log(vehiculo.viajes,selectedViaje, index);
    //vehiculo.viajes[index] = viajeobject;

    //end logica
    setOpenFilter(false);
    setSelectedVehicle(null);
    setPreOrden({
      title: "",
      horaCarga: "",
      horaSalida: "",
      horaRetorno: "",
    });

    const postPreOrden = async () => {
      try {
        await postFetchFunction(
          `${API_DISTRIBUCION}/preOrden/save`,
          viajeobject,
          setOpenMessage
        );
        setRefreshTable((prev) => !prev);
      } catch (error) {
        console.error(error);
      }
    };
    postPreOrden();

    /*
    setHoraCita(""); */
    setClientesViajes([]);
  };
  const handleOpenModalVehiculo = (vehiculo) => {
    setTitlefilter("Agregar horario a " + vehiculo.utr_plautr);
    setPreOrden({
      title: "",
      horaCarga: "",
      horaSalida: "",
      horaRetorno: "",
    });
    setHoraCita("");
    setClientesViajes([]);
    setSelectedVehicle(vehiculo);
    setIfSelectViaje(false);
    setOpenFilter(true);
    formik.setErrors({})
  };
  const handleOpenModalViaje = (vehiculo, viaje) => {
    setTitlefilter("Agregar horario a " + vehiculo.utr_plautr);
    setSelectedVehicle(vehiculo);
    setSelectedViaje(viaje);

    setPreOrden({
      title: viaje.title,
      horaCarga: viaje.hora_carga,
      horaSalida: viaje.hora_salida,
      horaRetorno: viaje.hora_retorno,
    });

    formik.setValues({
      cia_codcia: "01",
      pre_title: viaje.title || "",
      pre_carhor: viaje.hora_carga || "",
      pre_salhor: viaje.hora_salida || "",
      pre_rethor: viaje.hora_retorno || "",
      pre_cithor: "",
      pre_cliente: "",
      pre_updusu: localStorage.getItem("USERNAME"),
    });

    formik.setErrors({});

    setClientesViajes(JSON.parse(viaje.details));
    setIfSelectViaje(true);
    setOpenFilter(true);
  };
  const convertTo24Hour = (timeString) => {
    const [time, modifier] = timeString.split(/(am|pm)/);
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "pm" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "am" && hours === 12) {
      hours = 0;
    }
    if (minutes >= 30) {
      hours += 1;
    }
    return hours;
  };
  const extractHourIndex = (timeString) => {
    const hour = convertTo24Hour(timeString);
    const found = PRE_ORDEN_PAGE.times.find((t) => t.order === hour);
    return found ? found.order : null;
  };

  const [preOrdenes, setPreOrdenes] = useState({ result: [] });

  useEffect(() => {
    const getData = (data) => {
      setPreOrdenes(data);
      let arrayVeh = vehiculos.result;
      let myArrayV = arrayVeh.map((vehi) => {
        let thisViaje = data.result.filter(
          (v) => v.placa_vehiculo === vehi.utr_plautr
        )[0];
        return {
          ...vehi,
          viajes: thisViaje || [],
          status: "vacio",
        };
      });
      setVehiculos({ result: myArrayV });

      let arrayExcel = [];
      data.result.map((p) => {
        JSON.parse(p.details).map((d) => {
          var obj = {
            fecha: convertirDateTimeToDate(p.fecha_salida),
            placa_vehiculo: p.placa_vehiculo,
            hora_salida: p.hora_salida,
            hora_carga: p.hora_carga,
            hora_retorno: p.hora_retorno,
            cliente: d.cliente.toUpperCase(),
          };
          arrayExcel = [...arrayExcel, obj];
        });
      });

      setDataExcel(arrayExcel);
    };
    getFetchFunction(
      `${API_DISTRIBUCION}/preOrden/listByFecha?fecha=${convertirDateTimeToDate(
        filterFechaEntrega
      )}`,
      setLoadingTableVehiculos,
      getData
    );
  }, [refreshTable]);

  useEffect(() => {
    const setDataVehiculos = (dataVehiculos) => {
      let arrayVeh = dataVehiculos.result;
      let myArrayV = arrayVeh.map((vehi) => ({
        ...vehi,
        viajes: [],
        status: "vacio",
      }));
      setVehiculos({ result: myArrayV });
    };

    getFetchFunction(
      `${API_MAESTRO}/unidadesTransporte/lista?empresa=01`,
      setLoadingTableVehiculos,
      setDataVehiculos
    );
  }, []);

  /*  const handleChangeTitle = (e) => {
    setTitleViaje(e.target.value);
  };

  const handleAddItem = () => {
    const horarioCita = horaCita;
    const nuevoCliente = inputValue + " - (" + horarioCita + ")";
    setClientesViajes([...clientesViajes, nuevoCliente]);
    setInputValue("");
    setHoraCita("");
  };
 */
  const removerCliente = (index) => {
    const nuevaLista = clientesViajes.filter((v, i) => i !== index);
    setClientesViajes(nuevaLista);
  };

  const formik = useFormik({
    initialValues: {
      cia_codcia: "01",
      pre_title: preOrden.title || "",
      pre_carhor: (selectedViaje && selectedViaje.hora_carga) || "",
      pre_salhor: (selectedViaje && selectedViaje.hora_salida) || "",
      pre_rethor: (selectedViaje && selectedViaje.hora_retorno) || "",
      pre_cithor: "",
      pre_cliente: "",
      pre_updusu: localStorage.getItem("USERNAME"),
    },
    onSubmit: (values) => {
      //console.log(JSON.stringify(values, 2, 1));

      const horarioCita = values.pre_cithor;
      const nuevoCliente = {
        cliente: values.pre_cliente + " - (" + horarioCita + ")",
      };
      setClientesViajes([...clientesViajes, nuevoCliente]);
      setInputValue("");
      formik.setFieldValue("pre_cliente", "");
      formik.setFieldValue("pre_cithor", "");

      setPreOrden({
        title: values.pre_title,
        horaCarga: values.pre_carhor,
        horaSalida: values.pre_salhor,
        horaRetorno: values.pre_rethor,
      });
    },
    validate: (values) => {
      const errors = {};
      if (!values.pre_title) {
        errors.pre_title = "Debes ingresar un titulo";
      }
      if (!values.pre_carhor) {
        errors.pre_carhor = "Debes ingresar la hora de carga";
      }
      if (!values.pre_salhor) {
        errors.pre_salhor = "Debes ingresar la hora de salida";
      }
      if (!values.pre_rethor) {
        errors.pre_rethor = "Debes ingresar la hora de retorno";
      }
      /* if (!values.pre_cliente) {
        errors.pre_cliente = "Debes seleccionar un cliente";
      } */
      /* if (!values.pre_cithor) {
        errors.pre_cithor = "Debes seleccionar un cliente";
      }  */
      /* if (!values.pre_title) {
        errors.pre_title = "Debes ingresar un titulo";
      }
      if (!values.pre_cliente) {
        errors.pre_cliente = "Debes seleccionar un cliente";
      } */
      return errors;
    },
  });

  const setVehiculosDem = () => {
    return vehiculos.result.map((vehiculo) => (
      <div className="Mycalendar__item" key={vehiculo.id}>
        <div
          className={`selectVehicle paddingWidth status-${vehiculo.status}`}
          onClick={() => handleOpenModalVehiculo(vehiculo)}
        >
          {vehiculo.utr_plautr}
        </div>
        <div className="viajes">
          {preOrdenes && preOrdenes.result.length > 0 ? (
            preOrdenes.result
              .filter((v) => vehiculo.utr_plautr === v.placa_vehiculo)
              .map((viaje, index) => {
                const horainit = extractHourIndex(viaje.hora_carga) - 4;
                const horaend = extractHourIndex(viaje.hora_retorno) - 4;
                return (
                  <div
                    className="viajeItem"
                    style={{
                      gridColumnStart: horainit,
                      gridColumnEnd: horaend,
                    }}
                    onClick={() => handleOpenModalViaje(vehiculo, viaje)}
                    key={index}
                  >
                    <p>{viaje.title}</p>{" "}
                    <p>
                      ({viaje.hora_carga} - {viaje.hora_retorno})
                    </p>
                  </div>
                );
              })
          ) : (
            <div
              className="empty"
              onClick={() => handleOpenModalVehiculo(vehiculo)}
            ></div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="page-container">
      <div className="page-container-header-page ">
        <div className="page-container-header-page-title-content">
          <BreadcrumbComponent message={"PRE ORDEN"} />
        </div>
        <div className="page-container-header-page-two-group">
          <div className="page-container-header-page-two-group-item">
            <label htmlFor="">Fecha de inicio de Traslado</label>
            <DatePickerCustom
              selected={filterFechaEntrega}
              value={filterFechaEntrega}
              onChange={(date) => handleChangeFechaEntrega(date)}
              classname="input-filter-fecha"
            />
          </div>
          <div className="page-container-header-page-two-group-item">
            <button
              onClick={() => setOpenModal(true)}
              className="btn-base-black"
            >
              Resumen
            </button>
          </div>
        </div>
      </div>
      <section className="Mycalendar">
        <div className="Mycalendar__header">
          <div className="paddingWidth" />
          <div className="MyCalendar__header__list">
            <ul>{listheader()}</ul>
          </div>
        </div>
        <div className="Mycalendar__body">{setVehiculosDem()}</div>
      </section>

      {/* modal selected */}
      <SlideOverComponent
        open={openFilter}
        setOpen={setOpenFilter}
        title={titlefilter}
        reSizeWidth={true}
      >
        <div className="table-container-tbody md:p-4 text-left space-y-4 text-black">
          {/* <Modal
            vehiculo={selectedVehicle}
            viaje={selectedViaje}
            onClose={handleCloseModal}
            onCloseViaje={handleCloseModalViaje}
          /> */}
          <div className="Mymodal__form">
            <div className="Mymodal__row">
              <div className="Mymodal__input">
                <label>Título del viaje</label>
                <input
                  type="text"
                  id="pre_title"
                  name="pre_title"
                  value={formik.values.pre_title}
                  onChange={formik.handleChange}
                  className={`${
                    formik.errors.pre_title ? "Mymodal__input-error" : ""
                  }`}
                />
                {formik.errors.pre_title && (
                  <span className="form-container-group-content-span-error xs:text-xs">
                    {formik.errors.pre_title}
                  </span>
                )}
              </div>
            </div>
            <div className="Mymodal__row">
              <div className="Mymodal__input input-3">
                <label>Horario carga</label>
                <input
                  type="text"
                  name="pre_carhor"
                  value={formik.values.pre_carhor}
                  onChange={formik.handleChange}
                  placeholder="06:00am"
                  className={`${
                    formik.errors.pre_carhor ? "Mymodal__input-error" : ""
                  }`}
                />
                {formik.errors.pre_carhor && (
                  <span className="form-container-group-content-span-error xs:text-xs">
                    {formik.errors.pre_carhor}
                  </span>
                )}
              </div>
              <div className="Mymodal__input input-3">
                <label>Horario salida</label>
                <input
                  type="text"
                  name="pre_salhor"
                  value={formik.values.pre_salhor}
                  onChange={formik.handleChange}
                  placeholder="06:10am"
                  className={`${
                    formik.errors.pre_salhor ? "Mymodal__input-error" : ""
                  }`}
                />
                {formik.errors.pre_salhor && (
                  <span className="form-container-group-content-span-error xs:text-xs">
                    {formik.errors.pre_salhor}
                  </span>
                )}
              </div>
              <div className="Mymodal__input input-3">
                <label>Horario retorno</label>
                <input
                  type="text"
                  name="pre_rethor"
                  value={formik.values.pre_rethor}
                  onChange={formik.handleChange}
                  placeholder="06:30am"
                  className={`${
                    formik.errors.pre_rethor ? "Mymodal__input-error" : ""
                  }`}
                />
                {formik.errors.pre_rethor && (
                  <span className="form-container-group-content-span-error xs:text-xs">
                    {formik.errors.pre_rethor}
                  </span>
                )}
              </div>
            </div>
            <div className="Mymodal__row">
              <div className="Mymodal__input input--clientes">
                <label>Cliente</label>
                {
                  <Autocomplete
                    apiUrl={apiUrl}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    inputRefAddon={inputRefAddon}
                    formik={formik}
                  />
                }
                {formik.errors.pre_cliente && (
                  <span className="form-container-group-content-span-error xs:text-xs">
                    {formik.errors.pre_cliente}
                  </span>
                )}
              </div>
              <div className="Mymodal__input input--cita">
                <label>Cita</label>
                <input
                  type="text"
                  name="pre_cithor"
                  value={formik.values.pre_cithor}
                  onChange={formik.handleChange}
                  placeholder="06:20am"
                  ref={inputRefHoraCita}
                  className={`${
                    formik.errors.pre_cithor ? "Mymodal__input-error" : ""
                  }`}
                />
                {formik.errors.pre_cithor && (
                  <span className="form-container-group-content-span-error xs:text-xs">
                    {formik.errors.pre_cithor}
                  </span>
                )}
              </div>
              <div className="Mymodal__input input--cita">
                <button
                  className="bg-black text-white btnAdd"
                  onClick={formik.handleSubmit}
                  type="button"
                >
                  Agregar
                </button>
              </div>
            </div>
            <div className="Mymodal__row">
              <div className="Mymodal__centerident">
                {clientesViajes &&
                  clientesViajes.map((cliente, index) => (
                    <div className="Mymodal__item" key={index}>
                      <p>{cliente.cliente.toUpperCase()}</p>
                      <button
                        className="Mymodal__close"
                        onClick={() => removerCliente(index)}
                        type="button"
                      >
                        <DeleteIcon className="text-red-600" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {ifSelectViaje ? (
            <button
              className="bg-black w-full py-2 text-white my-4 rounded-md"
              onClick={() => handleUpdateViaje(selectedVehicle, selectedViaje)}
            >
              Actualizar viaje
            </button>
          ) : (
            <button
              className="bg-black w-full py-2 text-white my-4 rounded-md"
              onClick={() => handleAddHorario(selectedVehicle)}
            >
              Agregar horario
            </button>
          )}
        </div>
      </SlideOverComponent>
      {/* resumen modal */}
      <SlideOverComponent
        open={openModal}
        setOpen={setOpenModal}
        title={"Resumen de viajes"}
        reSizeWidth={true}
      >
        <div className="ModalContent__content">
          <div className="ModalContent__absButton">
            <ExportarExcelAPIComponent
              data={dataExcel}
              headers={PRE_ORDEN_PAGE.headersExcel}
              filename={
                `PreOrden_` +
                convertirDateTimeToDateYYYYMMDD(filterFechaEntrega)
              }
              buttonComponent={(onExport) => (
                <button
                  className="border-2 border-green-600 px-4 py-2 mb-4 flex items-center space-x-2"
                  onClick={() => onExport()}
                >
                  <span>Descargar Excel</span>
                  <FaFileExcel className="text-green-700 text-xl" />
                </button>
              )}
            />
          </div>
          <div className="ModalContent__table">
            <TableCustom
              cols={[
                "Vehiculo",
                "Hora de salida",
                "Hora de Carga",
                "Hora de Retorno",
                "Cliente - Cita",
              ]}
              mini={true}
              maxHeight={70}
            >
              {dataExcel.map((vehiculo) => (
                <tr>
                  {/* <tr>
                    <td colSpan={4}>Vehiculo {vehiculo.placa_vehiculo}</td>
                  </tr> */}
                  <td>
                    <strong>{vehiculo.placa_vehiculo}</strong>
                  </td>
                  <td>{vehiculo.hora_salida}</td>
                  <td>{vehiculo.hora_carga}</td>
                  <td>{vehiculo.hora_retorno}</td>
                  <td>{vehiculo.cliente.toUpperCase()}</td>
                </tr>
              ))}
            </TableCustom>
          </div>
        </div>
      </SlideOverComponent>
    </div>
  );
};

export default PreOrden;
