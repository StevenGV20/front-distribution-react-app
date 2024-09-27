import React, { useEffect, useState } from "react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import BackupIcon from "@mui/icons-material/Backup";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import CloudOffIcon from "@mui/icons-material/CloudOff";

import {
  convertirDateTimeToDate,
  convertirDateTimeToDateYYYYMMDD,
  convertirDateToTimeString,
  getFetchFunction,
  getPrimeraFechaDelMes,
  postFetchFunction,
  postFetchFunctionCustomFunction,
  putFetchFunction,
} from "../../utils/funciones";
import {
  API_DISTRIBUCION,
  URL_MASTERLOGIC_API,
  USERNAME_LOCAL,
} from "../../utils/general";
import { ERRORS_TEXT } from "../../utils/properties.error.text";
import { LLENADO_OT_PAGE } from "../../utils/properties.text";
import BreadcrumbComponent from "../../components/widgets/BreadcrumbComponent";
import DatePickerCustom from "../../components/widgets/DatePickerCustom";
import TableCustom from "../../components/widgets/TableComponent";
import ModalMessage from "../../components/widgets/ModalComponent";
import FormLlenadoOTComponent from "../../components/distribucion/FormLlenadoOTComponent";
import FormLlenadoGRTComponent from "../../components/distribucion/FormLlenadoGRTComponent";
import TooltipCustomComponent from "../../components/widgets/TooltipCustomComponent";
import ListaOTtrabajadoresAsignadosComponent from "../../components/distribucion/ListaOTtrabajadoresAsignadosComponent";
import ExportarExcelAPIComponent from "../../components/widgets/ExportarExcelComponent/exportacionByAPI";

import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../redux/features/utils/utilsSlice";
import ListOrdenesTrabajoOTComponent from "../../components/distribucion/ListOrdenesTrabajoOTComponent";
import axios from "axios";
import LoaderAllComponent from "../../components/widgets/ModalComponent/LoaderAllComponent";

