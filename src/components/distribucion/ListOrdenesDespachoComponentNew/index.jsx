import React, { useState } from "react";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import { Checkbox, CircularProgress } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import TableCustom from "../../widgets/TableComponent";
import DeleteIcon from "@mui/icons-material/Delete";
import { PAGE_AGRUPAR_OD, PAGE_GENERAR_GRR } from "../../../utils/titles";
import ModalMessage from "../../widgets/ModalComponent";
import ParticionarODComponent from "../ParticionarODComponent";
import { API_DISTRIBUCION, PEN_CURRENCY } from "../../../utils/general";
import { objOrdenesDespachoEntity } from "../../../api/ordenesDespachoApi";
import {
  convertirDateTimeToDate,
  putFetchFunction,
} from "../../../utils/funciones";
import BasicPopover from "../../widgets/PopoverCustom";
import FormEditCargaOrdenDespachoComponent from "../FormEditCargaOrdenDespachoComponent";
import FormEditarLugarDespachoComponent from "../FormEditarLugarDespachoComponent";
import {
  AGRUPAR_ORDENES_DESPACHO_PAGE,
  ASIGNAR_VEHICULO_PAGE,
  GGUIA_REMISION_REMITENTE_PAGE,
  LIST_ORDENES_DESPACHO_COMPONENT_TEXT,
} from "../../../utils/properties.text";
import DetailsOrdenDespachoComponent from "../DetailsOrdenDespachoComponent";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/features/utils/utilsSlice";

