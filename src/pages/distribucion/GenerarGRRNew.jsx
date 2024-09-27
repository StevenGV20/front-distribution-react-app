import React, { useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";

import BreadcrumbComponent from "../../components/widgets/BreadcrumbComponent";
import ListOrdenesDespachoComponentNEW from "../../components/distribucion/ListOrdenesDespachoComponentNew";
import PaginationCustom from "../../components/widgets/PaginationComponent/PaginationCustom";
import {
  API_DISTRIBUCION,
  URL_MASTERLOGIC_API,
  USERNAME_LOCAL,
} from "../../utils/general";
import { objOrdenesDespachoEntity } from "../../api/ordenesDespachoApi";
import {
  getFetchFunction,
  convertirDateTimeToDate,
  postFetchFunctionCustomFunction,
} from "../../utils/funciones";
import { GGUIA_REMISION_REMITENTE_PAGE } from "../../utils/properties.text";
import ModalMessage from "../../components/widgets/ModalComponent";
import DatePickerCustom from "../../components/widgets/DatePickerCustom";
import LoaderAllComponent from "../../components/widgets/ModalComponent/LoaderAllComponent";
import {
  ERRORS_TEXT,
  GGUIA_REMISION_REMITENTE_PAGE_ERROR_TEXT,
} from "../../utils/properties.error.text";
import { setMessage } from "../../redux/features/utils/utilsSlice";
import { useDispatch } from "react-redux";
import ListGruposComponent from "../../components/distribucion/ListGruposComponent";
import axios from "axios";
import TableCustom from "../../components/widgets/TableComponent";
import { CircularProgress, FormControl, MenuItem, Select } from "@mui/material";

const GenerarGRRNew = () => {
  const [openModal, setOpenModal] = useState(false);

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  registerLocale("es", es);
  setDefaultLocale("es");

  const [grupos, setGrupos] = useState({ result: [], totalRows: 0 });

  const [loadingTableGrupos, setLoadingTableGrupos] = useState(true);
  const [refreshTableGrupos, setRefreshTableGrupos] = useState(false);

  const fetchGrupos = async (
    page,
    limit,
    fechaEntrega = convertirDateTimeToDate(filterFechaEntrega),
    idviaje = 0
  ) => {
    try {
      getFetchFunction(
        `${API_DISTRIBUCION}/grupo/lista?limit=${limit}&page=${page}&cia=01&dateStart=${fechaEntrega}&dateEnd=${fechaEntrega}&estados=1,2,3&viaje=${idviaje}`,
        setLoadingTableGrupos,
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

        /* if (data.result.length > 0) {
          data.result.map((g) => {
            setListODs([...listODs, ...g.ordenDespachos]);
          });
        } */
      });
    } catch (error) {
      console.error(error);
    }
  };

  const [refreshTable, setRefreshTable] = useState(true);
  const [loaderComponent, setLoaderComponent] = useState(false);

  const [ordenesDespacho, setOrdenesDespacho] = useState(
    objOrdenesDespachoEntity
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [loadingTable, setLoadingTable] = useState(true);

  const [filterFechaEntrega, setFilterFechaEntrega] = useState(new Date());

  const [filterFechasGRR, setFilterFechasGRR] = useState({
    fechaInicio: new Date(),
    fechaFinal: new Date(),
  });

  const handleChangeFechaEntrega = (date) => {
    setFilterFechaEntrega(date);
    setRefreshTable((prev) => !prev);
  };

  useEffect(() => {
    //findOrdenesDespacho(1, 50);
    fetchGrupos(1, 1000, convertirDateTimeToDate(filterFechaEntrega), 0);
    onFindGuias();
  }, [refreshTable]);

  //const itemsPerPage = 100; // Número de ítems por página

  //const indexOfLastItem = currentPage * itemsPerPage;
  //const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const onImportarMasivoGRR = async (type) => {
    /* 
    let values = [];
    if (type === 1) {
      //values = listODs;
      values = listODs.map((od) => ({
        cia_codcia: "01",
        odc_numodc: od.odc_numodc,
        odc_regusu: USERNAME_LOCAL,
      }));
    } else {
      values = listODs
        .filter((od) => od.grc_numdoc == "")
        .map((od) => ({
          cia_codcia: "01",
          odc_numodc: od.odc_numodc,
          grc_tipdoc: od.grc_tipdoc,
          grc_numdoc: od.grc_numdoc,
          odc_regusu: USERNAME_LOCAL,
        }));
    }
    console.log("listODs", values);
 */
    const updateTable = () => {
      setRefreshTable((prev) => !prev);
      setOpenModal(false);
      setLoaderComponent(false);
    };

    setLoaderComponent(true);

    postFetchFunctionCustomFunction(
      `${API_DISTRIBUCION}/guiaRemisionRemitente/importarMasivo?fecha=${convertirDateTimeToDate(
        filterFechaEntrega
      )}&tipo=${type.toString()}`,
      {},
      setOpenMessage,
      updateTable
    ).catch((err) => {
      setLoaderComponent(false);
      console.log(err);
    });

    /* postFetchFunctionCustomFunction(
      `${API_DISTRIBUCION}/ordenDespacho/importarGuiasRemision`,
      values,
      setOpenMessage,
      updateTable
    ); */
  };
  //const totalPages = Math.ceil(ordenesDespacho.result.length / itemsPerPage);

  const [guiasRemisionRemitente, setGuiasRemisionRemitente] = useState({
    result: [],
  });
  const [loadingTableGuias, setLoadingTableGuias] = useState(true);

  //const [listODs, setListODs] = useState([]);

  const onFindGuias = async () => {
    setLoadingTableGuias(true);
    await axios
      .get(
        `${URL_MASTERLOGIC_API}${API_DISTRIBUCION}/guiaRemisionRemitente/listByFechas?fechaInicio=${convertirDateTimeToDate(
          filterFechasGRR.fechaInicio
        )}&fechaFinal=${convertirDateTimeToDate(filterFechasGRR.fechaFinal)}`
      )
      .then((res) => {
        console.log(res.data);
        setGuiasRemisionRemitente(res.data);
        setLoadingTableGuias(false);

        /* if(res.data.result){
          res.data.result.map(obj => {
            setListODs([...listODs,...obj.ordenDespachos])
          })
        } */
      })
      .catch((err) => {
        setLoadingTableGuias(false);
        setOpenMessage({
          state: true,
          message: ERRORS_TEXT.fetchError,
          type: ERRORS_TEXT.typeError,
        });
        console.log(err);
      });
  };

  const handleChangeGrupo = (event, grr) => {
    const grupo_selected = event.target.value;
    console.log("grupo_Selected ", grupo_selected);

    const dataRequest = {
      cia_codcia: grupo_selected.cia_codcia || "",
      suc_codsuc: grupo_selected.sed_sedcod || "",
      odc_estado: "3",
      aux_codaux: grr.aux_codaux,
      odc_usucre: localStorage.getItem("USERNAME"),
      grc_tipdoc: grr.tdo_codtdo,
      grc_numdoc: grr.grc_numdoc,
      aux_nomaux: "",
      odc_ubigeo: "",
      odc_dirdes: "",
      aux_agetra: grr.aux_agetra,
      aux_pna_nombre: "",
      aux_pna_dirpna: "",
      agencia_ubi: grr.agencia_ubigeo || "",
      agencia_dire: grr.agencia_direccion || "",
      ruta_codd: "",
      sede: grupo_selected.sed_sedcod || "",
      odc_distancia: "",
      gru_grucod: grupo_selected.gru_grucod,
    };

    //console.log("dataRequest:", dataRequest);

    const updateTable = () => {
      setRefreshTable((prev) => !prev);
      setOpenModal(false);
      setLoaderComponent(false);
    };

    setLoaderComponent(true);

    postFetchFunctionCustomFunction(
      `${API_DISTRIBUCION}/guiaRemisionRemitente/asignarToOD`,
      dataRequest,
      setOpenMessage,
      updateTable
    ).catch((err) => {
      setLoaderComponent(false);
    });
  };

  const onReAgruparOrdenes = () => {
    let listGrupos = "";
    grupos.result.map(
      (o, index) =>
        o.ordenDespachos.length > 0 &&
        (listGrupos += (index > 0 ? "," : "") + o.gru_grucod)
    );

    const request = {
      listaGrupos: listGrupos,
      cia: "01",
      username: localStorage.getItem("USERNAME"),
      fecha: convertirDateTimeToDate(filterFechaEntrega),
    };

    console.log(request);

    const updateTable = () => {
      setRefreshTable((prev) => !prev);
      setOpenModalReAgrupar(false);
      setLoaderComponent(false);
    };

    setLoaderComponent(true);

    postFetchFunctionCustomFunction(
      `${API_DISTRIBUCION}/grupo/reAgruparODs`,
      request,
      setOpenMessage,
      updateTable
    ).catch((err) => {
      setLoaderComponent(false);
    });
  };

  const [openModalReAgrupar, setOpenModalReAgrupar] = useState(false);

  return (
    <div className="page-container">
      <div className="page-container-header-page">
        <div className="page-container-header-page-title-content">
          <BreadcrumbComponent
            message={`${GGUIA_REMISION_REMITENTE_PAGE.titlePage} [${
              (ordenesDespacho.totalRows &&
                ordenesDespacho.totalRows.totalrows) ||
              0
            }]`}
          />
        </div>
      </div>
      <LoaderAllComponent open={loaderComponent} setOpen={setLoaderComponent} />

      <ModalMessage
        open={openModal}
        setOpen={setOpenModal}
        title={GGUIA_REMISION_REMITENTE_PAGE.titleModalImportarGRR}
        onBtnAceptar={() => setOpenModal(false)}
        showButtons={false}
        isMessage={true}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          {GGUIA_REMISION_REMITENTE_PAGE.msgConfirmacionImportar}
        </div>
        <div className="bg-gray-50 px-4 mt-2 mb-3 space-y-2 sm:space-y-0 sm:flex sm:px-6 sm:space-x-2 md:columns-3">
          <button
            type="button"
            className="flex w-full col-span-1 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 items-center"
            onClick={() => setOpenModal(false)}
          >
            No
          </button>
          <button
            type="button"
            className="form-buttons-btn text-white bg-red-500"
            onClick={() => onImportarMasivoGRR(1)}
          >
            Forzar Todos
          </button>
          <button
            type="button"
            className="form-buttons-btn form-buttons-btn-red"
            onClick={() => onImportarMasivoGRR(0)}
          >
            Si
          </button>
        </div>
      </ModalMessage>

      <ModalMessage
        open={openModalReAgrupar}
        setOpen={setOpenModalReAgrupar}
        title={GGUIA_REMISION_REMITENTE_PAGE.titleModalReAgrupar}
        onBtnAceptar={() => onReAgruparOrdenes(false)}
        showButtons={true}
        isMessage={true}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          {GGUIA_REMISION_REMITENTE_PAGE.msgConfirmacionReAgrupar}
        </div>
        {/* <div className="w-full text-center text-lg p-0 font-semibold">
          {GGUIA_REMISION_REMITENTE_PAGE.msgConfirmacionImportar}
        </div>
        <div className="bg-gray-50 px-4 mt-2 mb-3 space-y-2 sm:space-y-0 sm:flex sm:px-6 sm:space-x-2 md:columns-3">
          <button
            type="button"
            className="flex w-full col-span-1 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 items-center"
            onClick={() => setOpenModalReAgrupar(false)}
          >
            No
          </button>
          <button
            type="button"
            className="form-buttons-btn form-buttons-btn-red"
            onClick={() => onReAgruparOrdenes()}
          >
            Si
          </button>
        </div> */}
      </ModalMessage>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexWrap: "wrap", // Permite que los elementos se ajusten en pantallas pequeñas
          gap: "20px", // Añade un espacio entre los elementos
        }}
      >
        {/* Primera lista */}
        <div className="w-2/3">
          <div className="w-full flex space-x-2 mb-2">
            <div className="page-container-header-page-two-group-item">
              <label htmlFor="">
                {GGUIA_REMISION_REMITENTE_PAGE.filtroFechaSalidaLabel}
              </label>
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
                className="react-btn-base w-48"
              >
                {GGUIA_REMISION_REMITENTE_PAGE.btnImportarGRR}
              </button>
            </div>
            <div className="page-container-header-page-two-group-item">
              <button
                onClick={() => setOpenModalReAgrupar(true)}
                className="react-btn-base w-48"
              >
                Reagrupar
              </button>
            </div>
          </div>
          <ListGruposComponent
            grupos={grupos}
            loadingTable={loadingTableGrupos}
            vehiculos={[]}
            loadingTableVehiculos={false}
            setRefreshTable={refreshTableGrupos}
            titlePage={GGUIA_REMISION_REMITENTE_PAGE.titlePage}
          />
        </div>

        {/* Segunda y tercera lista apiladas verticalmente */}
        <div
          style={{
            flex: 1,
            minWidth: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div className="w-full flex space-x-2">
            <div>
              <label htmlFor="">Desde:</label>
              <DatePickerCustom
                selected={filterFechasGRR.fechaInicio}
                value={filterFechasGRR.fechaInicio}
                onChange={(date) =>
                  setFilterFechasGRR({
                    fechaFinal: filterFechasGRR.fechaFinal,
                    fechaInicio: date,
                  })
                }
                classname="input-filter-fecha"
              />
            </div>
            <div>
              <label htmlFor="">Hasta:</label>
              <DatePickerCustom
                selected={filterFechasGRR.fechaFinal}
                value={filterFechasGRR.fechaFinal}
                onChange={(date) =>
                  setFilterFechasGRR({
                    fechaInicio: filterFechasGRR.fechaInicio,
                    fechaFinal: date,
                  })
                }
                classname="input-filter-fecha"
              />
            </div>
            <div className="mt-6">
              <button
                className="react-btn-base h-12"
                onClick={() => onFindGuias()}
              >
                Filtrar
              </button>
            </div>
          </div>
          {/* Segunda lista */}
          <div>GRR Faltantes</div>
          <TableCustom
            cols={GGUIA_REMISION_REMITENTE_PAGE.tbGuiasRemisionHeaders}
            mini={true}
            maxHeight={40}
          >
            {!loadingTableGuias ? (
              guiasRemisionRemitente.result.length > 0 ? (
                guiasRemisionRemitente.result.map(
                  (grr) =>
                    !grr.odc_numodc &&
                    grr.grc_numdoc !== grr.grc_numdoc_imp && (
                      <tr>
                        <td>{grr.aux_codaux}</td>
                        <td>{grr.grc_numdoc}</td>
                        <td className="w-48">
                          <div className="w-full">
                            <span>{grr.aux_agetra}</span>
                            <br />
                            <span>{grr.agencia_direccion}</span>
                            <br />
                            <span>{grr.agencia_ubigeo}</span>
                          </div>
                        </td>
                        <td>{grr.odc_numodc}</td>
                        <td>
                          <div>
                            <div>
                              <select
                                style={{
                                  border: "0.5px #0055B8 solid",
                                  boxShadow: "--tw-ring-color: #0055B8",
                                  outline: "none",
                                  height: "14 px",
                                }}
                                onChange={(e) => handleChangeGrupo(e, grr)}
                                className="border-blue-200"
                              >
                                <option value=""></option>
                                {grupos.result.length > 0 &&
                                  grupos.result.map((g) => (
                                    <option value={g} key={g.gru_grucod}>
                                      {g.gru_grucod}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                )
              ) : (
                <tr>
                  <td
                    colSpan={
                      GGUIA_REMISION_REMITENTE_PAGE.tbGuiasRemisionHeaders
                        .length
                    }
                  >
                    No hay data
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td
                  colSpan={
                    GGUIA_REMISION_REMITENTE_PAGE.tbGuiasRemisionHeaders.length
                  }
                >
                  <CircularProgress />
                </td>
              </tr>
            )}
          </TableCustom>

          {/* Tercera lista */}
          <div>GRR Asignadas</div>

          <TableCustom
            cols={GGUIA_REMISION_REMITENTE_PAGE.tbGuiasRemisionHeaders}
            mini={true}
            maxHeight={40}
          >
            {!loadingTableGuias ? (
              guiasRemisionRemitente.result.length > 0 ? (
                guiasRemisionRemitente.result.map(
                  (grr) =>
                    grr.odc_numodc &&
                    grr.gru_grucod && (
                      <tr>
                        <td>{grr.aux_codaux}</td>
                        <td>{grr.grc_numdoc}</td>
                        <td className="w-48">
                          <div className="w-full">
                            <span>{grr.aux_agetra}</span>
                            <br />
                            <span>{grr.agencia_direccion}</span>
                            <br />
                            <span>{grr.agencia_ubigeo}</span>
                          </div>
                        </td>
                        <td>{grr.odc_numodc}</td>
                        <td>{grr.gru_grucod}</td>
                        <td></td>
                      </tr>
                    )
                )
              ) : (
                <tr>
                  <td
                    colSpan={
                      GGUIA_REMISION_REMITENTE_PAGE.tbGuiasRemisionHeaders
                        .length
                    }
                  >
                    No hay data
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td
                  colSpan={
                    GGUIA_REMISION_REMITENTE_PAGE.tbGuiasRemisionHeaders.length
                  }
                >
                  <CircularProgress />
                </td>
              </tr>
            )}
          </TableCustom>
        </div>
      </div>
    </div>
  );
};

export default GenerarGRRNew;
