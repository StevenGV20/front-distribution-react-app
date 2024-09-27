import React, { useState } from "react";

import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import { CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { FaChevronDown } from "react-icons/fa6";
import { FaSyncAlt } from "react-icons/fa";

import { BANDEJA_LLENADO_HORAS_PAGE } from "../../../utils/properties.text";
import {
  convertirDateToTimeString,
  deleteFetchFunction,
  postFetchFunction,
  putFetchFunction,
  redondearDecimales,
} from "../../../utils/funciones";
import TableCustom from "../../widgets/TableComponent";
import { API_DISTRIBUCION, USERNAME_LOCAL } from "../../../utils/general";
import ModalMessage from "../../widgets/ModalComponent";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/features/utils/utilsSlice";
import { ERRORS_TEXT } from "../../../utils/properties.error.text";
import FormAsignarOTComponent from "../FormAsignarOTComponent";
import FormEditarOTAsignadaComponent from "../FormEditarOTAsignadaComponent";
import TooltipCustomComponent from "../../widgets/TooltipCustomComponent";

const ListTareoTrabajadoresComponent = ({
  scrollableDivRef,
  trabajadores,
  loaderComponent,
  loadingTable,
  page,
  totalPages,
  setRefreshTable,
  reiniciarData,
  loadingTableViajes,
  viajes,
  setLoaderComponent,
  onNextPage,
}) => {
  const [trabajadorSelected, setTrabajadorSelected] = useState(null);
  const [modalAsignarOT, setModalAsignarOT] = useState(false);
  const [modalEditarOT, setModalEditarOT] = useState(false);
  const [modalOpenCMC, setModalOpenCMC] = useState(false);
  const [modalMsgConfirmacion, setModalMsgConfirmacion] = useState(false);
  const [otSelected, setOtSelected] = useState(null);
  const [showEditTareo, setShowEditTareo] = useState(false);
  const [listaOTByTrabajadores, setListaOTByTrabajadores] = useState({
    result: [],
  });

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const closeAllModals = () => {
    setModalAsignarOT(false);
    setModalEditarOT(false);
    setModalOpenCMC(false);
    setModalMsgConfirmacion(false);
    setShowEditTareo(false);
    setTrabajadorSelected(null);
  };

  /**
   * Calcula el MOD,MOI y EST/DEST para cada tareo
   * @param {object} traSelect
   * @returns
   */
  const calculateOT = (traSelect) => {
    //console.log(traSelect);
    let horLaborado = traSelect.hor_laborado;
    let modTotal = traSelect.cmc_hormod;
    let moiTotal = 0;
    let estdesTotal = 0;
    let numOts = traSelect.otAsignadas.length;

    traSelect.otAsignadas.forEach((ot) => {
      let horasRestantes = (horLaborado - modTotal) / numOts;
      let moi = 0;

      //calcular MOI en base a cada OT
      if (ot.tra_cmdrol === "1") {        
        moi += ot.cmc_hormoi;
      }
      else{
        moi = horLaborado - modTotal > 0 ? horasRestantes : 0;
      }

      //calcular ESTIBA/DESESTIBA en base a cada OT
      horasRestantes = horasRestantes - moi > 0 ? horasRestantes - moi : 0;

      ot.cmc_horede = redondearDecimales(horasRestantes);
      estdesTotal += horasRestantes;

      ot.cmc_hormoi = redondearDecimales(moi);
      moiTotal += moi;
    });

    traSelect.cmc_hormoi = parseFloat(moiTotal.toFixed(2));
    traSelect.cmc_horede = parseFloat(estdesTotal.toFixed(2));

    traSelect.cmc_regusu = USERNAME_LOCAL;

    return traSelect;
  };

  /**
   * Calcula todas las OTs con estado 2
   */
  const onCalculateAllOTs = async (trabajador) => {
    /* let trabDisponibles = trabajadores.result.filter(
      (t) => t.cmc_estado === "2" && t.otAsignadas.length > 0
    ); */
    let trabDisponibles = [trabajador];

    if (trabDisponibles.length > 0) {
      //setLoaderComponent(true);
      trabDisponibles.forEach((t) => calculateOT(t));

      const fetchData = async () => {
        try {
          await postFetchFunction(
            `${API_DISTRIBUCION}/cuadreMano/calcularAllOTAsignadas`,
            trabDisponibles,
            setOpenMessage
          ).then((data) => {
            //setLoaderComponent(false);
            //setModalMsgConfirmacion(false);
            //reiniciarData();
            closeAllModals();
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
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    } else {
      setOpenMessage({
        state: true,
        message: "No hay OTs para calcular",
        type: ERRORS_TEXT.typeError,
      });
    }
  };

  /**
   * Editar tareo de trabajador
   * @param {string} tareo
   * @param {string} estado
   * @param {object} t
   */
  const onEditObraTrabajador = async (tareo = "S", estado = "", t) => {
    if (t.cmc_hormod <= t.hor_laborado) {
      setLoaderComponent(true);
      const values = {
        cia_cod: t.cia_cod,
        cmc_id: t.cmc_id,
        cmc_tareo: tareo,
        cmc_estado: estado,
        cmc_regusu: USERNAME_LOCAL,
      };

      const afterPut = (data) => {
        setOpenMessage({
          state: true,
          message: data.mensaje,
          type: data.status.toLowerCase(),
        });
        //reiniciarData();
        closeAllModals();
        setRefreshTable((prev) => !prev);
      };

      if (estado !== 2 || tareo === "N") {
        putFetchFunction(
          `${API_DISTRIBUCION}/cuadreMano/edit`,
          values,
          afterPut
        );
      } else {
        await onCalculateAllOTs(t).then((data) => {
          putFetchFunction(
            `${API_DISTRIBUCION}/cuadreMano/edit`,
            values,
            afterPut
          );
        });
      }
    } else {
      setOpenMessage({
        state: true,
        message: ERRORS_TEXT.page_bandeja_tareo.modIncorrecto,
        type: ERRORS_TEXT.typeError,
      });
      setModalMsgConfirmacion(false);
    }
  };

  /**
   * Lanza el evento del boton para abrir el modal para confirmar bloqueo de OT
   * @param {object} t
   */
  const handleCloseOT = (t) => {
    setTrabajadorSelected(t);
    setModalMsgConfirmacion(true);
  };

  /**
   * Lanza el evento del boton para abrir el modal para confirmar edicion de tareo de trabajador
   * @param {boolean} showTareo
   * @param {object} trabajador
   * @param {boolean} openCMC
   */
  const handleEditObraTrabajador = (
    showTareo = false,
    trabajador,
    openCMC = false
  ) => {
    if (showTareo) {
      setShowEditTareo(true);
      setTrabajadorSelected(trabajador);
    } else {
      setTrabajadorSelected(trabajador);
      setModalOpenCMC(openCMC);
    }
  };

  /**
   * Lanza el evento del boton para abrir el modal de listado de OTs para asignar
   * @param {object} t
   */
  const handleAddOT = (t) => {
    setTrabajadorSelected(t);
    setModalAsignarOT(true);
  };

  /**
   * Selecciona la OT y abre el modal para editar la OT
   * @param {object} v
   * @param {object} t
   */
  const handleEditOT = (v, t) => {
    setOtSelected(v);
    setTrabajadorSelected(t);
    setModalEditarOT(true);
  };

  return (
    <>
      {/**
       * Modal Asignar OT
       */}
      <ModalMessage
        open={modalAsignarOT}
        setOpen={setModalAsignarOT}
        title={"Asignar OT a trabajador"}
        showButtons={false}
      >
        <FormAsignarOTComponent
          loadingTableViajes={loadingTableViajes}
          viajes={viajes}
          trabajadorSelected={trabajadorSelected}
          setRefreshTable={setRefreshTable}
          setOpenModal={setModalAsignarOT}
          setLoaderComponent={setLoaderComponent}
        />
      </ModalMessage>

      {/**
       * Modal Editar OT
       */}
      <ModalMessage
        open={modalEditarOT}
        setOpen={setModalEditarOT}
        title={"Editar OT"}
        showButtons={false}
        isMessage={true}
      >
        <FormEditarOTAsignadaComponent
          reiniciarData={reiniciarData}
          otSelected={otSelected}
          setRefreshTable={setRefreshTable}
          setOpenModal={setModalEditarOT}
          trabajadorSelected={trabajadorSelected}
        />
      </ModalMessage>

      <TableCustom
        cols={BANDEJA_LLENADO_HORAS_PAGE.tableMainHeaders}
        mini={true}
        spacing={false}
        refDiv={scrollableDivRef}
      >
        {!loaderComponent &&
          trabajadores.result.map((t, index) => {
            return (
              <>
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <div>{t.tra_nombre}</div>
                    <div className="font-semibold">
                      <span>{t.tra_codigo}</span> / <span>{t.rol_nombre}</span>
                    </div>
                    <div></div>
                  </td>
                  <td>{t.hor_laborado}</td>
                  <td>
                    {showEditTareo &&
                    trabajadorSelected &&
                    trabajadorSelected.cmc_id === t.cmc_id ? (
                      <div className="flex flex-shrink">
                        <select
                          onChange={(e) =>
                            onEditObraTrabajador(
                              e.target.value,
                              t.cmc_estado,
                              t
                            )
                          }
                          className="border-1 border-blue-700 px-2 py-1"
                        >
                          <option value="">[Sel.]</option>
                          <option value="S">SI</option>
                          <option value="N">NO</option>
                        </select>
                      </div>
                    ) : (
                      <>
                        {t.cmc_tareo === "S" ? "SI" : "NO"}{" "}
                        {t.cmc_estado < 2 && (
                          <button
                            onClick={() => handleEditObraTrabajador(true, t)}
                          >
                            <EditIcon sx={{ fontSize: "15px" }} />
                          </button>
                        )}
                      </>
                    )}
                  </td>
                  <td></td>
                  <td>
                    {t.cmc_tareo === "S" && t.cmc_estado < 2 && (
                      <button
                        onClick={() => {
                          handleAddOT(t);
                        }}
                        className="text-blue-700"
                      >
                        <LibraryAddIcon />
                      </button>
                    )}
                  </td>
                  <td colSpan={3}></td>
                  <td></td>
                  <td>
                    <span className="font-semibold">{t.cmc_hormod}</span>
                  </td>
                  <td>
                    <span className="font-semibold">{t.cmc_hormoi}</span>
                  </td>
                  <td>
                    <span className="font-semibold">{t.cmc_horede}</span>
                  </td>
                  <td>
                    {(t.otAsignadas.length > 0 || t.cmc_tareo === "N") &&
                      (t.cmc_estado === "1" ? (
                        <>
                          <button
                            className="p-1 rounded-md mr-1"
                            onClick={() => {
                              onEditObraTrabajador(t.cmc_tareo, 2, t);
                            }}
                          >
                            <TooltipCustomComponent
                              title={<span>Bloquear Trabajador</span>}
                            >
                              <LockOpenIcon className="text-yellow-500" />
                            </TooltipCustomComponent>
                          </button>
                        </>
                      ) : t.cmc_estado === "2" ? (
                        <button
                          className="p-1 rounded-md mr-1"
                          onClick={() => {
                            onEditObraTrabajador(t.cmc_tareo, 1, t);
                          }}
                        >
                          <TooltipCustomComponent
                            title={<span>Desbloquear Trabajador</span>}
                          >
                            <LockIcon className="text-yellow-500" />
                          </TooltipCustomComponent>
                        </button>
                      ) : (
                        <>{/* <TaskAltIcon className="text-green-600" /> */}</>
                      ))}

                    {t.cmc_estado === "3" && (
                      <CloudDoneIcon className="text-blue-600" />
                    )}
                  </td>
                </tr>
                {t.otAsignadas.map((v) => {
                  return (
                    <tr>
                      <td colSpan={4}></td>
                      <td>{v.rol_nombre}</td>
                      <td>{v.via_otrcod}</td>
                      <td>
                        {v.utr_plautr} - {v.via_nviaje}
                      </td>
                      <td>
                        {v.cmc_ingreso &&
                          convertirDateToTimeString(v.cmc_ingreso)}
                      </td>
                      <td>
                        {v.cmc_salida &&
                          convertirDateToTimeString(v.cmc_salida)}
                      </td>
                      <td>
                        {t.cmc_estado === "1" && (
                          <button
                            onClick={() => {
                              handleEditOT(v, t);
                            }}
                          >
                            <EditIcon sx={{ fontSize: "14px" }} />
                          </button>
                        )}
                      </td>
                      <td>{v.cmc_hormod}</td>
                      <td>{v.cmc_hormoi}</td>
                      <td>{v.cmc_horede}</td>
                      <td></td>
                    </tr>
                  );
                })}
              </>
            );
          })}
        {/* {!loadingTable &&
          page < totalPages &&
          trabajadores.result.length > 1 && (
            <tr>
              <td colSpan={BANDEJA_LLENADO_HORAS_PAGE.tableMainHeaders.length}>
                <button onClick={() => onNextPage()}><FaChevronDown className="text-xl" /></button>
              </td>
            </tr>
          )} */}
        {((loadingTable && page < totalPages) ||
          (trabajadores.result.length < 1 && loadingTable)) && (
          <tr>
            <td colSpan={BANDEJA_LLENADO_HORAS_PAGE.tableMainHeaders.length}>
              <CircularProgress />
            </td>
          </tr>
        )}
        {trabajadores.result.length < 1 && !loadingTable && (
          <tr>
            <td colSpan={BANDEJA_LLENADO_HORAS_PAGE.tableMainHeaders.length}>
              No existen datos para mostrar
            </td>
          </tr>
        )}
      </TableCustom>
    </>
  );
};

export default ListTareoTrabajadoresComponent;
