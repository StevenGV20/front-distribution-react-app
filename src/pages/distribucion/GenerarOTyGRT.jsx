import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { FaTruck, FaTruckArrowRight } from "react-icons/fa6";
import ListIcon from "@mui/icons-material/List";

import BreadcrumbComponent from "../../components/widgets/BreadcrumbComponent";
import ListOrdenesDespachoComponent from "../../components/distribucion/ListOrdenesDespachoComponent";
import {
  API_DISTRIBUCION,
  API_MAESTRO,
  URL_MASTERLOGIC_API,
  USERNAME_LOCAL,
} from "../../utils/general";
import {
  GENERAR_OT_Y_GRT_PAGE,
  GGUIA_REMISION_REMITENTE_PAGE,
} from "../../utils/properties.text";
import {
  convertirDateTimeToDate,
  getFetchFunction,
  leftOnlyeArray,
  postFetchFunctionCustomFunction,
  putFetchFunction,
} from "../../utils/funciones";
import TableCustom from "../../components/widgets/TableComponent";
import DatePickerCustom from "../../components/widgets/DatePickerCustom";
import { ERRORS_TEXT } from "../../utils/properties.error.text";
import ModalMessage from "../../components/widgets/ModalComponent";
import CustomTablePagination from "../../components/widgets/TableComponent/TablePagination";
import { Checkbox, TableCell, TableRow } from "@mui/material";
import CheckBoxEstadosComponent from "../../components/widgets/CheckBoxEstadosComponent";
import LoaderAllComponent from "../../components/widgets/ModalComponent/LoaderAllComponent";
import { useDispatch } from "react-redux";
import { setMessage } from "../../redux/features/utils/utilsSlice";

import { objOrdenesDespachoEntity } from "../../api/ordenesDespachoApi";

import axios from "axios";

