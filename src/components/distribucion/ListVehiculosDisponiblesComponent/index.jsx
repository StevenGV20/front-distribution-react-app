import React, { useEffect, useState } from "react";
import { Checkbox, TableCell, TableRow } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

import TableCustom from "../../widgets/TableComponent";
import { API_DISTRIBUCION, USERNAME_LOCAL } from "../../../utils/general";
import TableCollapseMUICustomComponent from "../../widgets/TableComponent/TableCollapseMUICustomComponent";
import TableMUICustomComponent from "../../widgets/TableComponent/TableMUICustomComponent";
import {
  getFetchFunction,
  postFetchFunctionCustomFunction,
} from "../../../utils/funciones";
import ModalMessage from "../../widgets/ModalComponent";
import FormAsignarVehiculoComponent from "../FormAsignarVehiculoComponent";
import { LockClosedIcon } from "@heroicons/react/16/solid";
import {
  FORM_ASIGNAR_VEHICULO,
  VEHICULOS_DISPONIBLES_COMPONENT_TEXT,
} from "../../../utils/properties.text";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/features/utils/utilsSlice";

const ListVehiculosDisponiblesComponent = ({
  setRefreshTable,
  vehiculosDisponibles,
  setVehiculosDisponibles,
  loadingTableVehiculos,
  setFiltroEstadosVehDis,
  filtroEstadosVehDis,
  setfilterIdViaje,
  fetchGrupos,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalAbrir, setOpenModalAbrir] = useState(false);
  const onAsignarVehiculo = () => {
    setOpenModal(false);
  };

  const [viajeSelected, setViajeSelected] = useState(null);
  const [modalConfirmarVehiculo, setModalConfirmarVehiculo] = useState(false);

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const handleAsignVehiculo = (viaje, isMaxVolumen) => {
    setViajeSelected(viaje);
    if (isMaxVolumen) {
      setModalConfirmarVehiculo(true);
    } else {
      if (viaje.via_estado === "1") setOpenModal(true);
      else if (viaje.via_estado === "2") setOpenModalAbrir(true);
    }
  };

  const onOpenVehiculo = () => {
    const values = {
      idviaje: viajeSelected.idviaje,
      cia_codcia: viajeSelected.cia_codcia,
      via_updusu: USERNAME_LOCAL,
    };

    const updateTable = () => {
      setRefreshTable((prev) => !prev);
    };
    postFetchFunctionCustomFunction(
      `${API_DISTRIBUCION}/viaje/abrirVehiculo`,
      values,
      setOpenMessage,
      updateTable
    );
    setOpenModalAbrir(false);
  };

  const changeFiltroEstado = (e) => {
    let value = e.target.value;
    let isChecked = e.target.checked;
    let estados = filtroEstadosVehDis.toString().split(",");

    if (isChecked) {
      setFiltroEstadosVehDis(filtroEstadosVehDis + "," + value);
    } else {
      let values = estados.filter((e) => e != value);
      setFiltroEstadosVehDis(values.toString());
    }

    setRefreshTable((prev) => !prev);
  };

  const [showViaje, setShowViaje] = useState(false);

  const showGruposViaje = (viaje) => {
    setViajeSelected(viaje);
    if (viaje.idviaje > 0) {
      if (viajeSelected && viajeSelected.idviaje === viaje.idviaje)
        setShowViaje(false);
      else setShowViaje(true);
      fetchGrupos(1, 10, "", viaje.idviaje);
    } else {
      setRefreshTable((prev) => !prev);
    }
    /*  if (viajeSelected.idviaje === viaje.idviaje) setShowViaje(false);
    else setShowViaje(true);
    setViajeSelected(viaje);
    setfilterIdViaje(showViaje ? viaje.idviaje : 0);
    fetchGrupos(1, 10, "", viaje.idviaje);
    if (showViaje) setRefreshTable((prev) => !prev); */
  };

  const handleModalConfirmarVehiculo = (vehiculo) => {
    setViajeSelected(vehiculo);
    setModalConfirmarVehiculo(true);
  };

  return (
    <div
      className="w-full bg-gray-50 border-2 border-gray-400 p-4 mt-0"
      style={{ height: "80vh" }}
    >
      <h2 className="font-bold text-xl">
        {VEHICULOS_DISPONIBLES_COMPONENT_TEXT.title}
      </h2>
      <div className="mt-3 lg:flex">
        <div className="col-span-1 flex items-center">
          <Checkbox
            inputProps={{ "aria-label": "Checkbox demo" }}
            defaultChecked
            sx={{
              color: "#4098B4",
              "&.Mui-checked": {
                color: "#4098B4",
              },
            }}
            value={VEHICULOS_DISPONIBLES_COMPONENT_TEXT.estado_1.value}
            onChange={(e) => changeFiltroEstado(e)}
          />
          <label
            htmlFor="Checkbox demo"
            className="font-medium text-gray-900 text-sm leading-6"
          >
            {VEHICULOS_DISPONIBLES_COMPONENT_TEXT.estado_1.text}
          </label>
        </div>
        <div className="col-span-1 flex items-center">
          <Checkbox
            inputProps={{ "aria-label": "Checkbox demo" }}
            sx={{
              color: "#FF813A",
              "&.Mui-checked": {
                color: "#FF813A",
              },
            }}
            value={VEHICULOS_DISPONIBLES_COMPONENT_TEXT.estado_2.value}
            onChange={(e) => changeFiltroEstado(e)}
          />
          <label
            htmlFor="Checkbox demo"
            className="font-medium text-gray-900 text-sm leading-6"
          >
            {VEHICULOS_DISPONIBLES_COMPONENT_TEXT.estado_2.text}
          </label>
        </div>
        <div className="col-span-1 flex items-center">
          <Checkbox
            inputProps={{ "aria-label": "Checkbox demo" }}
            sx={{
              color: "#00D021",
              "&.Mui-checked": {
                color: "#00D021",
              },
            }}
            value={VEHICULOS_DISPONIBLES_COMPONENT_TEXT.estado_3.value}
            onChange={(e) => changeFiltroEstado(e)}
          />
          <label
            htmlFor="Checkbox demo"
            className="font-medium text-gray-900 text-sm leading-6"
          >
            {VEHICULOS_DISPONIBLES_COMPONENT_TEXT.estado_3.text}
          </label>
        </div>
      </div>
      <div className="desktop text-black overflow-x-auto p-0">
        <TableCustom
          cols={VEHICULOS_DISPONIBLES_COMPONENT_TEXT.table_titles}
          mini={true}
          maxHeight={60}
        >
          {!loadingTableVehiculos &&
            vehiculosDisponibles.result &&
            vehiculosDisponibles.result.map((vehiculo) => {
              const totalVolumenAsignado = 0;
              //["GRUPO", "SEDE", "VOLUMEN TOTAL", "MONTO TOTAL"]
              return (
                vehiculo.utr_plautr && (
                  <tr key={vehiculo.idviaje}>
                    <td>
                      <div className="px-1">
                        <i class="fa-solid fa-truck mr-2"></i>{" "}
                        {vehiculo.utr_plautr}
                      </div>
                      <div>{vehiculo.cho_nombre}</div>
                    </td>
                    <td className="text-center">{vehiculo.via_nroode}</td>
                    <td className="text-center">{vehiculo.via_nviaje}</td>
                    <td className="text-center">{vehiculo.via_volumen}</td>
                    <td className="text-center">
                      <span
                        className={
                          vehiculo.utr_carvol - vehiculo.via_volumen < 0 &&
                          "text-2xl font-bold text-red-500"
                        }
                      >
                        {vehiculo.utr_carvol - vehiculo.via_volumen}
                      </span>
                    </td>
                    <td className="text-center">{vehiculo.rut_codigo}</td>
                    <td className="text-center">{vehiculo.rut_precio}</td>
                    <td className="text-center">
                      {showViaje &&
                      vehiculo.idviaje === viajeSelected.idviaje ? (
                        <button onClick={() => showGruposViaje({ idviaje: 0 })}>
                          <VisibilityIcon className="text-blue-700" />
                        </button>
                      ) : (
                        <button onClick={() => showGruposViaje(vehiculo)}>
                          <VisibilityOffIcon className="text-blue-700" />
                        </button>
                      )}
                    </td>
                    <td className="text-center pr-2">
                      {vehiculo.via_estado === "1" ? (
                        <button
                          onClick={() =>
                            handleAsignVehiculo(
                              vehiculo,
                              vehiculo.utr_carvol - vehiculo.via_volumen < 0
                            )
                          }
                        >
                          <LockOpenIcon className="text-yellow-600 z-10" />
                        </button>
                      ) : vehiculo.via_estado === "2" ? (
                        <button
                          className="w-6"
                          onClick={() => handleAsignVehiculo(vehiculo, false)}
                        >
                          <LockClosedIcon className="text-yellow-600 z-10" />
                        </button>
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>
                )
              );
            })}
        </TableCustom>
      </div>

      <ModalMessage
        open={modalConfirmarVehiculo}
        setOpen={setModalConfirmarVehiculo}
        title={VEHICULOS_DISPONIBLES_COMPONENT_TEXT.modalConfirmarVehiculoTitle}
        titleBtnAceptar={"Aceptar"}
        onBtnAceptar={() => handleAsignVehiculo(viajeSelected, false)}
        isMessage={true}
        showButtons={true}
      >
        <div className="text-center">
          {
            VEHICULOS_DISPONIBLES_COMPONENT_TEXT.modalConfirmarVehiculoDescription
          }
        </div>
      </ModalMessage>

      <ModalMessage
        open={openModal}
        setOpen={setOpenModal}
        title={FORM_ASIGNAR_VEHICULO.titleModal(
          (viajeSelected && viajeSelected.utr_plautr) || ""
        )}
        titleBtnAceptar={"Asignar"}
        onBtnAceptar={onAsignarVehiculo}
        showButtons={false}
      >
        <FormAsignarVehiculoComponent
          viaje={viajeSelected}
          setOpenModal={setOpenModal}
          setRefreshTable={setRefreshTable}
        />
      </ModalMessage>

      <ModalMessage
        open={openModalAbrir}
        setOpen={setOpenModalAbrir}
        title={"Abrir Vehiculo"}
        titleBtnAceptar={"Si"}
        titelBtnCancelar="No"
        onBtnAceptar={() => onOpenVehiculo()}
        isMessage={true}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          ¿Estas seguro de Abrir nuevamente este vehículo?
        </div>
      </ModalMessage>
    </div>
  );
};

export default ListVehiculosDisponiblesComponent;
