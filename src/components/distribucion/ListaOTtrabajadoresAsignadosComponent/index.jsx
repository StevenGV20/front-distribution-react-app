import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

import TableCustom from "../../widgets/TableComponent";
import { LLENADO_OT_PAGE } from "../../../utils/properties.text";
import { API_DISTRIBUCION } from "../../../utils/general";
import { ERRORS_TEXT } from "../../../utils/properties.error.text";
import { getFetchFunction } from "../../../utils/funciones";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/features/utils/utilsSlice";

const ListaOTtrabajadoresAsignadosComponent = ({ viaje }) => {
  const [trabajadores, setTrabajadores] = useState({ result: [] });
  const [loadingTable, setLoadingTable] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    getFetchFunction(
      `${API_DISTRIBUCION}/ot/trabajadoresAsignados?cia=01&ot=${viaje.via_otrcod}&tipo=${viaje.via_otrtip}`,
      setLoadingTable,
      setTrabajadores
    ).then((data) => {
      if (
        typeof data !== "undefined" &&
        data.toString().includes("Failed to fetch")
      ) {
        dispatch(
          setMessage({
            state: true,
            message: ERRORS_TEXT.fetchError,
            type: "error",
          })
        );
      }
    });
  }, []);

  return (
    <>
      <TableCustom
        cols={LLENADO_OT_PAGE.tableTrabajadoresAsignados}
        maxHeight={75}
      >
        {!loadingTable ? (
          trabajadores.result.length < 1 ? (
            <tr>
              <td colSpan={LLENADO_OT_PAGE.tableTrabajadoresAsignados.length}>
                No existen registros para mostrar
              </td>
            </tr>
          ) : (
            trabajadores.result.map((t) => (
              <tr>
                <td>
                  <div>
                    <div>{t.tra_nombre}</div>
                    {t.tra_codigo && (
                      <div>
                        {t.tra_codigo} / {t.rol_nombre}
                      </div>
                    )}
                  </div>
                </td>
                <td>{t.hor_laborado}</td>
                <td>{t.cmc_hormod}</td>
                <td>{t.cmc_hormoi}</td>
                <td>{t.cmc_horede}</td>
              </tr>
            ))
          )
        ) : (
          <tr>
            <td colSpan={LLENADO_OT_PAGE.tableTrabajadoresAsignados.length}>
              <CircularProgress />
            </td>
          </tr>
        )}
      </TableCustom>
    </>
  );
};

export default ListaOTtrabajadoresAsignadosComponent;
