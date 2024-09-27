import React, { useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";

import BreadcrumbComponent from "../../components/widgets/BreadcrumbComponent";
import ListOrdenesDespachoComponent from "../../components/distribucion/ListOrdenesDespachoComponent";
import PaginationCustom from "../../components/widgets/PaginationComponent/PaginationCustom";
import { API_DISTRIBUCION, USERNAME_LOCAL } from "../../utils/general";
import { objOrdenesDespachoEntity } from "../../api/ordenesDespachoApi";
import {
  getFetchFunction,
  convertirDateTimeToDate,
  postFetchFunctionCustomFunction,
} from "../../utils/funciones";
import { GGUIA_REMISION_REMITENTE_PAGE } from "../../utils/properties.text";
import ModalMessage from "../../components/widgets/ModalComponent";
import DatePickerCustom from "../../components/widgets/DatePickerCustom";
import LoaderAllComponent from "../../components/widgets/ModalComponent/LoaderAllComponent";
import {
  ERRORS_TEXT,
  GGUIA_REMISION_REMITENTE_PAGE_ERROR_TEXT,
} from "../../utils/properties.error.text";
import { setMessage } from "../../redux/features/utils/utilsSlice";
import { useDispatch } from "react-redux";

const GenerarGRR = () => {
  const [openModal, setOpenModal] = useState(false);

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  registerLocale("es", es);
  setDefaultLocale("es");

  const [refreshTable, setRefreshTable] = useState(true);
  const [loaderComponent, setLoaderComponent] = useState(false);

  const [ordenesDespacho, setOrdenesDespacho] = useState(
    objOrdenesDespachoEntity
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [loadingTable, setLoadingTable] = useState(true);

  const [filterFechaEntrega, setFilterFechaEntrega] = useState(new Date());
  const handleChangeFechaEntrega = (date) => {
    setFilterFechaEntrega(date);
    setRefreshTable((prev) => !prev);
  };

  useEffect(() => {
    findOrdenesDespacho(1, 50);
  }, [refreshTable]);

  const itemsPerPage = 100; // Número de ítems por página

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrdenes = ordenesDespacho.result.slice(indexOfFirstItem, indexOfLastItem);

  const findOrdenesDespacho = (page, limit, fromFilter = true) => {
    const fetchOrdenesDespacho = async () => {
      try {
        await getFetchFunction(
          `${API_DISTRIBUCION}/ordenDespacho/listaToGRR?page=${page}&limit=${limit}&cia=01&dateDespacho=${convertirDateTimeToDate(
            filterFechaEntrega
          )}`,
          setLoadingTable,
          setOrdenesDespacho
        ).then((data) => {
          if (typeof data !== 'undefined' && data.toString().includes("Failed to fetch")) {
            setOpenMessage({
              state: true,
              message: ERRORS_TEXT.fetchError,
              type: "error",
            });
          }
          console.log(ordenesDespacho.result);
          localStorage.setItem("ordenesDespacho", JSON.stringify(ordenesDespacho.result));
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrdenesDespacho();
  };

  useEffect(() => { }, [ordenesDespacho]);

  const handleSelectRow = async (orden) => {
    ////console.log(orden);
  };

  const onImportarGRR = (type) => {
    setLoaderComponent(true);
    let values = [];
    if (type === 1) {
      values = ordenesDespacho.result;
    } else {
      values = ordenesDespacho.result
        .filter((od) => od.grc_numdoc == "")
        .map((od) => ({
          cia_codcia: od.cia_codcia,
          odc_numodc: od.odc_numodc,
          grc_tipdoc: od.grc_tipdoc,
          grc_numdoc: od.grc_numdoc,
          odc_regusu: USERNAME_LOCAL,
        }));
    }

    ////console.log(values);

    if (values.length < 1) {
      setOpenMessage({
        state: true,
        message: GGUIA_REMISION_REMITENTE_PAGE_ERROR_TEXT.zeroOrdenesToImport,
        type: ERRORS_TEXT.typeError,
      });
      setOpenModal(false);
      setLoaderComponent(false);
      return;
    }

    const updateTable = () => {
      setRefreshTable((prev) => !prev);
      setOpenModal(false);
      setLoaderComponent(false);
    };

    postFetchFunctionCustomFunction(
      `${API_DISTRIBUCION}/ordenDespacho/importarGuiasRemision`,
      values,
      setOpenMessage,
      updateTable
    );
    findOrdenesDespacho(1, 50);

  };

  const totalPages = Math.ceil(ordenesDespacho.result.length / itemsPerPage);


  return (
    <div className="page-container">
      <div className="page-container-header-page">
        <div className="page-container-header-page-title-content">
          <BreadcrumbComponent
            message={`${GGUIA_REMISION_REMITENTE_PAGE.titlePage} [${(ordenesDespacho.totalRows &&
                ordenesDespacho.totalRows.totalrows) ||
              0
              }]`}
          />
        </div>
        <div className="page-container-header-page-two-group">
          <div className="page-container-header-page-two-group-item">
            <label htmlFor="">
              {GGUIA_REMISION_REMITENTE_PAGE.filtroFechaSalidaLabel}
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
              onClick={() => setOpenModal(true)}
              className="btn-base-black"
            >
              {GGUIA_REMISION_REMITENTE_PAGE.btnImportarGRR}
            </button>
          </div>
        </div>
      </div>
      <LoaderAllComponent open={loaderComponent} setOpen={setLoaderComponent} />

      <ModalMessage
        open={openModal}
        setOpen={setOpenModal}
        title={GGUIA_REMISION_REMITENTE_PAGE.titleModalImportarGRR}
        onBtnAceptar={() => setOpenModal(false)}
        showButtons={false}
        isMessage={true}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          {GGUIA_REMISION_REMITENTE_PAGE.msgConfirmacionImportar}
        </div>
        <div className="bg-gray-50 px-4 mt-2 mb-3 space-y-2 sm:space-y-0 sm:flex sm:px-6 sm:space-x-2 md:columns-3">
          <button
            type="button"
            className="flex w-full col-span-1 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 items-center"
            onClick={() => setOpenModal(false)}
          >
            No
          </button>
          <button
            type="button"
            className="form-buttons-btn text-white bg-red-500"
            onClick={() => onImportarGRR(1)}
          >
            Forzar Todos
          </button>
          <button
            type="button"
            className="form-buttons-btn form-buttons-btn-red"
            onClick={() => onImportarGRR(0)}
          >
            Si
          </button>
        </div>
      </ModalMessage>

      {/* <PaginationCustom
        totalRows={
          ordenesDespacho.totalRows && ordenesDespacho.totalRows.totalrows
        }
        fetchData={findOrdenesDespacho}
        refreshTable={refreshTable}
        showLimit={true}
      > */}
      <div>
        <ListOrdenesDespachoComponent
          ordenesDespacho={currentOrdenes}
          setOrdenesDespacho={setOrdenesDespacho}
          showButtonDelete={true}
          showPagination={false}
          /* carritoOrdenesDespacho={carritoOrdenesDespacho}
          setCarritoOrdenesDespacho={updateCarritoOrdenesDespacho} */
          titlePage={GGUIA_REMISION_REMITENTE_PAGE.titlePage}
          loadingTable={loadingTable}
          handleSelectRowToCart={handleSelectRow}
          findOrdenesDespacho={findOrdenesDespacho}
          setRefreshTable={setRefreshTable}
        />
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={index + 1 === currentPage ? "active" : ""}
              disabled={index + 1 === currentPage}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {/* </PaginationCustom> */}
    </div>
  );
};

export default GenerarGRR;
