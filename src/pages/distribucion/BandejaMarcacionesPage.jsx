import React, { useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";

import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../../redux/features/combos/rolesDistribucionSlice";
import { setMessage } from "../../redux/features/utils/utilsSlice";

import { BANDEJA_MARCACIONES_PAGE } from "../../utils/properties.text";
import BreadcrumbComponent from "../../components/widgets/BreadcrumbComponent";
import DatePickerCustom from "../../components/widgets/DatePickerCustom";
import ModalMessage from "../../components/widgets/ModalComponent";
import TableCustom from "../../components/widgets/TableComponent";
import { API_DISTRIBUCION, USERNAME_LOCAL } from "../../utils/general";
import {
  convertirDateTimeToDate,
  convertirDateTimeToDateYYYYMMDD,
  convertirDateToTimeString,
  generarExcel,
  getFetchFunction,
  parameterExcel,
  postFetchFunction,
  postFetchFunctionCustomFunction,
} from "../../utils/funciones";
import { ERRORS_TEXT } from "../../utils/properties.error.text";
import LoaderAllComponent from "../../components/widgets/ModalComponent/LoaderAllComponent";
import FiltroBandejaMarcacionesComponent from "../../components/distribucion/FiltroBandejaMarcacionesComponent";
import ExportarExcelAPIComponent from "../../components/widgets/ExportarExcelComponent/exportacionByAPI";

const BandejaMarcacionesPage = () => {
  const [filterFechaMarcacion, setFilterFechaMarcacion] = useState(
    new Date().setDate(new Date().getDate() - 1)
  );
  const [openModalDescarga, setOpenModalDescarga] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [refreshTable, setRefreshTable] = useState(false);
  const [marcaciones, setMarcaciones] = useState({ result: [] });
  const [marcacionSelected, setMarcacionSelected] = useState(null);
  const [showMenuRol, setShowMenuRol] = useState(false);
  const [loaderComponent, setLoaderComponent] = useState(false);
  const [roles, setRoles] = useState({ result: [] });
  const [filtros, setFiltros] = useState(
    JSON.parse(sessionStorage.getItem("filtroMarcaciones")) || {
      texto: "",
      rol: "",
    }
  );

  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const dispatch = useDispatch();
  const rolesRedux = useSelector((state) => state.rolesDistribucionState.lista);

  const handleChangeFechaEntrega = (date) => {
    setFilterFechaMarcacion(date);
    setRefreshTable((prev) => !prev);
    setShowMenuRol(false);
    setMarcacionSelected(null);
  };

  const findMarcaciones = () => {
    setLoaderComponent(true);
    const fetchData = async () => {
      await getFetchFunction(
        `${API_DISTRIBUCION}/trabajadores/listaMarcaciones?cia=06&fecha=${convertirDateTimeToDateYYYYMMDD(
          filterFechaMarcacion
        )}&texto=${filtros.texto}&rol=${filtros.rol}`,
        setLoadingTable,
        setMarcaciones
      ).then((data) => {
        setLoaderComponent(false);
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
    fetchData();
  };

  const onFilter = () => {
    sessionStorage.setItem("filtroMarcaciones", JSON.stringify(filtros));
    findMarcaciones();
  };

  const onChangeRol = (obj, e) => {
    setLoaderComponent(true);
    const values = {
      cia_cod: obj.cia_cod,
      suc_cod: obj.suc_cod,
      tra_codigo: obj.tra_codigo,
      tra_nombre: obj.tra_nombre,
      tra_rol: e.target.value,
      tra_updusu: USERNAME_LOCAL,
      accion: "U",
    };
    //console.log(values);
    //postFunction

    postFetchFunction(
      `${API_DISTRIBUCION}/trabajadores/crud`,
      values,
      setOpenMessage
    ).then((data) => {
      setShowMenuRol(false);
      setRefreshTable((prev) => !prev);
    });

    setLoaderComponent(false);
  };

  const onDownloadMarcaciones = () => {
    setLoaderComponent(true);
    const fetchData = async () => {
      try {
        await postFetchFunction(
          `${API_DISTRIBUCION}/trabajadores/downloadMarcaciones?cia=06&fecha=${convertirDateTimeToDateYYYYMMDD(
            filterFechaMarcacion
          )}&username=${USERNAME_LOCAL}`,
          setLoadingTable,
          setOpenMessage
        ).then((data) => {
          setLoaderComponent(false);
          setOpenModalDescarga(false);
          setRefreshTable((prev) => !prev);
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
    fetchData();
  };

  useEffect(() => {
    findMarcaciones();
  }, [refreshTable]);

  /* useEffect(() => {
    findRoles();
  }, []); */

  useEffect(() => {
    if (!(rolesRedux.length > 0)) {
      dispatch(fetchRoles());
    }

    setRoles(rolesRedux);
  }, [rolesRedux]);
  return (
    <div className="page-container">
      <div className="page-container-header-page">
        <div className="page-container-header-page-title-content">
          <BreadcrumbComponent
            message={`${BANDEJA_MARCACIONES_PAGE.title} [${
              marcaciones && marcaciones && marcaciones.length
            }]`}
          />
        </div>
        <div className="page-container-header-page-two-group">
          <div className="page-container-header-page-two-group-item">
            <label htmlFor="">
              {BANDEJA_MARCACIONES_PAGE.filtroFechaLabel}
            </label>
            <DatePickerCustom
              selected={filterFechaMarcacion}
              value={filterFechaMarcacion}
              onChange={(date) => handleChangeFechaEntrega(date)}
              classname="input-filter-fecha"
              maxDate={new Date()}
            />
          </div>
          <div className="page-container-header-page-two-group-item">
            <button
              onClick={() => setOpenModalDescarga(true)}
              className="btn-base-black"
            >
              {BANDEJA_MARCACIONES_PAGE.btnDownloadMarcaciones}
            </button>
            <div className="page-container-header-page-three-group-item">
              <ExportarExcelAPIComponent
                data={marcaciones}
                headers={BANDEJA_MARCACIONES_PAGE.headersExportExcel}
                filename={
                  `Marcaciones_` +
                  convertirDateTimeToDateYYYYMMDD(filterFechaMarcacion)
                }
              />
              <FiltroBandejaMarcacionesComponent
                onSearch={() => onFilter()}
                filtros={filtros}
                setFiltros={setFiltros}
              />
            </div>
          </div>
        </div>
      </div>
      <LoaderAllComponent open={loaderComponent} setOpen={setLoaderComponent} />
      <ModalMessage
        open={openModalDescarga}
        setOpen={setOpenModalDescarga}
        title={BANDEJA_MARCACIONES_PAGE.modalDescarga.titleModalDescarga}
        onBtnAceptar={() => onDownloadMarcaciones()}
        showButtons={true}
        isMessage={true}
        titelBtnCancelar="NO"
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          {BANDEJA_MARCACIONES_PAGE.modalDescarga.msgConfirmacion}
        </div>
      </ModalMessage>

      <TableCustom
        cols={BANDEJA_MARCACIONES_PAGE.tableMarcacionesHeaders}
        maxHeight={80}
      >
        {!loadingTable && marcaciones && marcaciones.length > 0 ? (
          marcaciones.map((m, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{m.tra_nombre}</td>
              <td>{m.tra_codigo}</td>
              <td>
                {showMenuRol &&
                m.tra_codigo === marcacionSelected.tra_codigo ? (
                  <select
                    onChange={(e) => onChangeRol(m, e)}
                    className="py-1 px-1 w-24 border-1 border-blue-600"
                  >
                    <option value="">[Seleccione]</option>
                    {roles &&
                      roles.map((r) => (
                        <option value={r.id} key={r.id}>
                          {r.rol_nombre}
                        </option>
                      ))}
                  </select>
                ) : (
                  <>
                    <div className="w-32 px-1">
                      <span className="text-xs">
                        {m.rol_nombre || BANDEJA_MARCACIONES_PAGE.rolDefault}
                      </span>{" "}
                      <EditIcon
                        sx={{ fontSize: "20px" }}
                        className="text-gray-600 cursor-pointer"
                        onClick={() => {
                          setMarcacionSelected(m);
                          setShowMenuRol(true);
                        }}
                      />
                    </div>
                  </>
                )}
              </td>
              <td>{m.mar_hor_inicio}</td>
              <td>{convertirDateToTimeString(m.mar_hor_ingreso)}</td>
              <td>{convertirDateToTimeString(m.mar_hor_salida)}</td>
              <td>{m.mar_hor_comida === "S" ? "SÍ" : "NO"}</td>
              <td>{m.mar_hor_laborado}</td>
              <td colSpan={2}>
                <div className="text-left">
                  <div>{m.mar_migusu}</div>
                  <div>
                    {convertirDateTimeToDate(m.mar_migfch)}{" "}
                    {convertirDateToTimeString(m.mar_migfch)}
                  </div>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={BANDEJA_MARCACIONES_PAGE.tableMarcacionesHeaders.length}>
              {ERRORS_TEXT.emptyDataTable}
            </td>
          </tr>
        )}
      </TableCustom>
    </div>
  );
};

export default BandejaMarcacionesPage;
