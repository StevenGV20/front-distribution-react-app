import React, { useEffect, useState } from "react";
import ModalMessage from "../../widgets/ModalComponent";
import { CircularProgress, TableCell, TableRow } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

import CustomTablePagination from "../../widgets/TableComponent/TablePagination";
import {
  API_DISTRIBUCION,
  ORDENES_DESPACHO_PARTITION_TABLE_COLS_DESKTOP,
  USERNAME_LOCAL,
} from "../../../utils/general";
import {
  convertirDateTimeToDate,
  getFetchFunction,
  postFetchFunctionCustomFunction,
  redondearDecimales,
} from "../../../utils/funciones";
import { IconDivide } from "../../../icons/icons-svg";
import { AGRUPAR_ORDENES_DESPACHO_PAGE } from "../../../utils/properties.text";
import { ERRORS_TEXT } from "../../../utils/properties.error.text";

import { setMessage } from "../../../redux/features/utils/utilsSlice";
import { useDispatch } from "react-redux";

const ParticionarODComponent = ({ ordenRow, setRefreshTable }) => {
  const [openModalParticionar, setOpenModalParticionar] = useState(false);
  const [ordenDespacho, setOrdenDespacho] = useState(null);
  const [errorItem, setErrorItem] = useState({ id: "", message: "" });
  const [loadingTable, setLoadingTable] = useState(true);
  const [isOrdenSelected, setIsOrdenSelected] = useState(false);

  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  /*   const [openMessage, setOpenMessage] = useState({
    state: false,
    type: "",
    message: "",
  }); */
  /* const [ordenDespachoEditada, setOrdenDespachoEditada] = useState(null);
  const [ordenDespachoNueva, setOrdenDespachoNueva] = useState(null); */

  useEffect(() => {
    //findOrdenesDespacho('01', ordenSelected.odc_numodc);
  }, []);

  const findOrdenesDespacho = (cia, numodc) => {
    const fetchOrdenesDespacho = async () => {
      try {
        await getFetchFunction(
          `${API_DISTRIBUCION}/ordenDespacho/findByNumODC?cia=${cia}&numodc=&idOdc=${numodc}`,
          setLoadingTable,
          setOrdenDespacho
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
    fetchOrdenesDespacho();
  };

  const handleSelectOrdenDetails = (ordenRow) => {
    setIsOrdenSelected(true);
    findOrdenesDespacho("01", ordenRow.id);
  };

  const onChangeCantidad = (item, e) => {
    if (e.target.value > item.odd_canaut) {
      setErrorItem({
        id: item.prd_codprd,
        message: "La cantidad no puede ser mayor a la cantidad original",
      });
    } else if (e.target.value < 0) {
      setErrorItem({
        id: item.prd_codprd,
        message: "La cantidad no puede ser menor a 0",
      });
    } else {
      setErrorItem({ id: "", message: "" });
      let otrosItems = ordenDespacho.result.items.filter(
        (i) => i.prd_codprd !== item.prd_codprd
      );
      let thisItem = ordenDespacho.result.items.find(
        (i) => i.prd_codprd.trim() === item.prd_codprd.trim()
      );

      thisItem["cantidadParticionada"] = thisItem.odd_canaut - e.target.value;
      thisItem["cantidadReducida"] = e.target.value;
      otrosItems = {
        ...ordenDespacho,
        result: { ...ordenDespacho.result, items: [thisItem, ...otrosItems] },
      };
      otrosItems.result.items.sort((a, b) =>
        a.prd_codprd.localeCompare(b.prd_codprd)
      );
      setOrdenDespacho(otrosItems);
    }
  };

  const rowTable = (row) => (
    <TableRow key={row.prd_codprd}>
      <TableCell
        component="th"
        scope="row"
        style={{ width: 50 }}
        align="center"
      >
        {row.prd_codprd}
      </TableCell>
      <TableCell style={{ width: 300 }} align="left">
        {row.prd_desesp}
      </TableCell>
      <TableCell style={{ width: 50 }} align="center">
        {row.odd_canaut}
      </TableCell>
      <TableCell style={{ width: 50 }} align="center">
        {row.cantidadParticionada >= 0
          ? row.cantidadParticionada
          : (row["cantidadParticionada"] = row.odd_canaut)}
      </TableCell>
      <TableCell style={{ width: 50 }} align="center">
        <input
          type="number"
          value={
            row.cantidadReducida
              ? row.cantidadReducida
              : (row["cantidadReducida"] = 0)
          }
          className="text-center form-container-group-content-input px-2"
          id={"prd" + row.prd_codprd}
          onChange={(e) => onChangeCantidad(row, e)}
        />
        {errorItem.id === row.prd_codprd && (
          <span className="form-container-group-content-span-error">
            {errorItem.message}
          </span>
        )}
      </TableCell>
    </TableRow>
  );

  const updateOrderItem = (ordenDespachoItemEdit, item, cantidad) => {
    ordenDespachoItemEdit.odd_canaut = parseFloat(cantidad) || 0;
    ordenDespachoItemEdit.odd_candes = parseFloat(cantidad) || 0;

    ordenDespachoItemEdit.odd_impbru = parseFloat(
      redondearDecimales(cantidad * item.odd_preuni).toFixed(2)
    );

    ordenDespachoItemEdit.odd_imptot = ordenDespachoItemEdit.odd_impbru;

    ordenDespachoItemEdit.odd_impde1 = redondearDecimales(
      (ordenDespachoItemEdit.odd_imptot * ordenDespachoItemEdit.odd_porde1) /
        100
    );
    ordenDespachoItemEdit.odd_imptot = redondearDecimales(
      ordenDespachoItemEdit.odd_imptot - ordenDespachoItemEdit.odd_impde1
    );

    ordenDespachoItemEdit.odd_impde2 = redondearDecimales(
      (ordenDespachoItemEdit.odd_imptot * ordenDespachoItemEdit.odd_porde2) /
        100
    );
    ordenDespachoItemEdit.odd_imptot = redondearDecimales(
      ordenDespachoItemEdit.odd_imptot - ordenDespachoItemEdit.odd_impde2
    );

    ordenDespachoItemEdit.odd_impde3 = redondearDecimales(
      (ordenDespachoItemEdit.odd_imptot * ordenDespachoItemEdit.odd_porde3) /
        100
    );
    ordenDespachoItemEdit.odd_imptot = redondearDecimales(
      ordenDespachoItemEdit.odd_imptot - ordenDespachoItemEdit.odd_impde3
    );

    ordenDespachoItemEdit.odd_impigv = parseFloat(
      (
        (ordenDespachoItemEdit.odd_imptot *
          parseFloat(ordenDespacho.result.odc_tasigv)) /
        100
      ).toFixed(2)
    );
    ordenDespachoItemEdit.odd_imptot = parseFloat(
      (
        ordenDespachoItemEdit.odd_imptot + ordenDespachoItemEdit.odd_impigv
      ).toFixed(2)
    );

    return ordenDespachoItemEdit;
  };

  const handleCreateOrdenParcial = () => {
    let sumaCantidadOriginal = 0;
    let sumaCantidadParticionada = 0;

    for (let item of ordenDespacho.result.items) {
      sumaCantidadOriginal += parseInt(item.cantidadReducida || 0);
      sumaCantidadParticionada += parseInt(item.cantidadParticionada || 0);
    }

    if (!(sumaCantidadOriginal > 0)) {
      setErrorItem({
        id: "SUBMIT",
        message: "La cantidad original en todos los items no puede quedar en 0",
      });
      setOpenMessage({
        state: true,
        type: "error",
        message: "Error",
      });
    } else if (!(sumaCantidadParticionada > 0)) {
      setErrorItem({
        id: "SUBMIT",
        message:
          "La cantidad a particionar en todos los items no puede quedar en 0",
      });
    } else {
      setOpenModalConfirmarParticion(true);
    }
  };

  const onSubmitOrdenParcial = () => {
    var ordenDespachoEditada = { ...ordenDespacho.result, items: [] };
    var ordenDespachoNueva = { ...ordenDespacho.result, items: [] };

    let odc_impbru_ODEdit = 0.0;
    let odc_tasdct_ODEdit = 0.0;
    let odc_impde1_ODEdit = 0.0;
    let odc_impde2_ODEdit = 0.0;
    let odc_impigv_ODEdit = 0.0;
    let odc_imptot_ODEdit = 0.0;

    let odc_impbru_ODNueva = 0.0;
    let odc_tasdct_ODNueva = 0.0;
    let odc_impde1_ODNueva = 0.0;
    let odc_impde2_ODNueva = 0.0;
    let odc_impigv_ODNueva = 0.0;
    let odc_imptot_ODNueva = 0.0;

    for (let item of ordenDespacho.result.items) {
      let cantidadReducida = parseFloat(item.cantidadReducida);
      let cantidadParticionada = parseFloat(item.cantidadParticionada);

      let index_1 = ordenDespachoEditada.items.length;
      ordenDespachoEditada.items[index_1] = item;
      ordenDespachoEditada.items[index_1] = updateOrderItem(
        ordenDespachoEditada.items[index_1],
        item,
        cantidadReducida
      );

      odc_impbru_ODEdit += parseFloat(
        ordenDespachoEditada.items[index_1].odd_impbru
      );
      odc_tasdct_ODEdit += parseFloat(item.odc_tasdct) || 0;
      odc_impde1_ODEdit += ordenDespachoEditada.items[index_1].odd_impde1;
      odc_impde2_ODEdit += redondearDecimales(
        ordenDespachoEditada.items[index_1].odd_impde2 +
          ordenDespachoEditada.items[index_1].odd_impde3
      );
      odc_impigv_ODEdit += parseFloat(
        ordenDespachoEditada.items[index_1].odd_impigv
      );
      odc_imptot_ODEdit += parseFloat(
        ordenDespachoEditada.items[index_1].odd_imptot
      );

      if (cantidadParticionada > 0) {
        let index = ordenDespachoNueva.items.length;
        ordenDespachoNueva.items[index] = { ...item };
        ordenDespachoNueva.items[index].odc_numodc = "";
        ordenDespachoNueva.items[index] = updateOrderItem(
          ordenDespachoNueva.items[index],
          item,
          cantidadParticionada
        );

        odc_impbru_ODNueva += redondearDecimales(
          parseFloat(ordenDespachoNueva.items[index].odd_impbru)
        );
        odc_tasdct_ODNueva += parseFloat(item.odc_tasdct);
        odc_impde1_ODNueva += ordenDespachoNueva.items[index].odd_impde1;
        odc_impde2_ODNueva += redondearDecimales(
          ordenDespachoNueva.items[index].odd_impde2 +
            ordenDespachoNueva.items[index].odd_impde3
        );
        odc_impigv_ODNueva += parseFloat(
          ordenDespachoNueva.items[index].odd_impigv
        );
        odc_imptot_ODNueva += redondearDecimales(
          parseFloat(ordenDespachoNueva.items[index].odd_imptot)
        );

        delete ordenDespachoNueva.items[index].cantidadReducida;
        delete ordenDespachoNueva.items[index].cantidadParticionada;
      }

      delete ordenDespachoEditada.items[index_1].cantidadReducida;
      delete ordenDespachoEditada.items[index_1].cantidadParticionada;
    }

    ordenDespachoEditada.odc_impbru = odc_impbru_ODEdit;
    ordenDespachoEditada.odc_tasdct = odc_tasdct_ODEdit;
    ordenDespachoEditada.odc_impde1 = odc_impde1_ODEdit;
    ordenDespachoEditada.odc_impde2 = odc_impde2_ODEdit;
    ordenDespachoEditada.odc_impigv = odc_impigv_ODEdit;
    ordenDespachoEditada.odc_imptot = odc_imptot_ODEdit;
    ordenDespachoEditada.odc_usucre = USERNAME_LOCAL;

    ordenDespachoNueva.odc_impbru =
      redondearDecimales(parseFloat(odc_impbru_ODNueva)) || 0.0;
    ordenDespachoNueva.odc_tasdct = parseFloat(odc_tasdct_ODNueva) || 0.0;
    ordenDespachoNueva.odc_impde1 = parseFloat(odc_impde1_ODNueva) || 0.0;
    ordenDespachoNueva.odc_impde2 = parseFloat(odc_impde2_ODNueva) || 0.0;
    ordenDespachoNueva.odc_impigv = parseFloat(odc_impigv_ODNueva) || 0.0;
    ordenDespachoNueva.odc_imptot =
      redondearDecimales(parseFloat(odc_imptot_ODNueva)) || 0.0;
    ordenDespachoNueva.odc_numori = ordenDespachoEditada.odc_numodc;
    ordenDespachoNueva.odc_numodc = "";
    ordenDespachoNueva.odc_usucre = USERNAME_LOCAL;

    var fechaActual = new Date();
    ordenDespachoNueva.ano_codano = fechaActual.getFullYear().toString();
    ordenDespachoNueva.mes_codmes = ("0" + (fechaActual.getMonth() + 1)).slice(
      -2
    );

    var listaOrdenes = new Array(2);
    listaOrdenes[0] = ordenDespachoEditada;
    listaOrdenes[1] = ordenDespachoNueva;
    console.log("listaOrdenes", listaOrdenes);
    //////console.log("listaOrdenes", JSON.stringify(listaOrdenes,null,2));

    const updateData = (data) => {
      setRefreshTable((prev) => !prev);
    };

    const postPartitionOrders = async () => {
      const result = await postFetchFunctionCustomFunction(
        `${API_DISTRIBUCION}/ordenDespacho/saveParticionada`,
        listaOrdenes,
        setOpenMessage,
        updateData
      );
      //
      ////console.log("result postChofer", result);
    };
    postPartitionOrders();

    //genera codigo OD - YYMM#### - 24050001
  };

  const [openModalConfirmarParticion, setOpenModalConfirmarParticion] =
    useState(false);

  return (
    <>
      <div>
        <button
          className="py-2 px-4 text-red-50 cursor-pointer flex row-span-2 items-center space-x-2"
          onClick={() => {
            handleSelectOrdenDetails(ordenRow);
            setOpenModalParticionar(true);
          }}
        >
          <IconDivide color="blue" />
          <label htmlFor="" className="font-bold text-black cursor-pointer">
            Particionar OD
          </label>
        </button>
      </div>

      <ModalMessage
        open={openModalConfirmarParticion}
        setOpen={setOpenModalConfirmarParticion}
        title={
          <div className="flex space-x-2 items-end">
            <WarningIcon sx={{ color: "yellow", fontSize: "24px" }} />{" "}
            <div className="text-xl">Advertencia</div>
          </div>
        }
        titleBtnAceptar={"Si"}
        titelBtnCancelar="No"
        onBtnAceptar={() => onSubmitOrdenParcial()}
        showButtons={true}
      >
        <div className="w-full text-center text-lg p-0 font-semibold">
          {/* <div className="w-full flex space-x-2 items-end justify-center">
            <WarningIcon sx={{ fontSize: "24px" }} className="text-yellow-500" />{" "}
            <div className="font-bold text-lg">Advertencia</div>
          </div> */}
          <div>
            {
              AGRUPAR_ORDENES_DESPACHO_PAGE.formParticionarOrdenesDespacho
                .advertenciaText
            }
          </div>
          <div>
            {AGRUPAR_ORDENES_DESPACHO_PAGE.formParticionarOrdenesDespacho.copyOrderText(
              ordenRow.odc_numodc
            )}
          </div>
        </div>
      </ModalMessage>

      <ModalMessage
        open={openModalParticionar}
        setOpen={setOpenModalParticionar}
        title={`${AGRUPAR_ORDENES_DESPACHO_PAGE.formParticionarOrdenesDespacho.titleForm} - ${ordenRow.odc_numodc}`}
        titleBtnAceptar={"Crear Orden Parcial"}
        onBtnAceptar={() => handleCreateOrdenParcial()}
      >
        {!loadingTable ? (
          <>
            <div className="form-container md:grid-cols-12 text-black">
              <div className="form-details-content-group sm:col-span-6 md:col-span-3 2xl:col-span-3">
                <label
                  htmlFor=""
                  className="form-container-group-content-label font-bold"
                >
                  {
                    AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho
                      .numOrden_label
                  }
                </label>
                <div className="px-4">{ordenRow.odc_numodc}</div>
              </div>
              <div className="form-details-content-group sm:col-span-6 md:col-span-4 2xl:col-span-3">
                <label
                  htmlFor=""
                  className="form-container-group-content-label font-bold"
                >
                  {
                    AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho
                      .emisionOrden_label
                  }
                </label>
                <div className="px-4">
                  {convertirDateTimeToDate(ordenRow.odc_fecdoc)}
                </div>
              </div>
              <div className="form-details-content-group sm:col-span-6 md:col-span-3 2xl:col-span-3">
                <label
                  htmlFor=""
                  className="form-container-group-content-label font-bold "
                >
                  {
                    AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho
                      .numPedido_label
                  }
                </label>
                <div className="px-4">{ordenRow.ppc_numppc}</div>
              </div>

              <div className="form-details-content-group sm:col-span-6 md:col-span-3 2xl:col-span-3">
                <label
                  htmlFor=""
                  className="form-container-group-content-label font-bold"
                >
                  {
                    AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho
                      .rucCliente_label
                  }
                </label>
                <div className="px-4">{ordenRow.aux_codaux}</div>
              </div>
              <div className="form-details-content-group sm:col-span-6 md:col-span-8 2xl:col-span-6">
                <label
                  htmlFor=""
                  className="form-container-group-content-label font-bold"
                >
                  {
                    AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho
                      .cliente_label
                  }
                </label>
                <div className="px-4">{ordenRow.aux_nomaux}</div>
              </div>

              <div className="form-details-content-group sm:col-span-6 md:col-span-3 2xl:col-span-3">
                <label
                  htmlFor=""
                  className="form-container-group-content-label font-bold"
                >
                  {
                    AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho
                      .canal_label
                  }
                </label>
                <div className="px-4">{ordenRow.odc_canal_des}</div>
              </div>

              <div className="form-details-content-group sm:col-span-6 md:col-span-4 2xl:col-span-4">
                <label
                  htmlFor=""
                  className="form-container-group-content-label font-bold"
                >
                  {
                    AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho
                      .importeTotal_label
                  }
                </label>
                <div className="px-4">{ordenRow.odc_imptot}</div>
              </div>
              <div className="form-details-content-group sm:col-span-6 md:col-span-12">
                <label
                  htmlFor=""
                  className="form-container-group-content-label font-bold"
                >
                  {
                    AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho
                      .observacion_label
                  }
                </label>
                <div className="px-4">{ordenRow.odc_obsodc}</div>
              </div>
            </div>
            <div>
              <div className="w-full text-center">
                {errorItem.id === "SUBMIT" && (
                  <span className="form-container-group-content-span-error">
                    {errorItem.message}
                  </span>
                )}
              </div>
              <CustomTablePagination
                rowTableComponent={rowTable}
                rows={ordenDespacho.result.items.sort((a, b) =>
                  a.prd_codprd.localeCompare(b.prd_codprd)
                )}
                loadingTable={loadingTable}
                columns={ORDENES_DESPACHO_PARTITION_TABLE_COLS_DESKTOP}
              ></CustomTablePagination>
            </div>
          </>
        ) : (
          <div className="w-full text-center">
            <CircularProgress />
          </div>
        )}
      </ModalMessage>
    </>
  );
};

export default ParticionarODComponent;
