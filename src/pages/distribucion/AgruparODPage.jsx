import React, { useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";

import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

import BreadcrumbComponent from "../../components/widgets/BreadcrumbComponent";
import ModalMessage from "../../components/widgets/ModalComponent";
import SlideOverComponent from "../../components/widgets/SlideOverComponent";
import LoaderAllComponent from "../../components/widgets/ModalComponent/LoaderAllComponent";
import PaginationCustom from "../../components/widgets/PaginationComponent/PaginationCustom";
//import Pagination from "../components/PaginationComponent";
import ListOrdenesDespachoComponent from "../../components/distribucion/ListOrdenesDespachoComponent";
import FormCarritoAgrupacionODComponent from "../../components/distribucion/FormCarritoAgrupacionODComponent";
import FiltroOrdenesDespachoComponent from "../../components/distribucion/FiltroOrdenesDespachoComponent";
import FormFiltroODFromOsis from "../../components/distribucion/FormFIltroODFromOsis";
import { PAGE_AGRUPAR_OD } from "../../utils/titles";
import { API_DISTRIBUCION } from "../../utils/general";
import {
  convertirDateTimeToDate,
  getFetchFunction,
  getPesoOD,
  postFetchFunction,
  putFetchFunction,
  enviarOrdenesSeleccionadas,
} from "../../utils/funciones";
import { objOrdenesDespachoEntity } from "../../api/ordenesDespachoApi";
import { CARRITO_ORDENES_DESPACHO } from "../../utils/properties.text";
import { ERRORS_TEXT } from "../../utils/properties.error.text";
import { setMessage } from "../../redux/features/utils/utilsSlice";
import { useDispatch } from "react-redux";

const AgruparODPage = () => {
  const [openModal, setOpenModal] = useState(false);

  const [refreshTable, setRefreshTable] = useState(true);

  const [ordenesDespacho, setOrdenesDespacho] = useState({ result: [] });
  const [loadingTable, setLoadingTable] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; // Número de ítems por página

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrdenes = ordenesDespacho.result
    ? ordenesDespacho.result.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const userLocal = localStorage.getItem("USERNAME");

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  const [filtrosOrdenesDespacho, setFiltrosOrdenesDespacho] = useState(
    JSON.parse(sessionStorage.getItem("filtrosOrdenesDespacho")) || {
      fechaInicio: new Date(),
      fechaFinal: new Date(),
      filtro1: "",
      filtro2: "",
      filtro3: "",
      orderBy: "volumen",
      estados: "",
      btnFechaSelected: "btnFechaToday",
      canales: "",
      tiendas: "",
      clientes: "",
    }
  );

  useEffect(() => {
    findOrdenesDespacho(1, 10);
  }, [refreshTable]);

  // const findOrdenesDespacho = (page, limit, fromFilter = true) => {
  //   setOpenLoader(true);
  //   const fetchOrdenesDespacho = async () => {
  //     try {
  //       const pesosData = await getPesoOD()
  //       .then((data) => {
  //         console.log(data);
  //       })
  //       const ordenesData = await getFetchFunction(
  //         `${API_DISTRIBUCION}/ordenDespacho/filtros?page=${page}&limit=${limit}&cia=01&dateStart=${convertirDateTimeToDate(
  //           filtrosOrdenesDespacho.fechaInicio
  //         )}&dateEnd=${convertirDateTimeToDate(
  //           filtrosOrdenesDespacho.fechaFinal
  //         )}&orderBy=${filtrosOrdenesDespacho.orderBy}&estados=${
  //           filtrosOrdenesDespacho.estados
  //         }&texto=${filtrosOrdenesDespacho.filtro1}&canales=${
  //           filtrosOrdenesDespacho.canales
  //         }`,
  //         setLoadingTable,
  //         setOrdenesDespacho
  //       ).then((data) => {
  //         setOpenLoader(false);
  //         if (
  //           typeof data !== "undefined" &&
  //           data.toString().includes("Failed to fetch")
  //         ) {
  //           setOpenMessage({
  //             state: true,
  //             message: ERRORS_TEXT.fetchError,
  //             type: ERRORS_TEXT.typeError,
  //           });
  //         }
  //       });
  //     } catch (error) {
  //       setOpenMessage({
  //         state: true,
  //         message: error,
  //         type: ERRORS_TEXT.typeError,
  //       });
  //     }
  //   };
  //   fetchOrdenesDespacho();
  // };

  const findOrdenesDespacho = (page, limit, fromFilter = true) => {
    setCurrentPage(1); // Aquí restableces la página actual a 1
    setOpenLoader(true);
    const fetchOrdenesDespacho = async () => {
      try {
        // const pesosData = await getPesoOD();

        const ordenesData = await getFetchFunction(
          `${API_DISTRIBUCION}/ordenDespacho/filtros?page=${page}&limit=${limit}&cia=01&dateStart=${convertirDateTimeToDate(
            filtrosOrdenesDespacho.fechaInicio
          )}&dateEnd=${convertirDateTimeToDate(
            filtrosOrdenesDespacho.fechaFinal
          )}&orderBy=${filtrosOrdenesDespacho.orderBy}&estados=${
            filtrosOrdenesDespacho.estados
          }&texto=${filtrosOrdenesDespacho.filtro1}&canales=${
            filtrosOrdenesDespacho.canales
          }&tiendas=${filtrosOrdenesDespacho.tiendas}`,
          setLoadingTable,
          setOrdenesDespacho
        );

        // Asegurarse de que ordenesData es un array
        // var resultORden = ordenesData.result;
        // var resultPeso = pesosData.result;

        // Combina los datos
        // ordenesData.result.forEach((orden) => {
        //   let pesoEncontrado = resultPeso.find(peso => peso.odc_numodc === orden.odc_numodc);
        //   orden.peso = pesoEncontrado ? pesoEncontrado.pesototal : null; // Agrega el campo 'peso'
        //   orden.odc_peso = pesoEncontrado ? pesoEncontrado.pesototal : null; // Agrega el campo 'odc_eso'
        // });

        console.log(ordenesData.result);
        setOrdenesDespacho(ordenesData);
        setOpenLoader(false);
      } catch (error) {
        setOpenLoader(false);
        setOpenMessage({
          state: true,
          message: error.message || ERRORS_TEXT.fetchError,
          type: ERRORS_TEXT.typeError,
        });
      }
    };
    fetchOrdenesDespacho();
  };

  const [carritoOrdenesDespacho, setCarritoOrdenesDespacho] = useState([]);

  const [openCarritoGrupos, setOpenCarritoGrupos] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);

  const updateCarritoOrdenesDespacho = (data) => {
    localStorage.setItem("ODSAGRUPAR", JSON.stringify(data));
    setCarritoOrdenesDespacho(data);
  };

  useEffect(() => {
    if (ordenesDespacho.result && ordenesDespacho.result.length > 0) {
      let localODGroup = JSON.parse(localStorage.getItem("ODSAGRUPAR")) || [];
      let listODs = [...localODGroup];

      ordenesDespacho.result.map((o) => {
        if (o.odc_estado === "2" && o.odc_selusu === userLocal) {
          let isOd = listODs.find((od) => od.id === o.id);
          if (!isOd) listODs.push(o);
        }
      });

      updateCarritoOrdenesDespacho(listODs);
      localStorage.setItem("ODSAGRUPAR", JSON.stringify(listODs));
    }
  }, [ordenesDespacho]);

  const handleSelectRow = async (orden) => {
    setOpenLoader(true);
    const selectItemCarritoOD = (data) => {
      console.log(data);
      if (data.statusCode === 200) {
        const data_orden_selected = JSON.parse(data.mensaje);

        orden.odc_estado = data_orden_selected.odc_estado;
        orden.odc_selusu = data_orden_selected.odc_selusu;

        if (data_orden_selected.odc_estado === "2") {
          console.log("entroooo");
          updateCarritoOrdenesDespacho([...carritoOrdenesDespacho, orden]);
        } else {
          console.log("entreeee");
          const newLista = carritoOrdenesDespacho.filter(
            (o) => o.id !== orden.id
          );
          console.log(newLista);
          updateCarritoOrdenesDespacho(newLista);
          findOrdenesDespacho(1, 10);
        }
      } else {
        setOpenMessage({
          state: true,
          message: data.mensaje,
          type: data.status.toLowerCase(),
        });
      }
      setOpenLoader(false);
    };

    putFetchFunction(
      `${API_DISTRIBUCION}/ordenDespacho/selectToGroup?id=${orden.id}&usuario=${userLocal}`,
      {},
      selectItemCarritoOD
    );
  };

  const isLoadCarga = (orden) => {
    return (
      orden.odc_bultos > 0 && orden.odc_volumen > 0 && orden.odc_imptot > 0
    );
  };

  const desargruparTodasLasOrdenes = async () => {
    const filteredOrders = ordenesDespacho.result.filter(
      (o) => o.odc_estado === "2"
    );

    const orderIds = filteredOrders.map((order) => order.id);
    console.log(filteredOrders);
    localStorage.removeItem("ODSAGRUPAR");

    setCarritoOrdenesDespacho(filteredOrders);

    await enviarOrdenesSeleccionadas(orderIds);

    findOrdenesDespacho(1, 10);
  };
  // && isLoadCarga(o)
  const agruparTodasLasOrdenes = async () => {
    console.log(ordenesDespacho.result);
    const filteredOrders = ordenesDespacho.result.filter(
      (o) => o.odc_estado === "1"
    );

    // Extraer los IDs de las órdenes filtradas
    const orderIds = filteredOrders.map((order) => order.id);

    // Guardar en el localStorage si es necesario
    localStorage.setItem("ODSAGRUPAR", JSON.stringify(filteredOrders));

    // Actualizar el carrito de órdenes
    setCarritoOrdenesDespacho(filteredOrders);

    // Enviar la lista de IDs al servicio
    const re = await enviarOrdenesSeleccionadas(orderIds);

    findOrdenesDespacho(1, 10);
  };

  const totalPages = ordenesDespacho.result
    ? Math.ceil(ordenesDespacho.result.length / itemsPerPage)
    : 0;

  return (
    <div className="page-container">
      <div className="page-container-header-page ">
        <div className="page-container-header-page-title-content">
          <BreadcrumbComponent
            message={`${PAGE_AGRUPAR_OD} [${
              (ordenesDespacho.result && ordenesDespacho.result.length) || 0
            }]`}
          />
        </div>
        <div className="page-container-header-page-two-group">
          <button
            onClick={desargruparTodasLasOrdenes}
            className="btn-base-black"
          >
            Desagrupar Todas
          </button>
          <button onClick={agruparTodasLasOrdenes} className="btn-base-black">
            Agrupar Todas
          </button>
          <button onClick={() => setOpenModal(true)} className="btn-base-black">
            Importar OD
          </button>
          <FiltroOrdenesDespachoComponent
            findOrdenesDespacho={findOrdenesDespacho}
            filtrosOrdenesDespacho={filtrosOrdenesDespacho}
            setFiltrosOrdenesDespacho={setFiltrosOrdenesDespacho}
          />
        </div>
      </div>

      <LoaderAllComponent open={openLoader} setOpen={setOpenLoader} />

      <div>
        <ListOrdenesDespachoComponent
          ordenesDespacho={currentOrdenes}
          // ordenesDespacho={ordenesDespacho.result}
          setOrdenesDespacho={setOrdenesDespacho}
          showButtonDelete={true}
          showPagination={false}
          carritoOrdenesDespacho={carritoOrdenesDespacho}
          setCarritoOrdenesDespacho={updateCarritoOrdenesDespacho}
          titlePage={PAGE_AGRUPAR_OD}
          loadingTable={loadingTable}
          handleSelectRowToCart={handleSelectRow}
          findOrdenesDespacho={findOrdenesDespacho}
          setRefreshTable={setRefreshTable}
        />
        {/* Controles de paginación con estilos */}
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
      {/*importar desde OSIS/SAP */}
      <ModalMessage
        open={openModal}
        setOpen={setOpenModal}
        title={"Importar Ordenes de Despacho"}
        titleBtnAceptar={"Importar OD"}
        showButtons={false}
      >
        <FormFiltroODFromOsis
          setOpen={setOpenModal}
          setOpenMessage={setOpenMessage}
          setRefreshTable={setRefreshTable}
        />
      </ModalMessage>

      {/*carrito de compras */}

      <div className="relative">
        <button
          onClick={() => setOpenCarritoGrupos(true)}
          className="z-50 fixed right-6 bottom-16 bg-gray-300 rounded-full py-6 px-6 scale-100 
                      sm:scale-110 hover:scale-125  hover:ring-gray-400 hover:ring-2 shadow-md shadow-gray-600"
        >
          <AppRegistrationIcon sx={{ fontSize: 25 }} />
        </button>
      </div>

      <SlideOverComponent
        open={openCarritoGrupos}
        setOpen={setOpenCarritoGrupos}
        title={CARRITO_ORDENES_DESPACHO.title}
        reSizeWidth={true}
      >
        <div className="table-container-tbody md:p-4 text-left space-y-4 text-black">
          {carritoOrdenesDespacho.length > 0 ? (
            <>
              <FormCarritoAgrupacionODComponent
                carritoOrdenesDespacho={carritoOrdenesDespacho}
                handleSelectRow={handleSelectRow}
                setCarritoOrdenesDespacho={updateCarritoOrdenesDespacho}
                setOpenCarritoGrupos={setOpenCarritoGrupos}
                setRefreshTable={setRefreshTable}
              />
            </>
          ) : (
            <>
              <div className="text-center">
                No has seleccionado ninguna Orden de Despacho.
              </div>
            </>
          )}
        </div>
      </SlideOverComponent>
    </div>
  );
};

export default AgruparODPage;
