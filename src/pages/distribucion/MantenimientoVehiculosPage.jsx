import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress } from "@mui/material";

import { PAGE_MANTENIMIENTO_VEHICULOS } from "../../utils/titles";
import BreadcrumbComponent from "../../components/widgets/BreadcrumbComponent";
import FilterComponent from "../../components/widgets/FilterComponent";
import ModalMessage from "../../components/widgets/ModalComponent";
import TableCustom from "../../components/widgets/TableComponent";
import {
  API_MAESTRO,
  MANTENIMIENTO_UNIDAD_TRANSPORTE_TABLE_COLS_DESKTOP,
  MANTENIMIENTO_UNIDAD_TRANSPORTE_TABLE_COLS_MOBILE,
} from "../../utils/general";
import FormUnidadesTransporteComponent from "../../components/distribucion/FormUnidadesTransporteComponent";
import { deleteFetchFunction, getFetchFunction } from "../../utils/funciones";
import PaginationCustom from "../../components/widgets/PaginationComponent/PaginationCustom";
import { ERRORS_TEXT } from "../../utils/properties.error.text";
import { useDispatch } from "react-redux";
import { setMessage } from "../../redux/features/utils/utilsSlice";

const MantenimientoVehiculosPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [vehiculos, setVehiculos] = useState({result:[]});
  const [loadingTable, setLoadingTable] = useState(true);
  const [vehiculoSelected, setVehiculoSelected] = useState(null);
  const [refreshTable, setRefreshTable] = useState(false);

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const handleNewdVehiculo = () => {
    setVehiculoSelected(null);
    setOpenModal(true);
  };
  const handleSelectedVehiculo = (vehiculo) => {
    setVehiculoSelected(vehiculo);
    setOpenModal(true);
  };

  const handleSelectedDeleteVehiculo = (vehiculo) => {
    setVehiculoSelected(vehiculo);
    setOpenModalDelete(true);
  };
  const onDeleteVehiculo = () => {
    //alert(JSON.stringify(vehiculoSelected));

    const fetchUnidadTransporte = async () => {
      try {
        await deleteFetchFunction(
          `${API_MAESTRO}/unidadesTransporte/delete?id=${vehiculoSelected.id}`,
          "{}",
          setOpenMessage
        );
        setRefreshTable((prev) => !prev);
      } catch (error) {
        console.error(error);
      }
      //await getFetchFunction(`${API_MAESTRO}/choferes/lista`,setLoadingTable,setChoferes);
    };
    fetchUnidadTransporte();
    setOpenModalDelete(false);
  };

  const fetchVehiculos = async (page, limit) => {
    try {
      await getFetchFunction(
        `${API_MAESTRO}/unidadesTransporte/listaPaginado?page=${page}&sizePage=${limit}`,
        setLoadingTable,
        setVehiculos
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
    fetchVehiculos(1, 10);
    //setTotalRows(data.result[0].totalfilas);
  }, [refreshTable]);

  return (
    <div className="page-container">
      <div className="page-container-header-page">
        <div className="page-container-header-page-title-content">
          <BreadcrumbComponent
            message={
              PAGE_MANTENIMIENTO_VEHICULOS +
              ` [${
                vehiculos &&
                vehiculos.result[0] &&
                vehiculos.result[0].totalfilas &&
                vehiculos.result[0].totalfilas
              }]`
            }
          />
        </div>
        <div className="page-container-header-page-two-group">
          <button
            onClick={() => handleNewdVehiculo()}
            className="btn-base-black"
          >
            Nuevo
          </button>
          <div className="w-1/6 lg:w-1/12 text-center content-center grid justify-items-center">
            <FilterComponent
              title={"Filtrar Unidades de transporte"}
            ></FilterComponent>
          </div>
        </div>
      </div>

      <ModalMessage
        open={openModal}
        setOpen={setOpenModal}
        title={
          vehiculoSelected
            ? "Editar Unidad de transporte"
            : "Nueva Unidad de transporte"
        }
        titleBtnAceptar={"Guardar"}
        onBtnAceptar={() => <></>}
        showButtons={false}
      >
        <FormUnidadesTransporteComponent
          vehiculoSelected={vehiculoSelected}
          setVehiculoSelected={setVehiculoSelected}
          setOpenModal={setOpenModal}
          setRefreshTable={setRefreshTable}
        />
      </ModalMessage>

      <ModalMessage
        open={openModalDelete}
        setOpen={setOpenModalDelete}
        title={"Eliminar vehiculo"}
        titleBtnAceptar={"Eliminar"}
        onBtnAceptar={() => onDeleteVehiculo()}
        showButtons={true}
        isMessage={true}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          ¿Estas seguro de eliminar?
        </div>
      </ModalMessage>

      <PaginationCustom
        totalRows={vehiculos.result.length > 0 && vehiculos.result[0].totalfilas || 0}
        fetchData={fetchVehiculos}
      >
        <div className="desktop">
          <TableCustom
            cols={MANTENIMIENTO_UNIDAD_TRANSPORTE_TABLE_COLS_DESKTOP}
          >
            {!loadingTable ? (
              vehiculos &&
              vehiculos.result.map(
                (v, index) =>
                  index !== 0 && (
                    <tr key={v.id}>
                      <td>{v.id}</td>
                      <td>{v.utr_codutr}</td>
                      <td>
                        <div>{v.utr_desutr}</div>
                        <div>{v.utr_plautr}</div>
                        <div>{v.utr_marutr}</div>
                      </td>
                      <td>
                        {v.utr_tercero === "N" ? (
                          <div>Decapolis</div>
                        ) : (
                          <>
                            <div>{v.utr_prvrso}</div>
                            <div>{v.utr_prvruc}</div>
                          </>
                        )}
                      </td>
                      <td>
                        <div>{v.cho_codcho}</div>
                        <div>{v.cho_nombre}</div>
                        <div>{v.utr_codusu}</div>
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <span className="w-32 text-left">Volumen (m3): </span>
                          <div className="">{v.utr_carvol}</div>
                        </div>
                        <div className="flex justify-center">
                          <span className="w-32 text-left">Peso (tn): </span>
                          <div>{v.utr_carton}</div>
                        </div>
                      </td>
                      <td className="space-x-2">
                        <EditIcon
                          className="text-gray-700 cursor-pointer"
                          onClick={() => handleSelectedVehiculo(v)}
                        />
                        <DeleteIcon
                          className="text-red-600 cursor-pointer"
                          onClick={() => handleSelectedDeleteVehiculo(v)}
                        />
                      </td>
                    </tr>
                  )
              )
            ) : (
              <tr>
                <td
                  colSpan={
                    MANTENIMIENTO_UNIDAD_TRANSPORTE_TABLE_COLS_DESKTOP.length
                  }
                >
                  <CircularProgress />
                </td>
              </tr>
            )}
          </TableCustom>
        </div>

        <div className="mobile">
          <TableCustom cols={MANTENIMIENTO_UNIDAD_TRANSPORTE_TABLE_COLS_MOBILE}>
            {!loadingTable ? (
              vehiculos &&
              vehiculos.result.map(
                (v, index) =>
                  index !== 0 && (
                    <tr key={v.id}>
                      <td>
                        <div>{v.id}</div>
                        <div>{v.utr_codutr}</div>
                        <div>{v.utr_desutr}</div>
                        <div>{v.utr_plautr}</div>
                        <div>{v.utr_marutr}</div>
                        <div>{v.cho_codcho}</div>
                        <div>{v.utr_codusu}</div>
                        <div>{v.utr_conrep}</div>
                        <div>{v.utr_tercero}</div>
                        <div>{v.utr_prvruc}</div>
                        <div>{v.utr_prvrso}</div>
                      </td>
                      <td className="space-y-4">
                        <EditIcon
                          className="text-gray-700 cursor-pointer mb-6"
                          onClick={() => handleSelectedVehiculo(v)}
                        />
                        <DeleteIcon
                          className="text-red-600 cursor-pointer"
                          onClick={() => handleSelectedDeleteVehiculo(v)}
                        />
                      </td>
                    </tr>
                  )
              )
            ) : (
              <tr>
                <td
                  colSpan={
                    MANTENIMIENTO_UNIDAD_TRANSPORTE_TABLE_COLS_DESKTOP.length
                  }
                >
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

export default MantenimientoVehiculosPage;
