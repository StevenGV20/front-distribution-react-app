import React, { useEffect, useRef, useState } from "react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { CircularProgress } from "@mui/material";
import { FaFileExcel } from "react-icons/fa6";
import SearchIcon from "@mui/icons-material/Search";

import { BANDEJA_LLENADO_HORAS_PAGE } from "../../utils/properties.text";
import DatePickerCustom from "../../components/widgets/DatePickerCustom";
import BreadcrumbComponent from "../../components/widgets/BreadcrumbComponent";
import TableCustom from "../../components/widgets/TableComponent";
import ModalMessage from "../../components/widgets/ModalComponent";
import {
  API_DISTRIBUCION,
  URL_MASTERLOGIC_API,
  USERNAME_LOCAL,
} from "../../utils/general";
import {
  convertirDateTimeToDate,
  convertirDateTimeToDateYYYYMMDD,
  getFetchFunction,
  ordenarAlfabeticamente,
  postFetchFunction,
} from "../../utils/funciones";
import { ERRORS_TEXT } from "../../utils/properties.error.text";
import LoaderAllComponent from "../../components/widgets/ModalComponent/LoaderAllComponent";
import ListTareoTrabajadoresComponent from "../../components/distribucion/ListTareoTrabajadoresComponent";
import FiltroTareoTrabajadoresComponent from "../../components/distribucion/FiltroTareoTrabajadoresComponent";
import TooltipCustomComponent from "../../components/widgets/TooltipCustomComponent";

import { useSelector, useDispatch } from "react-redux";
import { setMessage } from "../../redux/features/utils/utilsSlice";
import ExportarExcelAPIComponent from "../../components/widgets/ExportarExcelComponent/exportacionByAPI";
import axios from "axios";

