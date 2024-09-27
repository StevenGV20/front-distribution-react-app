import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import {
  convertirDateTimeToDate,
  getFetchFunction,
  postFetchFunction,
  postFetchFunctionCustomFunction,
} from "../../../utils/funciones";
import { API_DISTRIBUCION, API_MAESTRO } from "../../../utils/general";
import ListODOsisComponent from "../ListODOsisComponent/TableCheckbox";
import LoaderAllComponent from "../../widgets/ModalComponent/LoaderAllComponent";
import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import { ERRORS_TEXT } from "../../../utils/properties.error.text";

const FormFiltroODFromOsis = ({ setOpen, setOpenMessage, setRefreshTable }) => {
  registerLocale("es", es);
  setDefaultLocale("es");

  const [ordenesDespachoOsis, setOrdenesDespachoOsis] = useState([]);
  const [filtrosOsis, setFiltrosOsis] = useState({
    canal: "",
    cliente: "",
    numeroPedido: "",
    fechaFinal: new Date(),
    numeroOrden: "",
    fechaInicio: new Date(),
  });
  const [loadingTableOsis, setLoadingTableOsis] = useState(true);
  const [ordenesDespachoSelected, setOrdenesDespachoSelected] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [canales, setCanales] = useState([]);
  const [loadingCanales, setLoadingCanales] = useState(true);
  const [eventSearch, setEventSearch] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null);
    setFiltrosOsis({
      ...filtrosOsis,
      fechaInicio: date,
      fechaFinal: (date > filtrosOsis.fechaFinal ? date : filtrosOsis.fechaFinal)
    });
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setFiltrosOsis({
      ...filtrosOsis,
      fechaFinal: date,
    });
  };

  const onSearchOsis = (e) => {
    ////console.log(e);
    if (
      !filtrosOsis.canal &&
      !filtrosOsis.cliente &&
      !filtrosOsis.numeroPedido &&
      !filtrosOsis.fechaFinal &&
      !filtrosOsis.numeroOrden &&
      !filtrosOsis.fechaInicio
    ) {
      setErrorMessage("No has ingresado ningun filtro");
    } else {
      e.target.disabled = true;
      setErrorMessage("");
      setOrdenesDespachoOsis([]);
      setEventSearch(true);
      setLoadingTableOsis(true);
      setOrdenesDespachoSelected([]);

      const updateData = (data) => {
        setOrdenesDespachoOsis(data);
        e.target.disabled = false;
      };

      const fetchOrdenesDespachoOsis = async () => {
        try {
          await getFetchFunction(
            `${API_DISTRIBUCION}/ordenDespacho/listaFromOsis?fecIni=${convertirDateTimeToDate(
              filtrosOsis.fechaInicio || ""
            )}&fecFin=${convertirDateTimeToDate(
              filtrosOsis.fechaFinal || ""
            )}&numODC=${filtrosOsis.numeroOrden}&numPPC=${
              filtrosOsis.numeroPedido || ""
            }&cia=01&cliente=${filtrosOsis.cliente || ""}&canal=${
              filtrosOsis.canal || ""
            }`,
            setLoadingTableOsis,
            updateData
          ).then((data) => {
            console.log(data);
            if (typeof data !== 'undefined' && data.toString().includes("Failed to fetch")) {
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
      fetchOrdenesDespachoOsis();
    }
  };

  const onImportarOD = () => {
    //alert(JSON.stringify(ordenesDespachoSelected, null, 2));

    const loadingData = () => {
      setLoaderData(false);
    };
    
    const fetchODOsisToCloud = async () => {
      try {
        await postFetchFunctionCustomFunction(
          `${API_DISTRIBUCION}/ordenDespacho/saveList`,
          ordenesDespachoSelected,
          setOpenMessage,
          loadingData
        );
        setOrdenesDespachoSelected([]);
        //setOrdenesDespachoOsis([]);
        setOpen(false);
        setRefreshTable((prev) => !prev);
      } catch (error) {
        console.error(error);
      }
    };
    if (ordenesDespachoSelected.length > 0 && ordenesDespachoSelected.length <= 1000) {
      setLoaderData(true);
      fetchODOsisToCloud();
    } else {
      setOpenMessage({
        state: true,
        message: "Debes seleccionar Ordenes de Despacho para importar",
        type: "error",
      });
    }
    if(ordenesDespachoSelected.length > 1000) {
      setOpenMessage({
        state: true,
        message: "No se puede importar mas de 100",
        type: "error",
      });
    }
  };

  const getChannelData = () => {
    /* const setData = (data) => {
      data.sort((a, b) => a.valor.localeCompare(b.valor));
      setCanales(data);
    }; */
    try {
      getFetchFunction(
        `${API_MAESTRO}/canales/lista?cia=01`,
        setLoadingCanales,
        setCanales
      ).then((data) => {
        if (typeof data !== 'undefined' && data.toString().includes("Failed to fetch")) {
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

  const [loaderData, setLoaderData] = useState(false);

  useEffect(() => {
    getChannelData();
  }, []);

  return (
    <>
      <LoaderAllComponent open={loaderData} setOpen={setLoaderData} />
      <div className="modal-children-content">
        <div className="modal-group-container text-black">
          <div className="form-container">
            <div className="form-container-group-content">
              {/* <label className="form-container-group-content-label">Canal:</label> */}
              <div>
                <FormControl sx={{ width: "100%", border: "none" }}>
                  <Select
                    type="text"
                    className="form-container-group-content-input form-container-group-content-input-mui-select"
                    value={filtrosOsis.canal}
                    onChange={(e) =>
                      setFiltrosOsis({ ...filtrosOsis, canal: e.target.value })
                    }
                    size="small"
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="">[Seleccione Canal]</MenuItem>
                    {!loadingCanales &&
                      canales.result.length &&
                      canales.result.map((c) => (
                        <MenuItem value={c.grupo_codigo} key={c.grupo_codigo}>
                          {c.grupo_nombre}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="form-container-group-content">
              {/* <label className="form-container-group-content-label">
              N° Pedido:
            </label> */}
              <div>
                <input
                  type="text"
                  placeholder="N° Pedido:"
                  className="form-container-group-content-input"
                  value={filtrosOsis.numeroPedido}
                  onChange={(e) =>
                    setFiltrosOsis({
                      ...filtrosOsis,
                      numeroPedido: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="form-container-group-content col-span-3 sm:col-span-6">
              {/* <label className="form-container-group-content-label">
              Cliente:
            </label> */}
              <div>
                <input
                  type="text"
                  className="form-container-group-content-input"
                  value={filtrosOsis.cliente}
                  onChange={(e) =>
                    setFiltrosOsis({ ...filtrosOsis, cliente: e.target.value })
                  }
                  placeholder="Cliente"
                />
              </div>
            </div>
            <div className="form-container-group-content md:col-span-2">
              <label className="form-container-group-content-label">
                N° Orden:
              </label>
              <div>
                <input
                  type="text"
                  className="form-container-group-content-input"
                  value={filtrosOsis.numeroOrden}
                  onChange={(e) =>
                    setFiltrosOsis({
                      ...filtrosOsis,
                      numeroOrden: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="form-container-group-content md:col-span-2">
              <label className="form-container-group-content-label">
                Desde:
              </label>
              <div>
                <DatePicker
                  selected={filtrosOsis.fechaInicio}
                  onChange={handleStartDateChange}
                  selectsStart
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="bottom-end"
                  className="form-container-group-content-input z-50"
                />
              </div>
            </div>
            <div className="form-container-group-content md:col-span-2">
              <label className="form-container-group-content-label">
                Hasta:
              </label>
              <div>
                <DatePicker
                  selected={filtrosOsis.fechaFinal}
                  onChange={handleEndDateChange}
                  selectsStart
                  startDate={new Date()}
                  endDate={endDate}
                  minDate={filtrosOsis.fechaInicio}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="bottom-end"
                  className="form-container-group-content-input z-50"
                />
              </div>
            </div>
          </div>
          {errorMessage && (
            <div className="w-full flex justify-center">
              <span className="form-container-group-content-span-error mt-4 -mb-4">
                {errorMessage}
              </span>
            </div>
          )}
          <div className="w-full flex justify-end">
            <button
              className="bg-black w-full md:w-1/2 lg:w-1/3 py-2 text-white rounded-md"
              onClick={(e) => onSearchOsis(e)}
              id="btnSearch"
            >
              Buscar
            </button>
          </div>
        </div>
        <ListODOsisComponent
          data={ordenesDespachoOsis.result}
          loadingTableOsis={loadingTableOsis}
          selected={ordenesDespachoSelected}
          setSelected={setOrdenesDespachoSelected}
          eventSearch={eventSearch}
        />
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 md:columns-2">
        <button
          type="button"
          className="flex w-full col-span-1 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3"
          onClick={() => onImportarOD()}
        >
          Importar Ordenes de Despacho
        </button>
        <button
          type="button"
          className="flex w-full col-span-1 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 items-center"
          onClick={() => setOpen(false)}
        >
          Cancelar
        </button>
      </div>
    </>
  );
};

export default FormFiltroODFromOsis;