const LLenadoOTsPage = () => {
  const [loadingTableViajes, setLoadingTableViajes] = useState(true);
  const [refreshTable, setRefreshTable] = useState(false);
  const [viajes, setViajes] = useState({ result: [] });
  const [viajeSelected, setViajeSelected] = useState();

  const [filterFechaEntrega, setFilterFechaEntrega] = useState(
    new Date().setDate(new Date().getDate() - 1)
  );

  const [openModalFormLlenadoOt, setOpenModalFormLlenadoOt] = useState(false);
  const [openModalFormLlenadoGRT, setOpenModalFormLlenadoGRT] = useState(false);
  const [openModalTrabajadoresAsignados, setOpenModalTrabajadoresAsignados] =
    useState(false);

  const [modalConfirmarBloqueo, setModalConfirmarBloqueo] = useState(false);
  const [modalConfirmarSAP, setModalConfirmarSAP] = useState(false);
  const [modalOpenOT, setModalOpenOT] = useState(false);

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  /**
   * Cambiar la fecha de Entrega
   * @param {string} date
   */
  const handleChangeFechaEntrega = (date) => {
    setFilterFechaEntrega(date);
    setRefreshTable((prev) => !prev);
  };

  /**
   * Seleccionar un viaje para consultar su lista de GRT y abre el modal con el listado
   * @param {object} viaje
   */
  const handleShowGRTHorarios = (viaje) => {
    setViajeSelected(viaje);
    setOpenModalFormLlenadoGRT(true);
  };

  useEffect(() => {
    getFetchFunction(
      `${API_DISTRIBUCION}/viaje/unidadesTransporteAsignadas?cia=01&fechaEntrega=${convertirDateTimeToDate(
        filterFechaEntrega
      )}&estados=3`,
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
          type: "error",
        });
      }
    });
  }, [refreshTable]);

  const [loaderComponent, setLoaderComponent] = useState(false);

  const afterPut = (data) => {
    setOpenMessage({
      state: true,
      message: data.mensaje,
      type: data.status.toLowerCase(),
    });
    setRefreshTable((prev) => !prev);
    setModalConfirmarBloqueo(false);
    setModalOpenOT(false);
    setModalCloseOTSAP(false);
    setLoaderComponent(false);
  };

  const onEditOT = (ot, estado) => {
    setLoaderComponent(true);
    putFetchFunction(
      `${API_DISTRIBUCION}/viaje/cambiarEstadoOT?otrcod=${ot.via_otrcod}&estado=${estado}&username=${USERNAME_LOCAL}&cia=${ot.cia_codcia}`,
      {},
      afterPut
    ).then((res) => {
      setLoaderComponent(false);
    });
  };

  const onSyncSAP = () => {
    let otDisponibles = viajes.result.filter((ot) => ot.via_otrest === "4");
    if (otDisponibles.length < 1) {
      setOpenMessage({
        state: true,
        message: "No hay OTs disponibles para sincronizar con SAP",
        type: "error",
      });
    } else {
      //otDisponibles.map((ot) => onEditOT(ot, "5"));
      let listaOT = [];
      otDisponibles.map((ot) => {
        let obj = {
          idviaje: ot.idviaje,
          cia_codcia: ot.cia_codcia,
          via_desfch: convertirDateTimeToDate(ot.via_desfch),
          via_otrcod: ot.via_otrcod,
          via_otrest: ot.via_otrest,
          via_partida: ot.via_partida,
          via_llegada: ot.via_llegada,
          via_tot_horas: ot.via_tot_horas,
          via_klmini: ot.via_klmini,
          via_klmfin: ot.via_klmfin,
          via_tot_klm: ot.via_tot_klm,
          via_otrtip: ot.via_otrtip,
          utr_plautr: ot.utr_plautr,
          utr_marutr: ot.utr_marutr,
          username: ot.username,
        };
        listaOT.push(obj);
      });

      console.log(listaOT);

      postFetchFunctionCustomFunction(
        `${API_DISTRIBUCION}/ot/sincronizarSAP?otrcod=${""}&estado=${"5"}&username=${USERNAME_LOCAL}&cia=${
          otDisponibles[0].cia_codcia
        }&accion=SAP&fecha=${convertirDateTimeToDate(filterFechaEntrega)}`,
        listaOT,
        setOpenMessage,
        afterPut
      );
    }
    setModalConfirmarSAP(false);
  };

  const getDataExportExcel = async () => {
    let data = await axios
      .get(
        `${URL_MASTERLOGIC_API}${API_DISTRIBUCION}/ot/listaOTandGRTByFecha?fecha=${convertirDateTimeToDateYYYYMMDD(
          filterFechaEntrega
        )}`
      )
      .then((res) => {
        console.log(res.data);
        return res.data;
      });
    return data;
  };

  const [filterFechaToCloseOTSAP, setFilterFechaToCloseOTSAP] = useState({
    fechaInicial: getPrimeraFechaDelMes(),
    fechaFinal: new Date(),
  });
  const [modalCloseOTSAP, setModalCloseOTSAP] = useState(false);

  const onChangeDate = (e) => {
    const selectedDate = e.target.value; // Obtener la fecha seleccionada del input
    const [year, month, day] = selectedDate.split("-"); // Separar la fecha en año, mes y día

    // Crear un nuevo objeto Date estableciendo la hora UTC a las 12:00:00
    const newDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    return newDate;
  };

  const onCloseAllOTs = async () => {
    await axios
      .post(
        `${URL_MASTERLOGIC_API}${API_DISTRIBUCION}/ot/cerrarOTsByFechas?fechaInicial=${convertirDateTimeToDateYYYYMMDD(
          filterFechaToCloseOTSAP.fechaInicial
        )}&fechaFinal=${convertirDateTimeToDateYYYYMMDD(
          filterFechaToCloseOTSAP.fechaFinal
        )}`
      )
      .then((res) => {
        console.log(res.data);
        setOpenMessage({
          state: true,
          message: res.data.mensaje,
          type: res.data.status.toLowerCase(),
        });
        setModalCloseOTSAP(false);
        setRefreshTable((prev) => !prev);
        return res.data;
      })
      .catch((err) => {
        setOpenMessage({
          state: true,
          message: ERRORS_TEXT.fetchError,
          type: "error",
        });
      });
  };

  const onDownloadOtSAP = async () => {
    await axios
      .post(
        `${URL_MASTERLOGIC_API}${API_DISTRIBUCION}/ot/downloadOTFromSAP?fecha=${convertirDateTimeToDate(
          filterFechaEntrega
        )}&username=${localStorage.getItem("USERNAME")}`
      )
      .then((res) => {
        console.log(res.data);
        setOpenMessage({
          state: true,
          message: res.data.mensaje,
          type: res.data.status.toLowerCase(),
        });
        //setModalCloseOTSAP(false);
        return res.data;
      })
      .catch((err) => {
        setOpenMessage({
          state: true,
          message: ERRORS_TEXT.fetchError,
          type: "error",
        });
      });
  };

  return (
    <div className="page-container">
      <div className="page-container-header-page">
        <div className="page-container-header-page-title-content">
          <BreadcrumbComponent
            message={`${LLENADO_OT_PAGE.title} [${
              (viajes && viajes.result.length) || 0
            }]`}
          />
        </div>
        <div className="page-container-header-page-two-group">
          <div className="page-container-header-page-two-group-item">
            <button
              className="btn-base-black"
              onClick={() => onDownloadOtSAP()}
            >
              GETSAPOT
            </button>
          </div>
          <div className="page-container-header-page-two-group-item">
            <label htmlFor="">{LLENADO_OT_PAGE.filtroFechaLabel}</label>
            <DatePickerCustom
              selected={filterFechaEntrega}
              value={filterFechaEntrega}
              onChange={(date) => handleChangeFechaEntrega(date)}
              classname="input-filter-fecha"
            />
          </div>
          <div className="page-container-header-page-two-group-item">
            <ExportarExcelAPIComponent
              data={viajes.result}
              headers={LLENADO_OT_PAGE.headersExportExcel}
              filename={
                `OTs_` + convertirDateTimeToDateYYYYMMDD(filterFechaEntrega)
              }
              msgTooltip="Exportar todas las OT en Excel"
              isGetData={true}
              getData={getDataExportExcel}
            />
            <TooltipCustomComponent
              title={
                <>
                  <span>Sincronizar OTs con SAP</span>
                </>
              }
            >
              <button
                onClick={() => {
                  setModalConfirmarSAP(true);
                }}
                className="btn-icons border-1 border-blue-600 rounded px-1 py-0.5"
              >
                <div>
                  <BackupIcon className="text-blue-700" />
                </div>
                <span className="desktop">
                  {LLENADO_OT_PAGE.btnSincronizarSAP}
                </span>
              </button>
            </TooltipCustomComponent>

            <TooltipCustomComponent
              title={
                <>
                  <span>Cerrar todas las OTs del mes en SAP</span>
                </>
              }
            >
              <button
                className="btn-icons border-1 border-blue-600 rounded px-1 py-0.5"
                onClick={() => setModalCloseOTSAP(true)}
              >
                <div>
                  <CloudOffIcon className="text-blue-700" />
                </div>
                <span className="desktop">
                  {LLENADO_OT_PAGE.btnCierreMasico}
                </span>
              </button>
            </TooltipCustomComponent>
          </div>
        </div>
      </div>

      <ListOrdenesTrabajoOTComponent
        viajes={viajes}
        loadingTableViajes={loadingTableViajes}
        setViajeSelected={setViajeSelected}
        setOpenModalFormLlenadoOt={setOpenModalFormLlenadoOt}
        handleShowGRTHorarios={handleShowGRTHorarios}
        setModalConfirmarBloqueo={setModalConfirmarBloqueo}
        setModalOpenOT={setModalOpenOT}
        setOpenModalTrabajadoresAsignados={setOpenModalTrabajadoresAsignados}
      />

      <ModalMessage
        open={modalCloseOTSAP}
        setOpen={setModalCloseOTSAP}
        isMessage={true}
        titleBtnAceptar="Aceptar"
        showButtons={true}
        title={"Cierre masivo de OT's en SAP"}
        onBtnAceptar={() => onCloseAllOTs()}
      >
        <div>
          <div>Cerrar todas las OT's de las fechas: </div>
          <form className="flex flex-col space-y-2 xs:space-y-0 xs:flex-row xs:space-x-2 justify-between mt-2">
            <input
              type="date"
              onChange={(e) =>
                setFilterFechaToCloseOTSAP({
                  ...filterFechaToCloseOTSAP,
                  fechaInicial: onChangeDate(e),
                })
              }
              value={convertirDateTimeToDate(
                filterFechaToCloseOTSAP.fechaInicial
              )}
              required={true}
              className="form-container-group-content-input"
            />
            <input
              type="date"
              value={convertirDateTimeToDate(
                filterFechaToCloseOTSAP.fechaFinal
              )}
              onChange={(e) =>
                setFilterFechaToCloseOTSAP({
                  ...filterFechaToCloseOTSAP,
                  fechaFinal: onChangeDate(e),
                })
              }
              required={true}
              className="form-container-group-content-input"
            />
            <div className="content-center">
              <button
                type="button"
                className="w-full text-center border border-blue-600 xs:border-white rounded-md xs:w-auto xs:border-none"
              ></button>
            </div>
          </form>
        </div>
      </ModalMessage>

      <LoaderAllComponent open={loaderComponent} setOpen={setLoaderComponent} />

      <ModalMessage
        setOpen={setOpenModalFormLlenadoOt}
        open={openModalFormLlenadoOt}
        title={
          LLENADO_OT_PAGE.formLlenadoOT.title +
          ` - ${viajeSelected && viajeSelected.via_otrcod}`
        }
        showButtons={false}
      >
        <FormLlenadoOTComponent
          setOpenModal={setOpenModalFormLlenadoOt}
          viaje={viajeSelected}
          setRefreshTable={setRefreshTable}
        />
      </ModalMessage>

      <ModalMessage
        setOpen={setOpenModalFormLlenadoGRT}
        open={openModalFormLlenadoGRT}
        title={
          LLENADO_OT_PAGE.formLlenadoGRT.title +
          ` - ${viajeSelected && viajeSelected.via_otrcod}`
        }
        showButtons={false}
      >
        <FormLlenadoGRTComponent
          setOpenModal={setOpenModalFormLlenadoGRT}
          viaje={viajeSelected}
          setRefreshTable={setRefreshTable}
        />
      </ModalMessage>

      <ModalMessage
        open={modalConfirmarBloqueo}
        setOpen={setModalConfirmarBloqueo}
        title={
          LLENADO_OT_PAGE.modalCierreOT.title +
          " " +
          (viajeSelected && viajeSelected.via_otrcod)
        }
        isMessage={true}
        onBtnAceptar={() => {
          onEditOT(viajeSelected, "4");
        }}
        titelBtnCancelar="No"
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          {LLENADO_OT_PAGE.modalCierreOT.msgConfirmacion}
        </div>
      </ModalMessage>

      <ModalMessage
        open={modalConfirmarSAP}
        setOpen={setModalConfirmarSAP}
        title={LLENADO_OT_PAGE.modalSyncSAP.title}
        isMessage={true}
        onBtnAceptar={() => {
          onSyncSAP();
        }}
        titelBtnCancelar="No"
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          {LLENADO_OT_PAGE.modalSyncSAP.msgConfirmacion}
        </div>
      </ModalMessage>

      <ModalMessage
        open={modalOpenOT}
        setOpen={setModalOpenOT}
        title={LLENADO_OT_PAGE.modalOpenOT.title}
        isMessage={true}
        onBtnAceptar={() => {
          onEditOT(viajeSelected, "3");
        }}
        titelBtnCancelar="No"
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          {LLENADO_OT_PAGE.modalOpenOT.msgConfirmacion}
        </div>
      </ModalMessage>

      <ModalMessage
        open={openModalTrabajadoresAsignados}
        setOpen={setOpenModalTrabajadoresAsignados}
        title={
          "Trabajadores Asignados - " +
          (viajeSelected && viajeSelected.via_otrcod)
        }
        onBtnAceptar={() => setOpenModalTrabajadoresAsignados(false)}
        titleBtnAceptar="Aceptar"
      >
        <ListaOTtrabajadoresAsignadosComponent viaje={viajeSelected} />
      </ModalMessage>
    </div>
  );
};

export default LLenadoOTsPage;
