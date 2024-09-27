import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import {
  API_MAESTRO,
  MANTENIMIENTO_CHOFERES_TABLE_COLS_DESKTOP,
  MANTENIMIENTO_CHOFERES_TABLE_COLS_MOBILE,
} from "../../utils/general";
import { PAGE_MANTENIMIENTO_CHOFERES } from "../../utils/titles";
import { deleteFetchFunction, getFetchFunction } from "../../utils/funciones";
import BreadcrumbComponent from "../../components/widgets/BreadcrumbComponent";
import FilterComponent from "../../components/widgets/FilterComponent";
import ModalMessage from "../../components/widgets/ModalComponent";
import FormChoferesComponent from "../../components/distribucion/FormChoferesComponent";
import TableCustom from "../../components/widgets/TableComponent";
import PaginationCustom from "../../components/widgets/PaginationComponent/PaginationCustom";
import { ERRORS_TEXT } from "../../utils/properties.error.text";
import { useDispatch } from "react-redux";
import { setMessage } from "../../redux/features/utils/utilsSlice";

const MantenimientoChoferesPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [choferes, setChoferes] = useState({result:[]});
  const [choferSelected, setChoferSelected] = useState(null);
  const [loadingTable, setLoadingTable] = useState(true);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  
  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const handleNewChofer = () => {
    setChoferSelected(null);
    setOpenModal(true);
  };
  const handleSelectedDistancia = (chofer) => {
    setChoferSelected(chofer);
    setOpenModal(true);
  };

  const handleSelectedDeleteDChofer = (chofer) => {
    setChoferSelected(chofer);
    setOpenModalDelete(true);
  };

  const onDeleteChofer = () => {
    const fetchDistancias = async () => {
      try {
        await deleteFetchFunction(
          `${API_MAESTRO}/choferes/delete?id=${choferSelected.id}`,
          "{}",
          setOpenMessage
        );
        setRefreshTable((prev) => !prev);
      } catch (error) {
        console.error(error);
      }
      //await getFetchFunction(`${API_MAESTRO}/choferes/lista`,setLoadingTable,setChoferes);
    };
    fetchDistancias();
    setOpenModalDelete(false);
  };

  const fetchChoferes = async (page, limit, orderBy = "nombre") => {
    try {
      await getFetchFunction(
        `${API_MAESTRO}/choferes/listaPaginado?page=${page}&sizePage=${limit}&orderBy=${
          orderBy > 0 || "nombre"
        }&cia=01&texto=${filtrosChoferes.texto}`,
        setLoadingTable,
        setChoferes
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
    fetchChoferes(1, 10, "nombre");
  }, [refreshTable]);

  const orderByChoferes = [
    { value: "id", name: "ID" },
    { value: "nombre", name: "Nombre" },
  ];

  const [filtrosChoferes, setFiltrosChoferes] = useState({
    texto: "",
  });

  const onSearchFiltros = () => {
    fetchChoferes(1, 10, "nombre");
  };

  return (
    <div className="page-container">
      <div className="page-container-header-page">
        <div className="page-container-header-page-title-content">
          <BreadcrumbComponent
            message={
              PAGE_MANTENIMIENTO_CHOFERES +
              ` [${
                choferes && choferes.result.length > 0 && choferes.result[0].totalrows || 0
              }]`
            }
          />
        </div>
        <div className="page-container-header-page-two-group">
          <button onClick={() => handleNewChofer()} className="btn-base-black">
            Nuevo
          </button>
          <div className="w-1/6 lg:w-1/12 text-center content-center grid justify-items-center">
            <FilterComponent title={"Filtrar Choferes"}>
              <div className="filter-content">
                <div>
                  <input
                    type="text"
                    value={filtrosChoferes.texto}
                    className="modal-group-input w-full rounded-md border-blue-800 focus:border-blue-700 focus:shadow-md focus:shadow-blue-400"
                    onChange={(e) =>
                      setFiltrosChoferes({
                        ...filtrosChoferes,
                        texto: e.target.value,
                      })
                    }
                    placeholder="Orden Despacho, Pedido, Cliente, Grupo"
                  />
                </div>
              </div>
              <button
                className="bg-black w-full py-2 text-white my-4 rounded-md"
                onClick={() => onSearchFiltros()}
              >
                Buscar
              </button>
            </FilterComponent>
          </div>
        </div>
      </div>
      <ModalMessage
        open={openModal}
        setOpen={setOpenModal}
        title={choferSelected ? "Editar Chofer" : "Nuevo Chofer"}
        titleBtnAceptar={"Guardar"}
        onBtnAceptar={() => <></>}
        showButtons={false}
      >
        <FormChoferesComponent
          choferSelected={choferSelected}
          setChoferSelected={setChoferSelected}
          setOpenModal={setOpenModal}
          setRefreshTable={setRefreshTable}
        />
      </ModalMessage>

      <ModalMessage
        open={openModalDelete}
        setOpen={setOpenModalDelete}
        title={"Eliminar Chofer"}
        titleBtnAceptar={"Eliminar"}
        onBtnAceptar={() => onDeleteChofer()}
        showButtons={true}
        isMessage={true}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          ¿Estas seguro de eliminar?
        </div>
      </ModalMessage>

      <PaginationCustom
        fetchData={fetchChoferes}
        totalRows={choferes.result.length > 0 && choferes.result[0].totalrows}
        orderByList={orderByChoferes}
      >
        <div className="desktop">
          <TableCustom cols={MANTENIMIENTO_CHOFERES_TABLE_COLS_DESKTOP}>
            {!loadingTable ? (
              choferes &&
              choferes.result.map(
                (d, index) =>
                  index !== 0 && (
                    <tr key={d.id}>
                      <td>{d.cho_codcho}</td>
                      <td>{d.cho_nombre}</td>
                      <td>{d.cho_nrolic}</td>
                      <td>{d.cho_codusu}</td>
                      <td>{d.cho_codemp}</td>
                      <td>{d.cho_nrodoc}</td>
                      <td className="space-x-2">
                        <EditIcon
                          className="text-gray-700 cursor-pointer"
                          onClick={() => handleSelectedDistancia(d)}
                        />
                        <DeleteIcon
                          className="text-red-600 cursor-pointer"
                          onClick={() => handleSelectedDeleteDChofer(d)}
                        />
                      </td>
                    </tr>
                  )
              )
            ) : (
              <tr>
                <td colSpan={MANTENIMIENTO_CHOFERES_TABLE_COLS_DESKTOP.length}>
                  <CircularProgress />
                </td>
              </tr>
            )}
          </TableCustom>
        </div>

        <div className="mobile">
          <TableCustom cols={MANTENIMIENTO_CHOFERES_TABLE_COLS_MOBILE}>
            {!loadingTable ? (
              choferes &&
              choferes.result.map(
                (d, index) =>
                  index !== 0 && (
                    <tr key={d.id}>
                      <td>
                        <div>{d.cho_codcho}</div>
                        <div>{d.cho_nombre}</div>
                        <div>{d.cho_nrolic}</div>
                        <div>{d.cho_codemp}</div>
                        <div>{d.cho_nrodoc}</div>
                      </td>
                      <td className="space-x-2">
                        <EditIcon
                          className="text-gray-700 cursor-pointer"
                          onClick={() => handleSelectedDistancia(d)}
                        />
                        <DeleteIcon
                          className="text-red-600 cursor-pointer"
                          onClick={() => handleSelectedDeleteDChofer(d)}
                        />
                      </td>
                    </tr>
                  )
              )
            ) : (
              <tr>
                <td colSpan={MANTENIMIENTO_CHOFERES_TABLE_COLS_DESKTOP.length}>
                  <CircularProgress />
                </td>
              </tr>
            )}
          </TableCustom>
        </div>
      </PaginationCustom>
    </div>
  );
};

export default MantenimientoChoferesPage;
