import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import { PAGE_MANTENIMIENTO_RUTAS } from "../../utils/titles";
import BreadcrumbComponent from "../../components/widgets/BreadcrumbComponent";
import FilterComponent from "../../components/widgets/FilterComponent";
import ModalMessage from "../../components/widgets/ModalComponent";
import { API_DISTRIBUCION } from "../../utils/general";
import FormRutasComponent from "../../components/distribucion/FormRutasComponent";
import { deleteFetchFunction, getFetchFunction } from "../../utils/funciones";
import ListRutasComponent from "../../components/distribucion/ListRutasComponent";
import FormAgregarDistritosToRutaComponent from "../../components/distribucion/FormAgregarDistritosToRutaComponent";
import { ERRORS_TEXT } from "../../utils/properties.error.text";
import { useDispatch } from "react-redux";
import { setMessage } from "../../redux/features/utils/utilsSlice";

const MantenimientoRutasPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [rutas, setRutas] = useState([]);
  const [rutaSelected, setRutaSelected] = useState(null);
  const [loadingTable, setLoadingTable] = useState(true);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const [refreshTable, setRefreshTable] = useState(false);
 
  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const handleNewRuta = () => {
    setRutaSelected(null);
    setOpenModal(true);
  };
  const handleSelectedRuta = (ruta) => {
    setRutaSelected(ruta);
    setOpenModal(true);
  };

  const handleSelectedDeleteRuta = (ruta) => {
    setRutaSelected(ruta);
    setOpenModalDelete(true);
  };

  const onDeleteRuta = () => {
    const deleteRuta = async () => {
      try {
        await deleteFetchFunction(
          `${API_DISTRIBUCION}/ruta/delete?id=${rutaSelected.id}`,
          "{}",
          setOpenMessage
        );
        setRefreshTable((prev) => !prev);
      } catch (error) {
        console.error(error);
      }
      //await getFetchFunction(`${API_MAESTRO}/choferes/lista`,setLoadingTable,setChoferes);
    };
    deleteRuta();
    setOpenModalDelete(false);
  };

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        await getFetchFunction(
          `${API_DISTRIBUCION}/rutas/lista`,
          setLoadingTable,
          setRutas
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
    fetchRutas();
  }, [refreshTable]);

  const [openModalAsignDistrito, setOpenModalAsignDistrito] = useState(false);
  const handleSelectedRutaToDistrito = (ruta) => {
    setRutaSelected(ruta);
    setOpenModalAsignDistrito(true);
  };

  return (
    <div className="page-container">
      <div className="page-container-header-page">
        <div className="page-container-header-page-title-content">
          <BreadcrumbComponent
            message={
              PAGE_MANTENIMIENTO_RUTAS +
              ` [${rutas && rutas.result && rutas.result.length}]`
            }
          />
        </div>

        <div className="page-container-header-page-two-group">
          <button onClick={() => handleNewRuta()} className="btn-base-black">
            Nuevo
          </button>
          <div className="w-1/6 lg:w-1/12 text-center content-center grid justify-items-center">
            <FilterComponent title={"Filtrar Rutas"}></FilterComponent>
          </div>
        </div>
      </div>

      <ModalMessage
        open={openModal}
        setOpen={setOpenModal}
        title={rutaSelected ? "Editar Ruta" : "Nueva Ruta"}
        titleBtnAceptar={"Guardar"}
        onBtnAceptar={<></>}
        showButtons={false}
      >
        <FormRutasComponent
          rutaSelected={rutaSelected}
          setOpenModal={setOpenModal}
          setRefreshTable={setRefreshTable}
        />
      </ModalMessage>

      <ModalMessage
        open={openModalDelete}
        setOpen={setOpenModalDelete}
        title={"Eliminar Ruta"}
        titleBtnAceptar={"Eliminar"}
        onBtnAceptar={() => onDeleteRuta()}
        showButtons={true}
        isMessage={true}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          ¿Estas seguro de eliminar?
        </div>
      </ModalMessage>

      <ModalMessage
        open={openModalAsignDistrito}
        setOpen={setOpenModalAsignDistrito}
        title={"Asignar Distritos"}
        titleBtnAceptar={"Guardar"}
        onBtnAceptar={<></>}
        showButtons={false}
      >
        <FormAgregarDistritosToRutaComponent
          ruta={rutaSelected}
          setOpenModal={setOpenModalAsignDistrito}
        />
      </ModalMessage>

      <ListRutasComponent
        loadingTable={loadingTable}
        rutas={rutas}
        handleSelectedRuta={handleSelectedRuta}
        handleSelectedDeleteRuta={handleSelectedDeleteRuta}
        handleSelectedRutaToDistrito={handleSelectedRutaToDistrito}
      />
    </div>
  );
};

export default MantenimientoRutasPage;
