import React from "react";

import EditIcon from "@mui/icons-material/Edit";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import BackupIcon from "@mui/icons-material/Backup";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import { FaTruck, FaTruckArrowRight } from "react-icons/fa6";

import { LLENADO_OT_PAGE } from "../../../utils/properties.text";
import TableCustom from "../../widgets/TableComponent";
import {
  convertirDateTimeToDate,
  convertirDateToTimeString,
} from "../../../utils/funciones";
import { ERRORS_TEXT } from "../../../utils/properties.error.text";

const ListOrdenesTrabajoOTComponent = ({
  viajes,
  loadingTableViajes,
  setViajeSelected,
  viajeSelected,
  setOpenModalFormLlenadoOt,
  setModalConfirmarBloqueo,
  setModalOpenOT,
  setOpenModalTrabajadoresAsignados,
  handleShowGRTHorarios,
}) => {
  /**
   * Devuelve nombre del estado a mostrar
   * @param {string} estado
   * @returns
   */
  const estadosOT = (estado) => {
    switch (estado) {
      case "3":
      case "4":
        return (
          <>
            <AutorenewIcon
              sx={{ fontSize: "20px" }}
              className="text-blue-600 mr-1"
            />
            En Proceso
          </>
        );
      case "5":
        return (
          <>
            Completado
          </>
        );
      case "7":
        return <>Cerrado</>;
      default:
        return (
          <>
            <AccessTimeFilledIcon
              sx={{ fontSize: "18px" }}
              className="text-yellow-600 mr-1"
            />
            Pendiente
          </>
        );
    }
  };

  return (
    <>
      <TableCustom cols={LLENADO_OT_PAGE.tableOTHeaders} maxHeight={75}>
        {!loadingTableViajes && viajes.result && viajes.result.length > 0 ? (
          viajes.result.map((viaje) => {
            return (
              <tr key={viaje.idviaje}>
                <td>{viaje.via_otrcod}</td>
                <td>
                  {viaje.utr_plautr
                    ? `${viaje.utr_plautr} - ${viaje.via_nviaje}`
                    : viaje.via_observ}
                </td>
                <td>
                  {viaje.via_estado < 4 &&
                    (viaje.utr_tercero === "N" ? (
                      <>
                        <FaTruck className="text-2xl text-blue-700" />
                      </>
                    ) : (
                      <>
                        <FaTruckArrowRight className="text-2xl text-red-700" />
                      </>
                    ))}
                </td>
                <td className="text-center">
                  {viaje.via_estado < 4 && (
                    <div>
                      <div>FS: {convertirDateTimeToDate(viaje.via_desfch)}</div>
                      <div>FR: {convertirDateTimeToDate(viaje.via_retfch)}</div>
                    </div>
                  )}
                </td>
                <td className="text-center">
                  {viaje.via_partida &&
                    convertirDateToTimeString(viaje.via_partida)}
                </td>
                <td className="text-center">
                  {viaje.via_llegada &&
                    convertirDateToTimeString(viaje.via_llegada)}
                </td>
                <td className="text-center">
                  {viaje.via_tot_horas && viaje.via_tot_horas.toFixed(2)}
                </td>
                <td className="text-center">{viaje.via_klmini}</td>
                <td className="text-center">{viaje.via_klmfin}</td>
                <td className="text-center">{viaje.via_tot_klm}</td>
                <td className="text-center">{viaje.via_otrede}</td>
                <td>{viaje.via_estado < 4 && estadosOT(viaje.via_otrest)}</td>
                <td>
                  {viaje.via_otrest < 3 && viaje.via_estado < 4 && (
                    <EditIcon
                      className="cursor-pointer text-gray-600"
                      onClick={() => {
                        setViajeSelected(viaje);
                        setOpenModalFormLlenadoOt(true);
                      }}
                    />
                  )}
                </td>
                <td>
                  {viaje.via_estado < 4 && (
                    <LibraryAddIcon
                      className="cursor-pointer text-blue-600"
                      sx={{ fontSize: "30px" }}
                      onClick={() => handleShowGRTHorarios(viaje)}
                    />
                  )}
                </td>
                <td>
                  {viaje.via_otrest === "3" ? (
                    <LockOpenIcon
                      className="cursor-pointer text-yellow-600"
                      onClick={() => {
                        setViajeSelected(viaje);
                        setModalConfirmarBloqueo(true);
                      }}
                    />
                  ) : viaje.via_otrest === "4" ? (
                    <LockIcon
                      className="cursor-pointer text-yellow-600"
                      onClick={() => {
                        setViajeSelected(viaje);
                        setModalOpenOT(true);
                      }}
                    />
                  ) : viaje.via_otrest === "5" ? (
                    <BackupIcon className="text-blue-600" />
                  ) : (
                    viaje.via_otrest === "7" && (
                      <CloudDoneIcon className="text-blue-600" />
                    )
                  )}
                </td>
                <td>
                  <div className="text-left">
                    <div>{viaje.via_otrusu}</div>
                    <div>
                      {convertirDateTimeToDate(viaje.via_otrfch)}{" "}
                      {convertirDateToTimeString(viaje.via_otrfch)}
                    </div>
                  </div>
                </td>
                <td>
                  {viaje.via_estado < 8 && (
                    <button
                      onClick={() => {
                        setViajeSelected(viaje);
                        setOpenModalTrabajadoresAsignados(true);
                      }}
                    >
                      <VisibilityIcon className="" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={LLENADO_OT_PAGE.tableOTHeaders.length}>
              {ERRORS_TEXT.emptyDataTable}
            </td>
          </tr>
        )}
      </TableCustom>
    </>
  );
};

export default ListOrdenesTrabajoOTComponent;
