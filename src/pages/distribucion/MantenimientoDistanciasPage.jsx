import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress } from "@mui/material";

import { PAGE_MANTENIMIENTO_DISTANCIAS } from "../../utils/titles";
import BreadcrumbComponent from "../../components/widgets/BreadcrumbComponent";
import FilterComponent from "../../components/widgets/FilterComponent";
import ModalMessage from "../../components/widgets/ModalComponent";
import TableCustom from "../../components/widgets/TableComponent";
import {
  API_DISTRIBUCION,
  MANTENIMIENTO_DISTANCIAS_TABLE_COLS_DESKTOP,
} from "../../utils/general";
import FormDistanciaComponent from "../../components/distribucion/FormDistanciaComponent";
import { deleteFetchFunction, getFetchFunction } from "../../utils/funciones";
import { ERRORS_TEXT } from "../../utils/properties.error.text";

import { useDispatch } from "react-redux";
import { setMessage } from "../../redux/features/utils/utilsSlice";

const MantenimientoDistanciasPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [distancias, setDistancias] = useState([]);
  const [distanciaSelected, setDistanciaSelected] = useState(null);
  const [loadingTable, setLoadingTable] = useState(true);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  
  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const handleNewDistancia = () => {
    setDistanciaSelected(null);
    setOpenModal(true);
  };
  const handleSelectedDistancia = (distancia) => {
    setDistanciaSelected(distancia);
    setOpenModal(true);
  };

  const handleSelectedDeleteDistrito = (distancia) => {
    setDistanciaSelected(distancia);
    setOpenModalDelete(true);
  };
  const onDeleteDistancia = () => {
    const deleteDistancia = async () => {
      try {
        await deleteFetchFunction(
          `${API_DISTRIBUCION}/ruta/deleteDistancia?id=${distanciaSelected.id}`,
          "{}",
          setOpenMessage
        );
        setRefreshTable((prev) => !prev);
      } catch (error) {
        console.error(error);
      }
      //await getFetchFunction(`${API_MAESTRO}/choferes/lista`,setLoadingTable,setChoferes);
    };
    deleteDistancia();
    setOpenModalDelete(false);
  };

  useEffect(() => {
    const fetchDistancias = async () => {
      try {
        await getFetchFunction(
          `${API_DISTRIBUCION}/rutas/listaDistancias`,
          setLoadingTable,
          setDistancias
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
    fetchDistancias();
  }, [refreshTable]);

  return (
    <div className="page-container">
      <div className="page-container-header-page">
        <div className="page-container-header-page-title-content">
          <BreadcrumbComponent
            message={
              PAGE_MANTENIMIENTO_DISTANCIAS +
              ` [${
                distancias && distancias.result && distancias.result.length
              }]`
            }
          />
        </div>
        <div className="page-container-header-page-two-group">
          <button
            onClick={() => handleNewDistancia()}
            className="btn-base-black"
          >
            Nuevo
          </button>
          <div className="w-1/6 lg:w-1/12 text-center content-center grid justify-items-center">
            <FilterComponent title={"Filtrar Distancias"}></FilterComponent>
          </div>
        </div>
      </div>
      <ModalMessage
        open={openModal}
        setOpen={setOpenModal}
        title={distanciaSelected ? "Editar Distancia" : "Nueva Distancia"}
        titleBtnAceptar={"Guardar"}
        onBtnAceptar={() => <></>}
        showButtons={false}
      >
        <FormDistanciaComponent
          distanciaSelected={distanciaSelected}
          setDistanciaSelected={setDistanciaSelected}
          setOpenModal={setOpenModal}
          setRefreshTable={setRefreshTable}
        />
      </ModalMessage>

      <ModalMessage
        open={openModalDelete}
        setOpen={setOpenModalDelete}
        title={"Eliminar distancia"}
        titleBtnAceptar={"Eliminar"}
        onBtnAceptar={() => onDeleteDistancia()}
        showButtons={true}
        isMessage={true}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          ¿Estas seguro de eliminar?
        </div>
      </ModalMessage>

      <div>
        <TableCustom cols={MANTENIMIENTO_DISTANCIAS_TABLE_COLS_DESKTOP}>
          {!loadingTable ? (
            distancias &&
            distancias.result.map((d) => (
              <tr key={d.id}>
                <td>{d.sed_descor}</td>
                <td>{d.ubi_des}</td>
                <td>{d.ruk_kilometros.toFixed(2)}</td>
                <td className="space-x-2">
                  <EditIcon
                    className="text-gray-700 cursor-pointer"
                    onClick={() => handleSelectedDistancia(d)}
                  />
                  <DeleteIcon
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleSelectedDeleteDistrito(d)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={MANTENIMIENTO_DISTANCIAS_TABLE_COLS_DESKTOP.length}>
                <CircularProgress />
              </td>
            </tr>
          )}
        </TableCustom>
      </div>
    </div>
  );
};

export default MantenimientoDistanciasPage;
