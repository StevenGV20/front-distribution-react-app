import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/features/utils/utilsSlice";

import {
  API_DISTRIBUCION,
  GRUPOS_COLS_MODAL_DESKTOP,
} from "../../../utils/general";
import {
  AGRUPAR_ORDENES_DESPACHO_PAGE,
  ASIGNAR_VEHICULO_PAGE,
} from "../../../utils/properties.text";
import TableCustom from "../../widgets/TableComponent";
import TableCollapseMUICustomComponent from "../../widgets/TableComponent/TableCollapseMUICustomComponent";
import ListOrdenesDespachoComponent from "../ListOrdenesDespachoComponent";
import {
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TableCell,
  TableRow,
} from "@mui/material";
import {
  convertirDateTimeToDate,
  postFetchFunctionCustomFunction,
} from "../../../utils/funciones";
import ModalMessage from "../../widgets/ModalComponent";

function Row(props) {
  const {
    row,
    isMobile,
    vehiculos,
    loadingTableVehiculos,
    setRefreshTable,
    titlePage,
  } = props;

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const [grupo, setGrupo] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const handleChange = (event) => {
    const v_selected = event.target.value;
    // console.log(row, v_selected);
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
    // console.log(row.chofer);
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
        via_updusu: localStorage.getItem("USERNAME"),
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
        via_updusu: localStorage.getItem("USERNAME"),
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

  // console.log("ROW", vehiculos);

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
            titlePage={titlePage}
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
              {row.idviaje > 0 ||
              ASIGNAR_VEHICULO_PAGE.titlePage != titlePage ? (
                <>
                  <div className="flex space-x-2 justify-center w-full">
                    <div>{row.utr_plautr}</div>
                    {row.gru_estado === "2" && (
                      <button onClick={() => handleDelete(row)}>
                        <DeleteIcon className="text-red-600" />
                      </button>
                    )}
                  </div>
                </>
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
                              v.utr_carvol > 0 && (
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
            <TableCell align="center">
              {ASIGNAR_VEHICULO_PAGE.titlePage != titlePage && row.ruta}
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

const ListGruposComponent = ({
  grupos,
  loadingTable,
  vehiculos,
  loadingTableVehiculos,
  setRefreshTable,
  titlePage,
}) => {
  return (
    <>
      <TableCustom cols={ASIGNAR_VEHICULO_PAGE.table_grupos_titles(true)} mini={true}>
        {!loadingTable ? (
          grupos.result.length > 0 ? (
            grupos.result.map((row) => (
              <Row
                key={row.id}
                row={row}
                isMobile={false}
                loadingTable={loadingTable}
                vehiculos={vehiculos}
                loadingTableVehiculos={loadingTableVehiculos}
                setRefreshTable={setRefreshTable}
                titlePage={titlePage}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={ASIGNAR_VEHICULO_PAGE.table_grupos_titles.length}
              >
                No existe data.
              </TableCell>
            </TableRow>
          )
        ) : (
          <TableRow>
            <TableCell
              colSpan={ASIGNAR_VEHICULO_PAGE.table_grupos_titles.length}
            >
              <CircularProgress />
            </TableCell>
          </TableRow>
        )}
      </TableCustom>
    </>
  );
};

export default ListGruposComponent;
