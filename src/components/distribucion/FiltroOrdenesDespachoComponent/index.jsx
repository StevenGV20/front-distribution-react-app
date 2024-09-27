import React, { useEffect, useState } from "react";
import { Checkbox } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useSelector, useDispatch } from "react-redux";
import {
  getTienda
} from "../../../../src/utils/funciones";
import { API_DISTRIBUCION } from '../../../../src/utils/general';
import CheckBoxEstadosComponent from "../../widgets/CheckBoxEstadosComponent";
import { fetchCanales } from "../../../redux/features/combos/canalesSlice";
import FilterComponent from "../../widgets/FilterComponent";

const FiltroOrdenesDespachoComponent = ({
  findOrdenesDespacho,
  filtrosOrdenesDespacho,
  setFiltrosOrdenesDespacho,
}) => {
  registerLocale("es", es);
  setDefaultLocale("es");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openEndDate, setOpenEndDate] = useState(false);
  const [showFiltroEstados, setShowFiltroEstados] = useState(false);


  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null);
    setOpenEndDate(true);
    setFiltrosOrdenesDespacho({
      ...filtrosOrdenesDespacho,
      fechaInicio: date,
      fechaFinal:
        date > filtrosOrdenesDespacho.fechaFinal
          ? date
          : filtrosOrdenesDespacho.fechaFinal,
    });
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setOpenEndDate(false);
    setFiltrosOrdenesDespacho({
      ...filtrosOrdenesDespacho,
      fechaFinal: date,
    });
  };

  const estadosFilter = [
    { value: "1", name: "Sin Agrupar", color: "red" },
    { value: "2", name: "Seleccionadas", color: "#ffc000" },
    { value: "3", name: "Agrupadas", color: "#ff8400" },
    { value: "4", name: "Con Vehiculo Asignado", color: "#4098B4" },
    { value: "5", name: "Con GRR", color: "#0e008a" },
    { value: "6", name: "Con OT", color: "#32a83e" },
  ];

  const handleChangeFechaButtonFiltro = (tipo) => {
    if (filtrosOrdenesDespacho.btnFechaSelected === tipo)
      setFiltrosOrdenesDespacho({
        ...filtrosOrdenesDespacho,
        btnFechaSelected: "",
      });
    else {
      let fecha = new Date();
      if (tipo === "btnFechaToday") {
        fecha = new Date();
      } else if (tipo === "btnFechaAyer") {
        const fecToday = new Date();
        fecha = new Date(fecToday.setDate(fecToday.getDate() - 1));
      } else if (tipo === "btnFechaSemana") {
        const fecToday = new Date();
        fecha = new Date(fecToday.setDate(fecToday.getDate() - 7));
      }
      setStartDate(fecha);
      setEndDate(fecha);
      setFiltrosOrdenesDespacho({
        ...filtrosOrdenesDespacho,
        btnFechaSelected: tipo,
        fechaInicio: fecha,
        fechaFinal: fecha,
      });
    }
  };

  const handleChangeEstados = (estados) => {
    setFiltrosOrdenesDespacho({
      ...filtrosOrdenesDespacho,
      estados: estados,
    });
  };

  const onSearchFiltroOD = () => {
    const filtros = filtrosOrdenesDespacho;
    delete filtros.btnFechaSelected;
    //alert(JSON.stringify(filtros, null, 2));
    sessionStorage.setItem(
      "filtrosOrdenesDespacho",
      JSON.stringify(filtrosOrdenesDespacho)
    );
    findOrdenesDespacho(1, 10, filtrosOrdenesDespacho);

    /* setFiltrosOrdenesDespacho({
      fechaInicio: new Date(),
      fechaFinal: new Date(),
      filtro1: "numodc",
      filtro2: "",
      filtro3: "",
      btnFechaSelected: "btnFechaToday",
    }); */
  };

  const canales = useSelector((state) => state.canalesState.lista);

  const [listCanales, setListCanales] = useState([]);
  const [showFiltroCanales, setShowFiltroCanales] = useState(false);

  const dispatch = useDispatch();

  const handleChangeCanales = (canales) => {
    setFiltrosOrdenesDespacho({
      ...filtrosOrdenesDespacho,
      canales: canales,
    });
  };

  useEffect(() => {
    if (!(canales.length > 0)) {
      dispatch(fetchCanales());
    }
    const lista = canales.map((c) => ({
      value: c.grupo_codigo,
      name: c.grupo_nombre,
      color: "#0e008c",
    }));
    setListCanales(lista);
  }, [canales]);


  const [listTiendas, setListTiendas] = useState([]);
  const [listTiendasSeleccionada, setListTiendasSeleccionadas] = useState([]);
  const [showFiltroTiendas, setShowFiltroTiendas] = useState(false);
  const changeFiltroTiendas = (e) => {
    let value = e.target.value;
    let isChecked = e.target.checked;
    // Actualiza la lista de tiendas seleccionadas
    setListTiendasSeleccionadas((prevList) => {
      let updatedList;

      if (prevList.includes(value.split("-")[0])) {
        updatedList = prevList.filter((item) => item !== value.split("-")[0]); // Elimina el valor si ya está seleccionado
      } else {
        updatedList = [...prevList, value.split("-")[0]]; // Agrega el valor si no está en la lista
      }

      // Actualiza el string de valores seleccionados separados por comas
      const selectedString = updatedList.join(',');

      // Aquí puedes usar el string `selectedString` como lo necesites, por ejemplo, guardarlo en el estado:
      console.log('String seleccionado:', selectedString);

      return updatedList;
    });
  };

  useEffect(() => {
    const aTiendas = [];
    const aClientes = [];
    listTiendasSeleccionada.forEach((item) => {
      aTiendas.push(item.split("-")[0]);
      aClientes.push(item.split("-")[1]);
    });
    setFiltrosOrdenesDespacho({
      ...filtrosOrdenesDespacho,
      tiendas: aTiendas,
      clientes: aClientes
    })
  }, [listTiendasSeleccionada]);

  const setTiendaByClient = async (value) => {
    try {
      const tiendasData = await getTienda(value);
      if (Array.isArray(tiendasData.result)) {
        const lengthV = tiendasData.result.length;
        console.log(lengthV);
        setShowFiltroTiendas(lengthV !== 0);
        /*
          {
            aux_codaux: "20508565934"
            cit_codcit: "09"
            cit_nomtie: "TOTTUS CHORRILLOS"
          }
        */
        setListTiendas(tiendasData.result);
        console.log(tiendasData.result);
      } else {
        setShowFiltroTiendas(false);
      }
    } catch (error) {
      setShowFiltroTiendas(false);
    }
  }

  const handleChangeFiltrosOrdenadosDespacho = (value) => {
    setFiltrosOrdenesDespacho({
      ...filtrosOrdenesDespacho,
      filtro1: value,
    })
  }


  return (
    <div className="w-1/6 lg:w-1/12 text-center content-center grid justify-items-center">
      <FilterComponent
        title={"Filtrar Ordenes de Despacho"}
        onSearch={onSearchFiltroOD}
      >
        {/*filtro de busqueda */}
        <div>
          <input
            type="text"
            value={filtrosOrdenesDespacho.filtro1}
            className="modal-group-input w-full rounded-md border-blue-800 focus:border-blue-700 focus:shadow-md focus:shadow-blue-400"
            onChange={(e) => handleChangeFiltrosOrdenadosDespacho(e.target.value)}
            onBlur={(e) => setTiendaByClient(e.target.value)}
            placeholder="Orden Despacho, Pedido, Cliente, Grupo"
          />
        </div>

        <div className="filter-group-container">
          <div className="filter-checkbox-container">
            <button
              className={`filter-checkbox-label ${filtrosOrdenesDespacho.btnFechaSelected === "btnFechaToday"
                  ? "bg-blue-800 text-white"
                  : ""
                }`}
              onClick={() => handleChangeFechaButtonFiltro("btnFechaToday")}
            >
              Hoy
            </button>
          </div>
          <div className="filter-checkbox-container">
            <button
              className={`filter-checkbox-label ${filtrosOrdenesDespacho.btnFechaSelected === "btnFechaAyer"
                  ? "bg-blue-800 text-white"
                  : ""
                }`}
              onClick={() => handleChangeFechaButtonFiltro("btnFechaAyer")}
            >
              Ayer
            </button>
          </div>
          <div className="filter-checkbox-container">
            <button
              className={`filter-checkbox-label ${filtrosOrdenesDespacho.btnFechaSelected === "btnFechaSemana"
                  ? "bg-blue-800 text-white"
                  : ""
                }`}
              onClick={() => handleChangeFechaButtonFiltro("btnFechaSemana")}
            >
              Hace 7 dias
            </button>
          </div>
        </div>

        <div className="filter-group-container">
          <div className="w-1/2">
            <label>Desde: </label>
            <DatePicker
              selected={filtrosOrdenesDespacho.fechaInicio}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              locale="es"
              dateFormat="dd/MM/yyyy"
              popperPlacement="bottom-end"
              className="z-10 px-2 py-1.5 border-2 w-full rounded-l-md modal-group-input-md text-sm"
            />
          </div>
          <div className="w-1/2">
            <label>Hasta: </label>
            <DatePicker
              selected={filtrosOrdenesDespacho.fechaFinal}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={filtrosOrdenesDespacho.fechaInicio}
              locale="es"
              /* open={openEndDate} */
              dateFormat="dd/MM/yyyy"
              popperPlacement="bottom-start"
              className="px-2 py-1.5 border-2 w-full rounded-r-md modal-group-input-md text-sm"
            />
          </div>
        </div>

        <button
          onClick={() => setShowFiltroEstados((prev) => !prev)}
          className="w-full text-left border-2 border-blue-800 px-2 py-1 rounded-md flex mb-2"
        >
          <div className="shrink w-full">Estados</div>
          <div className="flex-none">
            {showFiltroEstados ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </div>
        </button>
        {showFiltroEstados && (
          <CheckBoxEstadosComponent
            setFiltroEstados={handleChangeEstados}
            filtroEstados={filtrosOrdenesDespacho.estados}
            estados={estadosFilter}
            className="lg:grid-cols-1"
          />
        )}

        <button
          onClick={() => setShowFiltroCanales((prev) => !prev)}
          className="w-full text-left border-2 border-blue-800 px-2 py-1 rounded-md flex"
        >
          <div className="shrink w-full">Canales</div>
          <div className="flex-none">
            {showFiltroCanales ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </div>
        </button>

        {showFiltroCanales && (
          <CheckBoxEstadosComponent
            estados={listCanales}
            setFiltroEstados={handleChangeCanales}
            filtroEstados={filtrosOrdenesDespacho.canales}
            className="lg:grid-cols-1"
          />
        )}

        <p>Agregar un cliente del tipo Tienda para visualizar</p>
        {showFiltroTiendas && (
          <div className="mt-3 lg:grid lg:grid-cols-3">
            {
              listTiendas.map((tienda, index) => {
                return (
                  <div className="col-span-3 flex items-center" key={index}>
                    <Checkbox
                      inputProps={{ "aria-label": "Checkbox demo" }}
                      sx={{
                        color: "#ff8400",
                        "&.Mui-checked": {
                          color: "red",
                        },
                      }}
                      value={String(tienda.cti_codcti + '-' + tienda.aux_codaux)}
                      onChange={(e) => changeFiltroTiendas(e)}
                    />
                    <label
                      htmlFor="Checkbox demo"
                      className="font-medium text-gray-900 text-sm"
                    >
                      {tienda.cti_nomtie}
                    </label>
                  </div>
                )
              }
              )
            }
          </div>
        )}

      </FilterComponent>
    </div>
  );
};

export default FiltroOrdenesDespachoComponent;