const ListOrdenesDespachoComponentNEW = ({
  ordenesDespacho = objOrdenesDespachoEntity,
  setOrdenesDespacho,
  showButtonDelete,
  showPagination,
  carritoOrdenesDespacho = objOrdenesDespachoEntity.result,
  setCarritoOrdenesDespacho,
  titlePage = "",
  loadingTable,
  handleSelectRowToCart,
  findOrdenesDespacho,
  setRefreshTable,
  showGrupo = true,
}) => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = useState(10);
  const handleChange = (event, value) => {
    setPage(value);
    findOrdenesDespacho(value, limit);
  };

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const [ordenSelected, setOrdenSelected] = useState(null);

  const handleSelectOrden = (orden) => {
    setOrdenSelected(orden);
  };

  const handleDeletedGroup = (orden) => {
    setOrdenSelected(orden);
    setOpenModalDelete(true);
  };

  const onDeletedGroup = () => {
    const openMessage = (data) => {
      setOpenMessage({
        state: true,
        message: data.mensaje,
        type: data.status.toLowerCase(),
      });
      setRefreshTable((prev) => !prev);
      setOpenModalDelete(false);
    };

    putFetchFunction(
      `${API_DISTRIBUCION}/grupo/anular?codigo=${ordenSelected.gru_grucod}`,
      {},
      openMessage
    );
  };

  const isLoadCarga = (orden) => {
    return (
      orden.odc_bultos > 0 && orden.odc_volumen > 0 && orden.odc_imptot > 0
    );
  };

  const userLocal = localStorage.getItem("USERNAME");

  const handleSelectRow = (orden) => {
    if (titlePage.match(PAGE_AGRUPAR_OD) && !orden.gru_grucod) {
      if (isLoadCarga(orden) || orden.odc_estado === "2") {
        handleSelectRowToCart(orden);
      } else {
        handleSelectOrden(orden);
        setOpenEditOrden(true);
      }
    } else if (titlePage.match(PAGE_GENERAR_GRR)) {
      handleSelectRowToCart(orden);
    }
  };

  const [openEditOrden, setOpenEditOrden] = useState(false);

  const [openModalDelete, setOpenModalDelete] = useState(false);

  const [openModalEditLugarDespcaho, setOpenModalEditLugarDespcaho] =
    useState(false);

  const [openModalODDetails, setOpenModalODDetails] = useState(false);
  const handleShowODDetails = (orden) => {
    handleSelectOrden(orden);
    setOpenModalODDetails(true);
  };

  /* const cols = titlePage.match(AGRUPAR_ORDENES_DESPACHO_PAGE.titlePage)
    ? AGRUPAR_ORDENES_DESPACHO_PAGE.tableListOrdenes
    : AGRUPAR_ORDENES_DESPACHO_PAGE.tableListOrdenes.slice(
        0,
        AGRUPAR_ORDENES_DESPACHO_PAGE.tableListOrdenes.length -
          (showGrupo ? 1 : 2)
      ); */
  const cols = LIST_ORDENES_DESPACHO_COMPONENT_TEXT.tableHeaders(titlePage);

  return (
    <div>
      <ModalMessage
        open={openModalDelete}
        setOpen={setOpenModalDelete}
        title={"Eliminar Grupo"}
        titleBtnAceptar={"Eliminar"}
        onBtnAceptar={() => onDeletedGroup()}
        showButtons={true}
        isMessage={true}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          ¿Estas seguro de eliminar?
        </div>
      </ModalMessage>

      <ModalMessage
        open={openEditOrden}
        setOpen={setOpenEditOrden}
        title={`Editar Carga de la Orden de Despacho - ${
          ordenSelected && ordenSelected.odc_numodc
        }`}
        titleBtnAceptar={"Agregar"}
        showButtons={false}
        onBtnAceptar={() => setOpenEditOrden(false)}
      >
        <FormEditCargaOrdenDespachoComponent
          ordenSelected={ordenSelected}
          setOpenModal={setOpenEditOrden}
          setCarritoOrdenesDespacho={setCarritoOrdenesDespacho}
          handleSelectRowToCart={handleSelectRowToCart}
        />
      </ModalMessage>
      <ModalMessage
        open={openModalODDetails}
        setOpen={setOpenModalODDetails}
        title={`Detalle de la Orden de Despacho - ${
          ordenSelected && ordenSelected.odc_numodc
        }`}
        titleBtnAceptar={""}
        showButtons={false}
        onBtnAceptar={() => setOpenModalODDetails(false)}
      >
        <DetailsOrdenDespachoComponent orden={ordenSelected} />
      </ModalMessage>

      <div className="my-3" >
        <TableCustom
          cols={cols}
          mini={!titlePage.match(AGRUPAR_ORDENES_DESPACHO_PAGE.titlePage)}
          maxHeight={75}
          style={{ maxHeight: '200px', backgroundColor:'yellow' }}
        >
          {!loadingTable ? (
            ordenesDespacho &&
            ordenesDespacho.map((orden) => (
              <tr
                className={`table-container-tbody-tr
                  ${
                    !orden.gru_grucod &&
                    titlePage.match(AGRUPAR_ORDENES_DESPACHO_PAGE.titlePage)
                      ? orden.odc_estado === "2" &&
                        orden.odc_selusu === userLocal
                        ? "border-1 shadow-xl bg-red text-white"
                        : orden.odc_estado === "2" &&
                          orden.odc_selusu !== userLocal
                        ? "bg-gray-200 text-gray-400"
                        : "hover:shadow-xl hover:cursor-pointer"
                      : ""
                  }`}
                key={orden.id}
              >
                <td
                  /* onClick={() => handleSelectRow(orden)} */ className="hover:cursor-default"
                >
                  <div className="td-group text-center px-4">
                    <div
                      className={`rounded-md px-2 font-semibold tracking-widest text-white text-sm ${
                        !isLoadCarga(orden)
                          ? "bg-red"
                          : !orden.gru_grucod
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      } ${ orden.gru_grucod ? "bg-green-500" : ""}`} 
                    >
                      {orden.odc_numodc}
                    </div>
                    <div className="text-xs"> {orden.odc_numori}</div>
                  </div>
                  <div className="td-group">
                    <div>
                      {orden.odc_fecdoc &&
                        convertirDateTimeToDate(orden.odc_fecdoc)}
                    </div>
                  </div>
                </td>
                {!titlePage.match(ASIGNAR_VEHICULO_PAGE.titlePage) && (
                  <td onClick={() => handleSelectRow(orden)}>
                    <div className="td-group">
                      <div>{orden.ppc_numppc}</div>
                    </div>
                  </td>
                )}
                {/* <td onClick={() => handleSelectRow(orden)}>
                  {orden.odc_canal_des}
                </td> */}
                <td onClick={() => handleSelectRow(orden)}>
                  <div className="td-group space-y-2">
                    <div className="font-normal">{orden.aux_nomaux}</div>
                    <div className="font-semibold">{orden.aux_codaux}</div>
                    {/* <div className="">{orden.odc_dirdes}</div>
                    <div className="font-semibold">{orden.odc_desubigeo}</div> */}
                  </div>
                </td>
                {/* <td onClick={() => handleSelectRow(orden)}>
                  {orden.odc_volumen}
                </td> */}
                {/* <td onClick={() => handleSelectRow(orden)}>
                  {orden.odc_bultos}
                </td> */}
                {/* <td onClick={() => handleSelectRow(orden)}>{orden.odc_peso > 0 ? orden.odc_peso.toFixed(3) : 0.000}</td> */}
                {/* <td onClick={() => handleSelectRow(orden)}>
                  <div>{orden.odc_imptot}</div>
                </td> */}
                {/* <td>{orden.orden_compra}</td>
                <td>{orden.nom_tienda}</td> */}
                {/* <td onClick={() => handleSelectRow(orden)}>
                  <div>{orden.odc_dirdes}</div>
                  <div className="font-medium">{orden.odc_desubigeo}</div>
                </td> */}
                {/* <td onClick={() => handleSelectRow(orden)}>
                  <div>{orden.odc_distancia}</div>
                </td> */}
                {/* <td onClick={() => handleSelectRow(orden)}>
                  <div>{orden.odc_ranrec}</div>
                </td> */}
                {showGrupo && (
                  <td className="td-group bg-transparent text-center cursor-default">
                    <>
                      <div className="flex space-x-2 justify-center w-full">
                        <div className="">{orden.gru_grucod} </div>
                        {showButtonDelete &&
                          orden.gru_grucod &&
                          orden.odc_estado === "3" && (
                            <button onClick={() => handleDeletedGroup(orden)}>
                              <DeleteIcon className="text-red-600" />
                            </button>
                          )}
                      </div>
                    </>
                  </td>
                )}
                ´
                
                {titlePage.match(GGUIA_REMISION_REMITENTE_PAGE.titlePage) && (
                  <>
                    <td className="td-group bg-transparent text-center cursor-default">
                      <>
                        <div className="block space-y-0 justify-center w-full">
                          <div className="font-bold">{orden.utr_plautr} </div>
                          <div className="text-xs">{orden.cho_nombre}</div>
                        </div>
                      </>
                    </td>
                    <td className="td-group bg-transparent text-center cursor-default">
                      <>
                        <div className="block space-y-0 justify-center w-full">
                          <div className="">{orden.grc_numdoc} </div>
                          <div className="text-xs font-bold">
                            {orden.grc_tipdoc}{" "}
                          </div>
                        </div>
                      </>
                    </td>
                  </>
                )}
                {titlePage.match(PAGE_AGRUPAR_OD) && (
                  <td className="td-group bg-transparent text-center cursor-default">
                    <div className="z-10">
                      <>
                        {((orden.odc_estado === "2" &&
                          orden.odc_selusu === userLocal) ||
                          orden.odc_estado === "1") && (
                          <BasicPopover isClose={openEditOrden}>
                            <ParticionarODComponent
                              handleSelectOrden={handleSelectOrden}
                              ordenRow={orden}
                              ordenSelected={ordenSelected}
                              setRefreshTable={setRefreshTable}
                            />
                            <>
                              <button
                                className="flex row-span-2 items-center"
                                onClick={() => {
                                  handleSelectOrden(orden);
                                  setOpenEditOrden(true);
                                }}
                              >
                                <EditIcon className="text-gray-500 text-center ml-6" />
                                <span className="text-black font-bold px-2 py-2">
                                  Editar Carga
                                </span>
                              </button>
                              <button
                                className="flex row-span-2 items-center"
                                onClick={() => handleShowODDetails(orden)}
                              >
                                <VisibilityIcon
                                  sx={{ fontSize: "20px" }}
                                  className="ml-6"
                                />
                                <span className="text-black font-bold px-2 py-2">
                                  Ver Detalle
                                </span>
                              </button>
                            </>
                          </BasicPopover>
                        )}
                      </>
                    </div>
                  </td>
                )}
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={cols.length}>
                <CircularProgress />
              </td>
            </tr>
          )}
        </TableCustom>
      </div>
      

      {showPagination && (
        <div className="w-full flex justify-center">
          <Stack spacing={2}>
            <Pagination
              count={
                ordenesDespacho &&
                Math.ceil(ordenesDespacho.result.length / limit)
              }
              color="primary"
              showFirstButton
              showLastButton
              page={page}
              onChange={handleChange}
            />
          </Stack>
        </div>
      )}
    </div>
  );
};

export default ListOrdenesDespachoComponentNEW;
