import React, { useEffect, useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";

import BreadcrumbComponent from "../../components/widgets/BreadcrumbComponent";
import ListOrdenesDespachoComponent from "../../components/distribucion/ListOrdenesDespachoComponent";
import ModalMessage from "../../components/widgets/ModalComponent";
import { CircularProgress, FormControl, MenuItem, Select } from "@mui/material";
import {
  API_DISTRIBUCION,
  API_MAESTRO,
  USERNAME_LOCAL,
} from "../../utils/general";
import {
  convertirDateTimeToDate,
  getFetchFunction,
  postFetchFunctionCustomFunction,
} from "../../utils/funciones";
import TableCollapseMUICustomComponent from "../../components/widgets/TableComponent/TableCollapseMUICustomComponent";
import TableMUICustomComponent from "../../components/widgets/TableComponent/TableMUICustomComponent";
import PaginationCustom from "../../components/widgets/PaginationComponent/PaginationCustom";
import ListVehiculosDisponiblesComponent from "../../components/distribucion/ListVehiculosDisponiblesComponent";
import DatePickerCustom from "../../components/widgets/DatePickerCustom";
import TableCustom from "../../components/widgets/TableComponent";
import {
  AGRUPAR_ORDENES_DESPACHO_PAGE,
  ASIGNAR_VEHICULO_PAGE,
} from "../../utils/properties.text";
import { ERRORS_TEXT } from "../../utils/properties.error.text";
import { setMessage } from "../../redux/features/utils/utilsSlice";
import { useDispatch } from "react-redux";
import FormAgregarGrupoComponent from "../../components/distribucion/FormAgregarGrupoComponent";

function Row(props) {
  const {
    row,
    isMobile,
    vehiculos,
    loadingTableVehiculos,
    setRefreshTable,
    setOpenMessage,
  } = props;
  const [grupo, setGrupo] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const handleChange = (event) => {
    const v_selected = event.target.value;
    console.log(row, v_selected);
    if (
      row.gru_volumen > v_selected.utr_carvol ||
      v_selected.utr_carvol - v_selected.via_volumen < 0
    ) {
      setOpenMessage({
        state: true,
        message: "Este grupo excede la capacidad del vehiculo.",
        type: "warning",
      });
      //return;
    } //else {
    row.chofer = v_selected;
    console.log(row.chofer);
    const dataRequest = {
      viaje: {
        cia_codcia: row.cia_codcia,
        sed_sedcod: row.sed_sedcod,
        utr_codutr: row.chofer.utr_codutr,
        utr_plautr: row.chofer.utr_plautr,
        via_desfch: convertirDateTimeToDate(row.gru_desfch),
        cho_codcho: row.chofer.cho_codcho,
        via_volumen: row.gru_volumen,
        via_bultos: row.gru_bultos,
        via_peso: row.gru_peso,
        via_monto: row.gru_monto,
        via_nroode: row.gru_nroode,
        via_updusu: USERNAME_LOCAL,
        utr_marutr: row.chofer.utr_marutr,
      },
      grupo: row.gru_grucod,
    };

    const updateTable = (data) => {
      setRefreshTable((prev) => !prev);
    };

    postFetchFunctionCustomFunction(
      `${API_DISTRIBUCION}/grupo/asignarVehiculo`,
      dataRequest,
      setOpenMessage,
      updateTable
    );
    //}
  };

  const handleChangeAcople = (event) => {
    const v_selected = event.target.value;
    console.log(row, v_selected);
    if (
      row.gru_volumen > v_selected.utr_carvol ||
      v_selected.utr_carvol - v_selected.via_volumen < 0
    ) {
      setOpenMessage({
        state: true,
        message: "Este grupo excede la capacidad del vehiculo.",
        type: "warning",
      });
      //return;
    } //else {
    row.acople = v_selected;
    const dataRequest = {
      grupo: row.gru_grucod,
      acople_placa: row.acople.utr_plautr,
      via_updusu: USERNAME_LOCAL,
    };
    console.log("acople", dataRequest);

    const updateTable = (data) => {
      setRefreshTable((prev) => !prev);
    };

    postFetchFunctionCustomFunction(
      `${API_DISTRIBUCION}/grupo/asignarAcople`,
      dataRequest,
      setOpenMessage,
      updateTable
    );
    //}
  };

  const handleDelete = (grupo) => {
    setGrupo(grupo);
    setOpenModalDelete(true);
  };

  const onDeletedVehiculo = () => {
    const dataDelete = {
      viaje: {
        utr_codutr: grupo.utr_codutr,
        cia_codcia: grupo.cia_codcia,
        idviaje: grupo.idviaje,
        via_monto: grupo.gru_monto,
        via_nroode: grupo.gru_nroode,
        via_peso: grupo.gru_peso,
        via_volumen: grupo.gru_volumen,
        via_monto: grupo.gru_monto,
        via_bultos: grupo.gru_bultos,
        via_updusu: USERNAME_LOCAL,
      },
      grupo: grupo.gru_grucod,
    };

    const updateTable = (data) => {
      setRefreshTable((prev) => !prev);
    };
    postFetchFunctionCustomFunction(
      `${API_DISTRIBUCION}/grupo/eliminarVehiculoAsignado`,
      dataDelete,
      setOpenMessage,
      updateTable
    );
    setOpenModalDelete(false);
  };

  const onDeleteAcople = () => {
    const dataRequest = {
      grupo: row.gru_grucod,
      acople_placa: "",
      via_updusu: USERNAME_LOCAL,
    };

    const updateTable = (data) => {
      setRefreshTable((prev) => !prev);
    };

    postFetchFunctionCustomFunction(
      `${API_DISTRIBUCION}/grupo/asignarAcople`,
      dataRequest,
      setOpenMessage,
      updateTable
    );
    //}
  };

  console.log("ROW", vehiculos);

  return (
    <React.Fragment>
      <TableCollapseMUICustomComponent
        titleSubTable={""}
        subtable={
          <ListOrdenesDespachoComponent
            ordenesDespacho={row.ordenDespachos}
            setOrdenesDespacho={() => <></>}
            showButtonDelete={false}
            showPagination={false}
            titlePage={ASIGNAR_VEHICULO_PAGE.titlePage}
            loadingTable={false}
            showGrupo={false}
          />
        }
        colSpanSubTable={
          AGRUPAR_ORDENES_DESPACHO_PAGE.tableListOrdenes.length - 1
        }
      >
        {isMobile ? (
          <>
            <TableCell colSpan={2}>
              <div>
                <span className={`rounded-md px-2 font-semibold `}>
                  {row.gru_grucod}
                </span>
              </div>
              <div>{row.sed_sedcod}</div>
              <div>
                <div>Volumen total (m3):</div>
                {row.gru_volumen}
              </div>
              <div>
                <div>Monto total:</div>
                {row.gru_monto}
              </div>
              <div>
                <div>Ubigeo:</div>
                {row.gru_des_ubigeo}
              </div>
            </TableCell>
            <TableCell colSpan={1}>
              {row.idviaje > 0 ? (
                <div className="flex space-x-2 justify-center w-full">
                  <div>{row.idviaje}</div>
                  {row.gru_estado === "2" && (
                    <button className="">
                      <DeleteIcon className="text-red-600" />
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {/* <button
                    className="bg-black text-white p-1 sm:py-2 sm:px-4 rounded-md"
                    onClick={() => handleAsignGroup(row)}
                  >
                    Asignar Vehiculo
                  </button> */}
                  <FormControl
                    fullWidth
                    className="form-container-group-content-input"
                  >
                    <Select
                      style={{
                        border: "0.5px #0055B8 solid",
                        boxShadow: "--tw-ring-color: #0055B8",
                        outline: "none",
                      }}
                      onChange={handleChange}
                      className="border-blue-200"
                    >
                      {!loadingTableVehiculos &&
                        vehiculos.result.length > 0 &&
                        vehiculos.result.map((v) => (
                          <MenuItem value={v} key={v.utr_codutr}>
                            {v.utr_carvol} (m3) - {v.utr_plautr} -{" "}
                            {v.cho_nombre}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
              )}
            </TableCell>
          </>
        ) : (
          <>
            <TableCell align="center">
              <span
                className={`rounded-md px-2 py-1 font-semibold text-white text-sm flex items-center ${
                  !row.utr_plautr ? "bg-red" : "bg-green-500"
                }`}
              >
                {row.gru_grucod}
              </span>
            </TableCell>
            <TableCell align="center">{row.sed_descor}</TableCell>
            <TableCell align="center">{row.gru_volumen}</TableCell>
            <TableCell align="center">{row.gru_bultos}</TableCell>
            <TableCell align="center">{row.gru_peso}</TableCell>
            <TableCell align="center">{row.gru_nroode}</TableCell>
            <TableCell align="center">{row.gru_monto}</TableCell>
            <TableCell align="center">{row.gru_des_ubigeo}</TableCell>
            <TableCell align="center" colSpan={1} width={20}>
              {row.idviaje > 0 ? (
                <div className="flex space-x-2 justify-center w-full">
                  <div>{row.utr_plautr}</div>
                  {row.gru_estado === "2" && (
                    <button onClick={() => handleDelete(row)}>
                      <DeleteIcon className="text-red-600" />
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {
                    <FormControl
                      fullWidth
                      className="form-container-group-content-input"
                    >
                      <Select
                        style={{
                          border: "0.5px #0055B8 solid",
                          boxShadow: "--tw-ring-color: #0055B8",
                          outline: "none",
                        }}
                        onChange={handleChange}
                        value={row.chofer}
                        className="border-blue-200"
                        size="small"
                      >
                        {!loadingTableVehiculos &&
                          vehiculos.result.length > 0 &&
                          vehiculos.result.map(
                            (v) =>
                              /*  v.volDisponible -  */ row.gru_volumen >= 0 &&
                              v.utr_carvol > 0 &&
                              v.acople === "0" && (
                                <MenuItem value={v} key={v.utr_codutr}>
                                  {v.utr_carvol} (m3) - {v.utr_carton} (Tn) -{" "}
                                  {v.utr_plautr} - {v.cho_nombre}
                                </MenuItem>
                              )
                          )}
                      </Select>
                    </FormControl>
                  }
                </div>
              )}
            </TableCell>
            <TableCell align="center" colSpan={1} width={20}>
              {row.idviaje > 0 && row.acople_placa ? (
                <div className="flex space-x-2 justify-center w-full">
                  <div>{row.acople_placa}</div>
                  {row.gru_estado === "2" && (
                    <button onClick={() => onDeleteAcople("")}>
                      <DeleteIcon className="text-red-600" />
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {
                    <FormControl
                      fullWidth
                      className="form-container-group-content-input"
                    >
                      <Select
                        style={{
                          border: "0.5px #0055B8 solid",
                          boxShadow: "--tw-ring-color: #0055B8",
                          outline: "none",
                        }}
                        onChange={handleChangeAcople}
                        value={row.acople}
                        className="rounded-md w-20"
                        size="small"
                      >
                        {!loadingTableVehiculos &&
                          vehiculos.result.length > 0 &&
                          vehiculos.result.map(
                            (v) =>
                              /*  v.volDisponible -  */ row.gru_volumen >= 0 &&
                              v.utr_carvol > 0 &&
                              v.acople === "1" &&
                              row.idviaje > 0 && (
                                <MenuItem value={v} key={v.utr_codutr}>
                                  {v.utr_carvol} (m3) - {v.utr_carton} (Tn) -{" "}
                                  {v.utr_plautr} - {v.cho_nombre}
                                </MenuItem>
                              )
                          )}
                      </Select>
                    </FormControl>
                  }
                </div>
              )}
            </TableCell>
          </>
        )}
      </TableCollapseMUICustomComponent>

      <ModalMessage
        open={openModalDelete}
        setOpen={setOpenModalDelete}
        title={"Eliminar Vehiculo"}
        titleBtnAceptar={"Eliminar"}
        onBtnAceptar={() => onDeletedVehiculo()}
        showButtons={true}
        isMessage={true}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          ¿Estas seguro de eliminar?
        </div>
      </ModalMessage>
    </React.Fragment>
  );
}

//const rows = listGroupsFake.result;

const AsignarVehiculoPage = () => {
  const [grupos, setGrupos] = useState({ result: [], totalRows: 0 });

  const [loadingTable, setLoadingTable] = useState(true);
  const [refreshTable, setRefreshTable] = useState(false);

  const [filterFechaEntrega, setFilterFechaEntrega] = useState(new Date());
  const [filtroEstadosVehDis, setFiltroEstadosVehDis] = useState(1);
  const [filterIdViaje, setfilterIdViaje] = useState(0);

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const handleChangeFechaEntrega = (date) => {
    setFilterFechaEntrega(date);
    setRefreshTable((prev) => !prev);
  };

  const fetchGrupos = async (
    page,
    limit,
    fechaEntrega = convertirDateTimeToDate(filterFechaEntrega),
    idviaje = 0
  ) => {
    try {
      getFetchFunction(
        `${API_DISTRIBUCION}/grupo/lista?limit=${limit}&page=${page}&cia=01&dateStart=${fechaEntrega}&dateEnd=${fechaEntrega}&estados=1,2,3&viaje=${idviaje}`,
        setLoadingTable,
        setGrupos
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

  useEffect(() => {
    fetchGrupos(1, 10, convertirDateTimeToDate(filterFechaEntrega), 0);
  }, [refreshTable]);

  const [vehiculos, setVehiculos] = useState({ result: [] });
  const [loadingTableVehiculos, setLoadingTableVehiculos] = useState(true);

  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [
    loadingTableVehiculosDisponibles,
    setLoadingTableVehiculosDisponibles,
  ] = useState(true);

  useEffect(() => {
    const setDataVehiculosDisponibles = (data) => {
      //let arrayVehDis = data.result.filter((v) => v.cho_codcho != "");
      setVehiculosDisponibles(data);

      const setDataVehiculos = (dataVehiculos) => {
        let arrayVeh = dataVehiculos.result.filter((v) => v.cho_codcho != "");

        arrayVeh = arrayVeh.map((v) => {
          let vDisponible = data.result.find(
            (vd) => vd.utr_plautr === v.utr_plautr
          ) || { via_volumen: 0 };
          let volDisponible = v.utr_carvol - vDisponible.via_volumen;
          v.volDisponible = volDisponible;
          return v;
        });
        //let omitirVehiculos = data.result.filter(v=> (v.utr_carvol - v.via_volumen == 0));

        setVehiculos({ result: arrayVeh });
      };

      getFetchFunction(
        `${API_MAESTRO}/unidadesTransporte/lista?empresa=01`,
        setLoadingTableVehiculos,
        setDataVehiculos
      );
    };

    getFetchFunction(
      `${API_DISTRIBUCION}/viaje/unidadesTransporteAsignadas?cia=01&fechaEntrega=${convertirDateTimeToDate(
        filterFechaEntrega
      )}&estados=${filtroEstadosVehDis}`,
      setLoadingTableVehiculosDisponibles,
      setDataVehiculosDisponibles
    );
  }, [refreshTable]);

  const [openModalFormGrupo, setopenModalFormGrupo] = useState(false);

  return (
    <div className="page-container">
      <div className="page-container-header-page">
        <div className="page-container-header-page-title-content">
          <BreadcrumbComponent
            message={`${ASIGNAR_VEHICULO_PAGE.titlePage} [${grupos.totalRows}]`}
          />
        </div>
        <div className="page-container-header-page-two-group">
          <div className="page-container-header-page-two-group-item">
            <button
              className="btn-base-black"
              onClick={() => setopenModalFormGrupo(true)}
            >
              Agregar grupo
            </button>
          </div>
          <div className="page-container-header-page-two-group-item">
            <label htmlFor="">Fecha de inicio de Traslado</label>
            <DatePickerCustom
              selected={filterFechaEntrega}
              value={filterFechaEntrega}
              onChange={(date) => handleChangeFechaEntrega(date)}
            />
          </div>
        </div>
      </div>

      <ModalMessage
        open={openModalFormGrupo}
        setOpen={setopenModalFormGrupo}
        title={"Agregar nuevo Grupo"}
        titleBtnAceptar={""}
        showButtons={false}
        onBtnAceptar={() => setopenModalFormGrupo(false)}
      >
        <FormAgregarGrupoComponent
          setOpenModal={setopenModalFormGrupo}
          fechaSalida={filterFechaEntrega}
          setOpenMessage={setOpenMessage}
          setRefreshTable={setRefreshTable}
        />
      </ModalMessage>

      <div className="hidden py-2 md:py-4 sm:grid grid-cols-5 gap-4">
        <div className="col-span-2">
          <ListVehiculosDisponiblesComponent
            setRefreshTable={setRefreshTable}
            vehiculosDisponibles={vehiculosDisponibles}
            setVehiculosDisponibles={setVehiculosDisponibles}
            loadingTableVehiculos={loadingTableVehiculosDisponibles}
            setFiltroEstadosVehDis={setFiltroEstadosVehDis}
            filtroEstadosVehDis={filtroEstadosVehDis}
            setfilterIdViaje={setfilterIdViaje}
            fetchGrupos={fetchGrupos}
          />
        </div>
        <div className="col-span-3 desktop">
          <PaginationCustom
            totalRows={grupos.totalRows}
            fetchData={fetchGrupos}
            refreshTable={refreshTable}
            showLimit={false}
          >
            <div className="overflow-auto">
              <TableCustom
                cols={ASIGNAR_VEHICULO_PAGE.table_grupos_titles(false)}
                mini={true}
              >
                {!loadingTable ? (
                  grupos.result.map((row) => (
                    <Row
                      key={row.id}
                      row={row}
                      isMobile={false}
                      loadingTable={loadingTable}
                      vehiculos={vehiculos}
                      loadingTableVehiculos={loadingTableVehiculos}
                      setOpenMessage={setOpenMessage}
                      setRefreshTable={setRefreshTable}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={
                        ASIGNAR_VEHICULO_PAGE.table_grupos_titles(false).length
                      }
                    >
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                )}
              </TableCustom>
            </div>
          </PaginationCustom>
        </div>
      </div>

      <div className="mobile">
        <TableMUICustomComponent
          cols={ASIGNAR_VEHICULO_PAGE.tableMobile_grupos_titles}
        >
          {!loadingTable ? (
            grupos.result.map((row, index) => (
              <Row
                key={index}
                row={row}
                isMobile={true}
                loadingTable={loadingTable}
                vehiculos={vehiculos}
                setVehiculos={setVehiculos}
                setOpenMessage={setOpenMessage}
                setRefreshTable={setRefreshTable}
              />
            ))
          ) : (
            <td
              colSpan={ASIGNAR_VEHICULO_PAGE.tableMobile_grupos_titles.length}
            >
              <CircularProgress />
            </td>
          )}
        </TableMUICustomComponent>
      </div>
    </div>
  );
};

export default AsignarVehiculoPage;
