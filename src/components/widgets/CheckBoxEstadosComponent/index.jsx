import { Checkbox } from "@mui/material";
import React from "react";

const CheckBoxEstadosComponent = ({
  setFiltroEstados,
  filtroEstados,
  setRefreshTable = null,
  estados,
  className = "lg:grid lg:grid-cols-3",
}) => {
  const changeFiltroEstado = (e) => {
    let value = e.target.value;
    let isChecked = e.target.checked;
    let estadosAct = filtroEstados.toString().split(",");
    ////console.log(estadosAct, value);
    if (isChecked) {
      setFiltroEstados(filtroEstados + "," + value);
      /* if (!(estadosAct[0] === "") && estadosAct[0] !== value)
        setFiltroEstados(filtroEstados + "," + value);
      else setFiltroEstados(value); */
    } else {
      let values = estadosAct.filter((e) => e != value);
      setFiltroEstados(values.toString());
    }
    if (setRefreshTable) setRefreshTable((prev) => !prev);
  };

  return (
    <div className={`mt-3 ${className}`}>
      {estados &&
        estados.map((estado) => (
          <div className="col-span-1 flex items-center" key={estado.name}>
            <Checkbox
              inputProps={{ "aria-label": "Checkbox demo" }}
              sx={{
                color: estado.color,
                "&.Mui-checked": {
                  color: estado.color,
                },
              }}
              checked={filtroEstados.split(",").includes(estado.value.toString())}
              value={estado.value}
              onChange={(e) => changeFiltroEstado(e)}
            />
            <label
              htmlFor="Checkbox demo"
              className="font-medium text-gray-900 text-sm"
            >
              {estado.name}
            </label>
          </div>
        ))}
    </div>
  );
};

export default CheckBoxEstadosComponent;