const BandejaViajesPage = () => {
  const [filterFechaEntrega, setFilterFechaEntrega] = useState(
    new Date().setDate(new Date().getDate() - 1)
  );
  const [loadingTable, setLoadingTable] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [refreshTable, setRefreshTable] = useState(false);
  const handleChangeFechaEntrega = (date) => {
    setFilterFechaEntrega(date);
    setLoadingTable(true);
    setTrabajadores({ result: [] });
    //reiniciarData()
    setRefreshTable((prev) => !prev);
  };

  const [modalIniciaTareo, setModalIniciaTareo] = useState(false);
  const [modalConfirmacionSAP, setModalConfirmacionSAP] = useState(false);

  const [trabajadores, setTrabajadores] = useState({ result: [] });
  const [loaderComponent, setLoaderComponent] = useState(false);
  const [viajes, setViajes] = useState({ result: [] });
  const [loadingTableViajes, setLoadingTableViajes] = useState(true);
  const [totalRows, setTotalRows] = useState(0);

  const [filtrosTareo, setFiltrosTareo] = useState({
    texto: "",
  });

  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  /**
   * Llama a la API para buscar las marcaciones importadas del dia y registrar su tareo
   * @param {int} pageCustom
   * @param {int} limit
   */
  const findMarcaciones = (
    pageCustom = 1,
    limit = BANDEJA_LLENADO_HORAS_PAGE.limit
  ) => {
    //setLoaderComponent(true);
    const fetchData = async () => {
      const setData = (data) => {
        let myList =
          pageCustom === 1
            ? [...data.result]
            : ordenarAlfabeticamente(
                [...trabajadores.result, ...data.result],
                "tra_nombre"
              );

        setTrabajadores({
          result: myList,
        });
      };

      await getFetchFunction(
        `${API_DISTRIBUCION}/cuadreMano/listaTareo?limit=${limit}&page=${pageCustom}&cia=06&fecha=${convertirDateTimeToDateYYYYMMDD(
          filterFechaEntrega
        )}&texto=${filtrosTareo.texto.trim()}`,
        setLoadingTable,
        setData
      ).then((data) => {
        setLoaderComponent(false);
        setTotalRows(data.totalRows);
        setTotalPages(
          parseInt(data.totalRows / BANDEJA_LLENADO_HORAS_PAGE.limit) + 1
        );
        if (
          typeof data !== "undefined" &&
          data.toString().includes("Failed to fetch")
        ) {
          //setMarcaciones([])
          setOpenMessage({
            state: true,
            message: ERRORS_TEXT.fetchError,
            type: ERRORS_TEXT.typeError,
          });
        }
      });
    };
    fetchData();
  };

  /**
   * Llama a la API para buscar todas las OT del dia
   */
  const findOT = () => {
    getFetchFunction(
      `${API_DISTRIBUCION}/viaje/unidadesTransporteAsignadas?cia=01&fechaEntrega=${convertirDateTimeToDate(
        filterFechaEntrega
      )}&estados=3&estadosOT=2,3`,
      setLoadingTableViajes,
      setViajes
    ).then((data) => {
      if (
        typeof data !== "undefined" &&
        data.toString().includes("Failed to fetch")
      ) {
        setOpenMessage({
          state: true,
          message: ERRORS_TEXT.fetchError,
          type: ERRORS_TEXT.typeError,
        });
      }
    });
  };

  /**
   * Importa todas las marcaciones del dia para empezar el tareo
   */
  const onIniciarTareo = () => {
    setLoaderComponent(true);
    const fetchData = async () => {
      try {
        await postFetchFunction(
          `${API_DISTRIBUCION}/cuadreMano/iniciarTareo?&cia=06&fecha=${convertirDateTimeToDateYYYYMMDD(
            filterFechaEntrega
          )}&username=${USERNAME_LOCAL}`,
          {},
          setOpenMessage
        ).then((data) => {
          setModalIniciaTareo(false);
          setTrabajadores({ result: [] });
          setPage(1);
          findMarcaciones(1);
          findOT();
          setLoaderComponent(false);
          /* if (
            typeof data !== "undefined" &&
            data.toString().includes("Failed to fetch")
          ) {
            setOpenMessage({
              state: true,
              message: ERRORS_TEXT.fetchError,
              type: ERRORS_TEXT.typeError,
            });
          } */
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  };

  /**
   * Metodo para reiniciar lista y cerrar todos los modals
   */
  const reiniciarData = () => {
    setLoaderComponent(false);
    setLoadingTable(true);
    //setTrabajadores({ result: [] });
    setModalIniciaTareo(false);
    setModalConfirmacionSAP(false);
    findMarcaciones(1);
    findOT();
    /* setTimeout(() => {
      setPage(1);
    }, 500); */
  };

  /**
   * Lanza el evento para abril el modal de confirmacion para sicronizar con SAP
   */
  const handleSyncSap = () => {
    setModalConfirmacionSAP(true);
  };

  const onNextPage = () => {
    setPage((page) => page + 1);
    setLoadingTable(true);
    findMarcaciones(page + 1);
  };
  /**
   * Realiza la sincronizacion con SAP de todos los tareos con estado 2
   */
  const onSyncSap = () => {
    setModalConfirmacionSAP(false);
    let trabajadoresToSAP = trabajadores.result.filter(
      (t) => t.cmc_estado === "2"
    );
    trabajadoresToSAP.forEach((t) => (t.cmc_cieusu = USERNAME_LOCAL));
    console.log(trabajadoresToSAP);

    if (trabajadoresToSAP.length > 0) {
      const postData = async () => {
        setLoaderComponent(true);
        await postFetchFunction(
          `${API_DISTRIBUCION}/cuadreMano/sincronizarSAP`,
          trabajadoresToSAP,
          setOpenMessage
        ).then((data) => {
          reiniciarData();
        });
      };
      postData();
    } else {
      setOpenMessage({
        state: true,
        message: "No existen registros completados para sincronizar con SAP",
        type: ERRORS_TEXT.typeError,
      });
    }
  };

  useEffect(() => {
    //setTrabajadores({ result: [] });
    setPage(1);
    findMarcaciones(1);
    /* setTimeout(() => {
      setPage(1);
    }, 500); */
    findOT();
  }, [refreshTable]);

  /* 
  useEffect(() => {
    if (totalPages === null || page <= totalPages) {
      findMarcaciones(page);
    }
  }, [page, totalPages]);

  const scrollableDivRef = useRef(null); // Ref para el div scrollable

  useEffect(() => {
    const handleScroll = () => {
      if (loadingTable || totalPages === null) return;

      const { scrollTop, clientHeight, scrollHeight } =
        scrollableDivRef.current;

      const isMobile = window.innerWidth <= 400;
      const scrollThreshold = isMobile ? scrollHeight * 0.95 : scrollHeight;

      //scrollTop + clientHeight >= scrollThreshold
      //scrollTop >= (scrollThreshold - clientHeight)
      if (scrollThreshold - scrollTop <= clientHeight) {
        // Ajusta el 20 según sea necesario
        //alert(""+page+":page,"+scrollTop+":scrollTop,"+clientHeight+":clientHeight,"+scrollThreshold+":scrollThreshold")
        setPage((prevPage) => prevPage + 1);
        setLoadingTable(true);
      }
    };

    scrollableDivRef.current.addEventListener("scroll", handleScroll);
    return () => {
      if (scrollableDivRef.current) {
        scrollableDivRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loadingTable, totalPages]);
  */
  const dispatch = useDispatch();

  const [modalExportExcel, setModalExportExcel] = useState(false);
  const [dataToExport, setDataToExport] = useState([]);
  const [loadDataExport, setLoadDataExport] = useState(false);
  const [showButtonDownloadExcel, setShowButtonDownloadExcel] = useState(false);

  const onSearchResumenTareo = () => {
    console.log(filterFechaToExport);
    if (filterFechaToExport.fechaInicial && filterFechaToExport.fechaFinal) {
      setLoadDataExport(true);
      setShowButtonDownloadExcel(true);
      axios
        .get(
          `${URL_MASTERLOGIC_API}${API_DISTRIBUCION}/cuadreMano/resumenTareoByFechas?fechaInicial=${filterFechaToExport.fechaInicial}&fechaFinal=${filterFechaToExport.fechaFinal}`
        )
        .then((res) => {
          setDataToExport(res.data.result);
          setLoadDataExport(false);
        })
        .catch((err) => console.log(err));
    } else {
      setOpenMessage({
        type: ERRORS_TEXT.typeError,
        state: true,
        message: "Debes ingresar una fecha de inicio y una fecha final",
      });
    }
  };

  const buttonToExportExcel = (onExport) =>
    showButtonDownloadExcel && (
      <button
        onClick={() => {
          onExport();
          setDataToExport([]);
          setModalExportExcel(false);
          setShowButtonDownloadExcel(false);
        }}
        className={"form-buttons-btn form-buttons-btn-red mt-4"}
      >
        {!loadDataExport ? (
          <>Descargar</>
        ) : (
          <CircularProgress
            className="text-white"
            style={{ color: "white", scale: "0.8" }}
          />
        )}
      </button>
    );

  const [filterFechaToExport, setFilterFechaToExport] = useState({
    fechaInicial: null,
    fechaFinal: null,
  });

  return (
    <div className="page-container">
      <input type="text" hidden />
      <div className="page-container-header-page">
        <div className="page-container-header-page-title-content">
          <BreadcrumbComponent
            message={`${BANDEJA_LLENADO_HORAS_PAGE.titlePage} [${totalRows}]`}
          />
        </div>
        <div className="page-container-header-page-two-group">
          <div className="page-container-header-page-two-group-item">
            <label htmlFor="">
              {BANDEJA_LLENADO_HORAS_PAGE.filtroFechaLabel}
            </label>
            <DatePickerCustom
              selected={filterFechaEntrega}
              value={filterFechaEntrega}
              onChange={(date) => handleChangeFechaEntrega(date)}
              classname="input-filter-fecha"
            />
          </div>
          <div className="page-container-header-page-two-group-item">
            <div className="page-container-header-page-three-group-item">
              <button
                onClick={() => setModalIniciaTareo(true)}
                className="btn-icons border-1 border-green-600 rounded px-1 py-0.5"
              >
                <div>
                  <PlayCircleOutlineIcon className="text-green-700" />
                </div>
                <div className="">
                  {BANDEJA_LLENADO_HORAS_PAGE.btnIniciarTareo}
                </div>
              </button>
            </div>
            <div className="page-container-header-page-three-group-item">
              <button onClick={() => setModalExportExcel(true)} className="">
                <FaFileExcel className="text-green-700 text-xl" />
              </button>
            </div>
            <div className="page-container-header-page-three-group-item">
              {/* <span class="tw-tooltip rounded shadow-lg p-1 bg-gray-800 text-white -mb-8">
                Sincronizar datos con sap
              </span> */}
              <TooltipCustomComponent
                title={
                  <>
                    <span>Sincronizar datos con SAP</span>
                  </>
                }
              >
                <button
                  onClick={() => handleSyncSap()}
                  className="btn-icons border-1 border-blue-600 rounded px-1 py-0.5"
                >
                  <div>
                    <CloudDownloadIcon className="text-blue-700" />
                  </div>
                  <span className="desktop">
                    {BANDEJA_LLENADO_HORAS_PAGE.btnSincronizarSAP}
                  </span>
                </button>
              </TooltipCustomComponent>
            </div>
            <div className="page-container-header-page-three-group-item">
              <FiltroTareoTrabajadoresComponent
                filtros={filtrosTareo}
                setFiltros={setFiltrosTareo}
                onSearch={findMarcaciones}
              />
            </div>
          </div>
        </div>
      </div>
      <LoaderAllComponent open={loaderComponent} setOpen={setLoaderComponent} />

      <ModalMessage
        open={modalExportExcel}
        setOpen={setModalExportExcel}
        isMessage={true}
        titleBtnAceptar="Descargar"
        showButtons={false}
        title={"Exportar Tareo"}
      >
        <div>
          <div>Elegir Fechas</div>
          <form className="flex flex-col space-y-2 xs:space-y-0 xs:flex-row xs:space-x-2 justify-between mt-2">
            <input
              type="date"
              onChange={(e) =>
                setFilterFechaToExport({
                  ...filterFechaToExport,
                  fechaInicial: e.target.value + "T12:00:00",
                })
              }
              required={true}
              className="form-container-group-content-input"
            />
            <input
              type="date"
              onChange={(e) =>
                setFilterFechaToExport({
                  ...filterFechaToExport,
                  fechaFinal: e.target.value + "T12:00:00",
                })
              }
              required={true}
              className="form-container-group-content-input"
            />
            <div className="content-center">
              <button
                type="button"
                onClick={() => onSearchResumenTareo()}
                className="w-full text-center border border-blue-600 xs:border-white rounded-md xs:w-auto xs:border-none"
              >
                <SearchIcon
                  className="text-blue-800"
                  sx={{ fontSize: "30px" }}
                />
              </button>
            </div>
          </form>
          <ExportarExcelAPIComponent
            data={dataToExport}
            filename={`Resumen_de_Tareo_${convertirDateTimeToDateYYYYMMDD(
              filterFechaToExport.fechaInicial
            )}_${convertirDateTimeToDateYYYYMMDD(
              filterFechaToExport.fechaFinal
            )}`}
            buttonComponent={buttonToExportExcel}
            headers={BANDEJA_LLENADO_HORAS_PAGE.headersExcel}
          />
        </div>
      </ModalMessage>
      <div>
        <ListTareoTrabajadoresComponent
          trabajadores={trabajadores}
          loaderComponent={loaderComponent}
          loadingTable={loadingTable}
          page={page}
          totalPages={totalPages}
          setRefreshTable={setRefreshTable}
          reiniciarData={reiniciarData}
          loadingTableViajes={loadingTableViajes}
          viajes={viajes}
          setLoaderComponent={setLoaderComponent}
          onNextPage={onNextPage}
        />

        {/**
         * Modal Iniciar Tareo
         */}
        <ModalMessage
          open={modalIniciaTareo}
          setOpen={setModalIniciaTareo}
          title={"¿Estás seguro?"}
          isMessage={true}
          onBtnAceptar={() => onIniciarTareo()}
        >
          <div className="w-full text-center text-lg p-0 font-semibold">
            {BANDEJA_LLENADO_HORAS_PAGE.modalTareo.msgConfirmacion}
          </div>
        </ModalMessage>

        {/**
         * Modal Sincronizar con SAP
         */}
        <ModalMessage
          open={modalConfirmacionSAP}
          setOpen={setModalConfirmacionSAP}
          title={BANDEJA_LLENADO_HORAS_PAGE.modalSyncSAP.title}
          isMessage={true}
          onBtnAceptar={() => onSyncSap()}
        >
          <div className="w-full text-center text-lg p-0 font-semibold">
            {BANDEJA_LLENADO_HORAS_PAGE.modalSyncSAP.msgConfirmacion}
          </div>
        </ModalMessage>
      </div>
    </div>
  );
};

export default BandejaViajesPage;
