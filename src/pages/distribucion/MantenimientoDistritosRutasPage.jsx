import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress } from "@mui/material";

import { PAGE_MANTENIMIENTO_DISTRITOS_RUTAS } from "../../utils/titles";
import BreadcrumbComponent from "../../components/widgets/BreadcrumbComponent";
import FilterComponent from "../../components/widgets/FilterComponent";
import ModalMessage from "../../components/widgets/ModalComponent";
import TableCustom from "../../components/widgets/TableComponent";
import {
  MANTENIMIENTO_RUTAS_DISTRITOS_TABLE_COLS_DESKTOP,
  URL_MASTERLOGIC_API,
} from "../../utils/general";
import FormDistritoRutaComponent from "../../components/distribucion/FormDistritoRutaComponent";

const MantenimientoDistritosRutasPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [rutaDistritos, setRutasDistritos] = useState([]);
  const [distritoSelected, setDistritoSelected] = useState(null);
  const [loadingTable, setLoadingTable] = useState(true);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const handleNewDistrito = () => {
    setDistritoSelected(null);
    setOpenModal(true);
  };
  const handleSelectedDistrito = (distrito) => {
    setDistritoSelected(distrito);
    setOpenModal(true);
  };

  const handleSelectedDeleteDistrito = (distrito) => {
    setDistritoSelected(distrito);
    setOpenModalDelete(true);
  };
  const onDeleteDistrito = () => {
    alert(JSON.stringify(distritoSelected));
    setOpenModalDelete(false);
  };

  useEffect(() => {
    const fetchRutaDistritos = async () => {
      try {
        const response = await fetch(`${URL_MASTERLOGIC_API}/db.json`);
        if (!response.ok) {
          throw new Error("Error al cargar el archivo JSON");
        }
        const data = await response.json();
        ////console.log(data.rutaDistritos);
        setRutasDistritos(data.rutaDistritos);
        setLoadingTable(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRutaDistritos();
  }, []);

  return (
    <div className="page-container">
      <div className="w-2/3">
        <BreadcrumbComponent message={PAGE_MANTENIMIENTO_DISTRITOS_RUTAS} />
      </div>
      <div className="w-full flex my-3">
        <div className="w-3/6 lg:w-9/12"></div>
        <button
          onClick={() => setOpenModal(true)}
          className="w-2/6 lg:w-2/12 bg-black text-white py-4"
        >
          Nuevo
        </button>
        <div className="w-1/6 lg:w-1/12 text-center content-center grid justify-items-center">
          <FilterComponent title={"Filtrar Vehiculos"}></FilterComponent>
        </div>
      </div>
      <ModalMessage
        open={openModal}
        setOpen={setOpenModal}
        title={distritoSelected ? "Editar Vehiculo" : "Nuevo Vehiculo"}
        titleBtnAceptar={"Guardar"}
        onBtnAceptar={() => <></>}
        showButtons={false}
      >
        <FormDistritoRutaComponent
          distritoSelected={distritoSelected}
          setDistritoSelected={setDistritoSelected}
          setOpenModal={setOpenModal}
        />
      </ModalMessage>

      <ModalMessage
        open={openModalDelete}
        setOpen={setOpenModalDelete}
        title={"Eliminar vehiculo"}
        titleBtnAceptar={"Eliminar"}
        onBtnAceptar={() => onDeleteDistrito()}
        showButtons={true}
        isMessage={true}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          ¿Estas seguro de eliminar?
        </div>
      </ModalMessage>

      <div>
        <TableCustom cols={MANTENIMIENTO_RUTAS_DISTRITOS_TABLE_COLS_DESKTOP}>
          {!loadingTable ? (
            rutaDistritos &&
            rutaDistritos.map((d) => (
              <tr key={d.id}>
                <td>{d.codigoRuta}</td>
                <td>{d.distrito}</td>
                <td className="space-x-2">
                  <EditIcon
                    className="text-gray-700 cursor-pointer"
                    onClick={() => handleSelectedDistrito(d)}
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
              <td
                colSpan={
                  MANTENIMIENTO_RUTAS_DISTRITOS_TABLE_COLS_DESKTOP.length
                }
              >
                <CircularProgress />
              </td>
            </tr>
          )}
        </TableCustom>
      </div>
    </div>
  );
};

export default MantenimientoDistritosRutasPage;
