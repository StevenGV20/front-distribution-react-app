import React, { useEffect, useState } from "react";
import {
  convertirDateTimeToDate,
  getFetchFunction,
} from "../../../utils/funciones";
import { API_DISTRIBUCION } from "../../../utils/general";
import { AGRUPAR_ORDENES_DESPACHO_PAGE } from "../../../utils/properties.text";
import CustomTablePagination from "../../widgets/TableComponent/TablePagination";
import { CircularProgress, TableCell, TableRow } from "@mui/material";

const DetailsOrdenDespachoComponent = ({ orden }) => {
  const [ordenDespacho, setOrdenDespacho] = useState(null);
  const [loadingTable, setLoadingTable] = useState(true);
  const [isOrdenSelected, setIsOrdenSelected] = useState(false);
  const findOrdenesDespacho = (cia, numodc) => {
    const fetchOrdenesDespacho = async () => {
      try {
        await getFetchFunction(
          `${API_DISTRIBUCION}/ordenDespacho/findByNumODC?cia=${cia}&numodc=&idOdc=${numodc}`,
          setLoadingTable,
          setOrdenDespacho
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrdenesDespacho();
  };

  useEffect(() => {
    findOrdenesDespacho("01", orden.id);
  }, []);

  const rowTable = (row) => (
    <TableRow key={row.prd_codprd}>
      <TableCell style={{ width: 100 }} align="center">
        {row.prd_codprd}
      </TableCell>
      <TableCell style={{ width: 300 }} align="left">
        {row.prd_desesp}
      </TableCell>
      <TableCell style={{ width: 50 }} align="center">
        {row.odd_canaut}
      </TableCell>
      <TableCell style={{ width: 50 }} align="center">
        {row.odd_peso}
      </TableCell>
      <TableCell style={{ width: 50 }} align="center">
        {row.odd_volumen}
      </TableCell>
      <TableCell style={{ width: 50 }} align="center">
        {row.odd_imptot}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="modal-children-content">
      <div className="form-container md:grid-cols-12 text-black md:pt-0">
        <div className="form-details-content-group sm:col-span-6 md:col-span-3 2xl:col-span-3">
          <label
            htmlFor=""
            className="form-container-group-content-label font-bold"
          >
            {AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho.numOrden_label}
          </label>
          <div className="px-4">{orden.odc_numodc}</div>
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
            {convertirDateTimeToDate(orden.odc_fecdoc)}
          </div>
        </div>
        <div className="form-details-content-group sm:col-span-6 md:col-span-3 2xl:col-span-3">
          <label
            htmlFor=""
            className="form-container-group-content-label font-bold "
          >
            {AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho.numPedido_label}
          </label>
          <div className="px-4">{orden.ppc_numppc}</div>
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
          <div className="px-4">{orden.aux_codaux}</div>
        </div>
        <div className="form-details-content-group sm:col-span-6 md:col-span-9 2xl:col-span-6">
          <label
            htmlFor=""
            className="form-container-group-content-label font-bold"
          >
            {AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho.cliente_label}
          </label>
          <div className="px-4">{orden.aux_nomaux}</div>
        </div>

        <div className="form-details-content-group sm:col-span-6 md:col-span-12 2xl:col-span-12">
          <label
            htmlFor=""
            className="form-container-group-content-label font-bold"
          >
            {AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho.direccion_label}
          </label>
          <div className="px-4">
            {orden.odc_dirdes} / {orden.odc_desubigeo}
          </div>
        </div>

        <div className="form-details-content-group sm:col-span-6 md:col-span-4 2xl:col-span-3">
          <label
            htmlFor=""
            className="form-container-group-content-label font-bold"
          >
            {AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho.canal_label}
          </label>
          <div className="px-4">{orden.odc_canal_des}</div>
        </div>

        <div className="form-details-content-group sm:col-span-6 md:col-span-2 2xl:col-span-2">
          <label
            htmlFor=""
            className="form-container-group-content-label font-bold"
          >
            {AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho.almacen_label}
          </label>
          <div className="px-4">{orden.alm_codalm}</div>
        </div>

        <div className="form-details-content-group sm:col-span-6 md:col-span-3 2xl:col-span-3">
          <label
            htmlFor=""
            className="form-container-group-content-label font-bold"
          >
            {
              AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho
                .importeTotal_label
            }
          </label>
          <div className="px-2">{orden.odc_imptot}</div>
        </div>

        <div className="form-details-content-group sm:col-span-6 md:col-span-3 2xl:col-span-2">
          <label
            htmlFor=""
            className="form-container-group-content-label font-bold"
          >
            {AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho.voluemn_label}
          </label>
          <div className="px-4">{orden.odc_volumen}</div>
        </div>
        <div className="form-details-content-group sm:col-span-6 md:col-span-2 2xl:col-span-2">
          <label
            htmlFor=""
            className="form-container-group-content-label font-bold"
          >
            {AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho.bultos_label}
          </label>
          <div className="px-4">{orden.odc_bultos}</div>
        </div>
        <div className="form-details-content-group sm:col-span-6 md:col-span-2 2xl:col-span-2">
          <label
            htmlFor=""
            className="form-container-group-content-label font-bold"
          >
            {AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho.peso_label}
          </label>
          <div className="px-4">{orden.odc_peso}</div>
        </div>
        <div className="form-details-content-group sm:col-span-6 md:col-span-2 2xl:col-span-2">
          <label
            htmlFor=""
            className="form-container-group-content-label font-bold"
          >
            {AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho.rangoHora_label}
          </label>
          <div className="px-4">{orden.odc_ranrec}</div>
        </div>

        <div className="form-details-content-group sm:col-span-6 md:col-span-12 2xl:col-span-12">
          <label
            htmlFor=""
            className="form-container-group-content-label font-bold"
          >
            {
              AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho
                .observacion_label
            }
          </label>
          <div className="px-4">{orden.odc_obsodc}</div>
        </div>
      </div>
      <div>
        <CustomTablePagination
          rowTableComponent={rowTable}
          rows={
            (ordenDespacho &&
              ordenDespacho.result &&
              ordenDespacho.result.items &&
              ordenDespacho.result.items.sort((a, b) =>
                a.prd_codprd.localeCompare(b.prd_codprd)
              )) ||
            []
          }
          loadingTable={loadingTable}
          columns={
            AGRUPAR_ORDENES_DESPACHO_PAGE.detailsOrdenDespacho.tableHeaders
          }
        ></CustomTablePagination>
      </div>
    </div>
  );
};

export default DetailsOrdenDespachoComponent;