const GenerarOTyGRT = ({
  carritoOrdenesDespacho = objOrdenesDespachoEntity.result,
}) => {
  registerLocale("es", es);
  setDefaultLocale("es");
  const cols_desktop = [
    "Item",
    "Pedido",
    "Ord. Despacho",
    "Canal",
    "Cliente",
    "Carga",
    "GRUPO",
    "",
  ];

  const [loadingTableViajes, setLoadingTableViajes] = useState(true);
  const [refreshTable, setRefreshTable] = useState(false);

  const [loadingTableChoferes, setLoadingTableChoferes] = useState(true);

  const [viajes, setViajes] = useState({ result: [] });
  const [choferes, setChoferes] = useState({ result: [] });

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  useEffect(() => {
    const setDataVehiculosDisponibles = (data) => {
      //let arrayVehDis = data.result.filter((v) => v.cho_codcho != "");
      setViajes(data);

      const setDataChoferes = (lista) => {
        const listChoferes = leftOnlyeArray(
          lista.result,
          data.result,
          "cho_codcho"
        );
        setChoferes({ result: listChoferes });
      };

      getFetchFunction(
        `${API_MAESTRO}/choferes/lista`,
        setLoadingTableChoferes,
        setDataChoferes
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
    };

    getFetchFunction(
      `${API_DISTRIBUCION}/viaje/unidadesTransporteAsignadas?cia=01&fechaEntrega=${convertirDateTimeToDate(
        filterFechaEntrega
      )}&estados=2,3&estadosOT=`,
      setLoadingTableViajes,
      setDataVehiculosDisponibles
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
  }, [refreshTable]);

  const [filterFechaEntrega, setFilterFechaEntrega] = useState(new Date());
  const handleChangeFechaEntrega = (date) => {
    setFilterFechaEntrega(date);
    setRefreshTable((prev) => !prev);
  };
  const [openModal, setOpenModal] = useState(false);
  const [loaderComponent, setLoaderComponent] = useState(false);
  const [openModalOT, setOpenModalOT] = useState(false);
  const [openModalOTTEST, setOpenModalOTTEST] = useState(false);

  const [openModalAnularGuias, setOpenModalAnularGuias] = useState(false);
  const [openModalShowGuias, setOpenModalShowGuias] = useState(false);

  const onGenerarOTandGRT = () => {
    setLoaderComponent(true);
    
    var GuiasJSon = JSON.parse(localStorage.getItem("ordenesDespacho"))
      // Filtrar las órdenes que no tengan 'ruta_codd'
    console.log(GuiasJSon)
    var GuiasJsonFiltradas = GuiasJSon.filter(orden => orden.ruta_codd); 

    console.log(GuiasJsonFiltradas);
    const groupedData = GuiasJsonFiltradas.reduce((acc, viaje) => {
      const vehiculo = viaje.utr_plautr;
      const cliente = viaje.aux_nomaux;
      const ruta = viaje.ruta_codd;

      console.log(ruta);
      if (!acc[vehiculo]) {
        acc[vehiculo] = { vehiculo, ruta, GRT: {} };
      }

      if (!acc[vehiculo].GRT[cliente]) {
        acc[vehiculo].GRT[cliente] = [];
      }

      acc[vehiculo].GRT[cliente].push(viaje);

      return acc;
    }, {});

    console.log("groupedData", groupedData);
    // Convertir los objetos anidados a un array
    const result = Object.values(groupedData).map((group) => ({
      vehiculo: group.vehiculo,
      ruta: group.ruta,
      GRT: Object.keys(group.GRT).map((cliente) => ({
        cliente: cliente, // Incluye el nombre del cliente aquí
        od: group.GRT[cliente],
      })),
    }));

    console.log("GRT", result);

    console.log(viajes.result,"viaje");
    const values = viajes.result
      .filter((via) => via.via_otrcod === "")
      .map((via) => ({
        idviaje: via.idviaje,
        cia_codcia: via.cia_codcia,
        via_otrcod: via.via_otrcod,
        via_otrest: via.via_otrest,
        utr_marutr: via.utr_marutr,
        via_otrusu: USERNAME_LOCAL,
        via_nviaje: via.via_nviaje,
        via_desfch: via.via_desfch,
        via_retfch: via.via_retfch,
        rut_precio: via.rut_precio,
        sede:  via.sed_sedcod === 1 ? "ATE" : via.sed_sedcod === 5 ? "Lurin" : via.sed_sedcod === 3 ? "San Luis" : via.sed_descor,
        utr_plautr: via.utr_plautr,
        utr_tercero: via.utr_tercero,
        cho_nombre: via.cho_nombre,
        cho_nrolic: via.cho_nrolic,
        utr_prvrso: via.utr_prvrso,
        utr_prvruc: via.utr_prvruc,
        observacion: "REGISTRADO DESDE MASTERLOGIC - " + via.via_observ,
        //guiasGRT: result.filter((r) => r.vehiculo === via.utr_plautr)[0].GRT,
      }));

    console.log(values);

    if (values.length < 1) {
      setOpenModal(false);
      setOpenMessage({
        state: true,
        message: "No hay vehiculos para generar su OT",
        type: "error",
      });
      setLoaderComponent(false);
      return;
    }
    /* const newdata = viajes.result.map((via) => ({
      ...via,
      via_otrcod: "OT-000213",
    }));

    setViajes({ result: newdata });
    //console.log(newdata); */

    const updateTable = () => {
      setRefreshTable((prev) => !prev);
      setOpenModalOT(false);
      setLoaderComponent(false);
    };

    postFetchFunctionCustomFunction(
      `${API_DISTRIBUCION}/viaje/generaOTandGRT`,
      values,
      setOpenMessage,
      updateTable
    ).then((res) => {
      // if (GuiasJsonFiltradas.length !== GuiasJSon.length) {
      //   setOpenMessage({
      //     state: true,
      //     message: "Hay algunas Agrupaciones que no tienen Ruta asignada",
      //     type: "error",
      //   });
      // }
      setLoaderComponent(false);
    });
  };

  const estadosOT = () => {};

  const [choferSelected, setChoferSelected] = useState(null);
  const [viajeSelected, setViajeSelected] = useState(null);

  const onChangeChofer = () => {
    const values = {
      viaje: viajeSelected.idviaje,
      cia_codcia: viajeSelected.cia_codcia,
      username: USERNAME_LOCAL,
      chofer: choferSelected.cho_codcho,
    };

    const updateTable = (data) => {
      setOpenModal(false);
      setOpenMessage({
        state: true,
        message: data.mensaje,
        type: data.status.toLowerCase(),
      });
      setRefreshTable((prev) => !prev);
    };
    putFetchFunction(
      `${API_DISTRIBUCION}/viaje/cambiarChofer`,
      values,
      updateTable
    );
  };

  const rowTableComponent = (row) => (
    <TableRow
      key={row.cho_codcho}
      className={
        choferSelected && row.cho_codcho === choferSelected.cho_codcho
          ? "bg-gray-300"
          : "hover:bg-gray-300 hover:cursor-pointer"
      }
      onClick={() => setChoferSelected(row)}
    >
      <TableCell align="center">{row.cho_codcho}</TableCell>
      <TableCell>{row.cho_nombre}</TableCell>
    </TableRow>
  );

  const anularGuias = [
    {
      value: "1",
      name: GENERAR_OT_Y_GRT_PAGE.modalAnular.anularOTyGRT,
      color: "blue",
    },
    {
      value: "2",
      name: GENERAR_OT_Y_GRT_PAGE.modalAnular.anularTodo,
      color: "blue",
    },
  ];

  const [anularOptions, setAnularOptions] = useState("");

  const onAnularGuias = () => {
    let options = anularOptions.split(",");
    if (options[0] === "") options.splice(0, 1);
    if (options.length < 1) {
    } else {
      let option = 1;
      if (options.includes("1")) option = 1;
      if (options.includes("2")) option = 2;
      //alert(values);
      const values = {
        idviaje: viajeSelected.idviaje,
        cia_codcia: viajeSelected.cia_codcia,
        username: USERNAME_LOCAL,
        tipo: option.toString(),
        via_otrcod: viajeSelected.via_otrcod,
      };

      const updateTable = (data) => {
        setAnularOptions("");
        setLoaderComponent(false);
        setOpenModalAnularGuias(false);
        setRefreshTable((prev) => !prev);
        setOpenMessage({
          state: true,
          message: data.mensaje,
          type: data.status.toLowerCase(),
        });
      };

      setLoaderComponent(true);
      putFetchFunction(
        `${API_DISTRIBUCION}/viaje/anularGuias`,
        values,
        updateTable
      );
    }
  };

  const [ordenesDespacho, setOrdenesDespacho] = useState({ result: [] });
  const [showModalViajeDetail, setShowModalViajeDetail] = useState(false);
  const fetchDetalleViaje = (viaje) => {
    //alert("fetchDetalleViaje " + JSON.stringify(viajeSelected.idviaje));
    axios
      .get(
        `${URL_MASTERLOGIC_API}${API_DISTRIBUCION}/ordenDespacho/findByViaje?viaje=${viaje.idviaje}`
      )
      .then((res) => setOrdenesDespacho(res.data))
      .catch((err) =>
        setOpenMessage({
          state: true,
          message: ERRORS_TEXT.fetchError,
          type: ERRORS_TEXT.typeError,
        })
      );
  };

  return (
    <div className="page-container">
      <div className="page-container-header-page">
        <div className="page-container-header-page-title-content">
          <BreadcrumbComponent
            message={`${GENERAR_OT_Y_GRT_PAGE.titlePage} [${
              (viajes && viajes.result.length) || 0
            }]`}
          />
        </div>
        <div className="page-container-header-page-two-group">
          <div className="page-container-header-page-two-group-item">
            <label htmlFor="">
              {GENERAR_OT_Y_GRT_PAGE.filtroFechaSalidaLabel}
            </label>
            <DatePickerCustom
              selected={filterFechaEntrega}
              value={filterFechaEntrega}
              onChange={(date) => handleChangeFechaEntrega(date)}
              classname="input-filter-fecha"
            />
          </div>
          <div className="page-container-header-page-two-group-item">
            <button
              className="w-48 bg-black text-white py-2"
              onClick={() => setOpenModalOT(true)}
            >
              {GENERAR_OT_Y_GRT_PAGE.buttonGenerarOTandGRT}
            </button>
          </div>
          {/* <div className="page-container-header-page-two-group-item">
            <button
              className="w-48 bg-black text-white py-2"
              onClick={() => setOpenModalOTTEST(true)}
            >
              buttonGenerarTEST
            </button>
          </div> */}
        </div>
      </div>

      <LoaderAllComponent open={loaderComponent} setOpen={setLoaderComponent} />

      <TableCustom cols={GENERAR_OT_Y_GRT_PAGE.tableHeaders} mini={true}>
        {!loadingTableViajes &&
          viajes.result &&
          viajes.result.map(
            (viaje) =>
              viaje.utr_plautr && (
                <tr key={viaje.idviaje}>
                  <td>
                    <div className="flex space-x-2 justify-center">
                      <div>{viaje.utr_plautr}</div>
                    </div>
                  </td>
                  <td>
                    {viaje.utr_tercero === "N" ? (
                      <>
                        <FaTruck className="text-xl text-blue-700" />
                      </>
                    ) : (
                      <>
                        <FaTruckArrowRight className="text-xl text-red-700" />
                      </>
                    )}
                  </td>
                  <td>
                    <div className="">
                      <span>{viaje.cho_nombre}</span>{" "}
                      {viaje.via_otrcod === "" && (
                        <button
                          onClick={() => {
                            setViajeSelected(viaje);
                            setOpenModal(true);
                          }}
                        >
                          <EditIcon className="text-gray-600" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td>{viaje.cho_nrolic}</td>
                  <td className="text-center">{viaje.via_nroode}</td>
                  <td className="text-center">{viaje.via_nviaje}</td>
                  <td className="text-center">{viaje.via_volumen}</td>
                  <td className="text-center">{viaje.rut_codigo}</td>
                  <td className="text-center">{viaje.rut_precio}</td>
                  <td className="text-center">{viaje.via_otrcod}</td>
                  <td className="text-center">
                    {viaje.guias_grt && (
                      <button
                        onClick={() => {
                          setViajeSelected(viaje);
                          setOpenModalShowGuias(true);
                        }}
                      >
                        <ListIcon
                          className="text-blue-700"
                          sx={{ fontSize: "24px" }}
                        />
                      </button>
                    )}
                    {viaje.via_otrcod && viaje.via_otrest < 2 && (
                      <>
                        {" | "}
                        <button
                          className=""
                          onClick={() => {
                            setViajeSelected(viaje);
                            setOpenModalAnularGuias(true);
                          }}
                        >
                          <DeleteIcon className="text-red-500" />
                        </button>
                      </>
                    )}
                  </td>
                  <td>
                    <button
                      className=""
                      onClick={() => {
                        setViajeSelected(viaje);
                        fetchDetalleViaje(viaje);
                        setShowModalViajeDetail(true);
                      }}
                    >
                      <VisibilityIcon />
                    </button>
                  </td>
                </tr>
              )
          )}
      </TableCustom>

      <ModalMessage
        isMessage={true}
        open={openModalShowGuias}
        setOpen={setOpenModalShowGuias}
        title={GENERAR_OT_Y_GRT_PAGE.modalShowGuias.title}
        showButtons={false}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">{}</div>
        <div>
          {viajeSelected &&
            viajeSelected.guias_grt
              .split(",")
              .map((grt) => <div key={grt}>{grt}</div>)}
        </div>
      </ModalMessage>

      <ModalMessage
        open={showModalViajeDetail}
        setOpen={setShowModalViajeDetail}
        title={`${GENERAR_OT_Y_GRT_PAGE.modalDetailViaje.titleModal} - ${
          viajeSelected && viajeSelected.via_otrcod
        }`}
        showButtons={false}
      >
        {viajeSelected && (
          <div className="modal-children-content">
            <div className="grid grid-cols-2 xs:grid-cols-6 md:grid-cols-12">
              <div className="col-span-2">
                <div className="font-semibold">Placa:</div>
                <div>{viajeSelected.utr_plautr}</div>
              </div>
              <div className="col-span-2">
                <div className="font-semibold">N° Viaje:</div>
                <div>{viajeSelected.via_nviaje}</div>
              </div>
              <div className="col-span-2">
                <div className="font-semibold">Volumen:</div>
                <div>{viajeSelected.via_volumen}</div>
              </div>
              <div className="col-span-2">
                <div className="font-semibold">Peso:</div>
                <div>{viajeSelected.via_peso}</div>
              </div>
              <div className="col-span-4">
                <div className="font-semibold">Chofer:</div>
                <div>{viajeSelected.cho_nombre}</div>
              </div>
              <div className="col-span-2">
                <div className="font-semibold">Ruta: </div>
                <div>{viajeSelected.rut_codigo}</div>
              </div>
              <div className="col-span-2">
                <div className="font-semibold">Precio:</div>
                <div>{viajeSelected.rut_precio}</div>
              </div>
            </div>
            <h3 className="mt-6 font-semibold -mb-4 uppercase">
              {GENERAR_OT_Y_GRT_PAGE.modalDetailViaje.titleTableODs}
            </h3>
            <ListOrdenesDespachoComponent
              ordenesDespacho={ordenesDespacho.result}
              setOrdenesDespacho={setOrdenesDespacho}
              showButtonDelete={false}
              showPagination={false}
              /* carritoOrdenesDespacho={carritoOrdenesDespacho}
            setCarritoOrdenesDespacho={updateCarritoOrdenesDespacho} */
              titlePage={GGUIA_REMISION_REMITENTE_PAGE.titlePage}
              loadingTable={false}
              handleSelectRowToCart={(o) => {}}
              setRefreshTable={setRefreshTable}
            />
          </div>
        )}
      </ModalMessage>

      <ModalMessage
        open={openModal}
        setOpen={setOpenModal}
        title={
          GENERAR_OT_Y_GRT_PAGE.modalEditarChofer.titleModal +
          " - " +
          (viajeSelected && viajeSelected.utr_plautr)
        }
        titleBtnAceptar={GENERAR_OT_Y_GRT_PAGE.modalEditarChofer.btnAceptar}
        showButtons={true}
        onBtnAceptar={() => onChangeChofer()}
      >
        <CustomTablePagination
          columns={["ID", "CHOFER"]}
          rowTableComponent={rowTableComponent}
          rows={
            (choferes &&
              choferes.result.sort((a, b) =>
                a.cho_nombre.localeCompare(b.cho_nombre)
              )) ||
            []
          }
          colSpan={2}
          loadingTable={loadingTableChoferes}
        />
      </ModalMessage>

      <ModalMessage
        isMessage={true}
        open={openModalOT}
        setOpen={setOpenModalOT}
        title={GENERAR_OT_Y_GRT_PAGE.modalOT.title}
        onBtnAceptar={onGenerarOTandGRT}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          {GENERAR_OT_Y_GRT_PAGE.modalOT.msgConfirmacion}
        </div>
      </ModalMessage>

      {/* <ModalMessage
        isMessage={true}
        open={openModalOTTEST}
        setOpen={setOpenModalOTTEST}
        title={GENERAR_OT_Y_GRT_PAGE.modalOT.title}
        onBtnAceptar={onGenerarOTandGRTTEST}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          {GENERAR_OT_Y_GRT_PAGE.modalOT.msgConfirmacion}
        </div>
      </ModalMessage> */}

      <ModalMessage
        isMessage={true}
        open={openModalAnularGuias}
        setOpen={setOpenModalAnularGuias}
        title={GENERAR_OT_Y_GRT_PAGE.modalAnular.title}
        onBtnAceptar={() => onAnularGuias()}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          {GENERAR_OT_Y_GRT_PAGE.modalAnular.msgConfirmacion}
        </div>
        <CheckBoxEstadosComponent
          estados={anularGuias}
          filtroEstados={anularOptions}
          setFiltroEstados={setAnularOptions}
          className="lg:grid lg:grid-cols-2"
        />
      </ModalMessage>
    </div>
  );
};

export default GenerarOTyGRT;
