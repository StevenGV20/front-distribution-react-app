import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { fetchRoles } from "../../../redux/features/combos/rolesDistribucionSlice";
import FilterComponent from "../../widgets/FilterComponent";
import CheckBoxEstadosComponent from "../../widgets/CheckBoxEstadosComponent";

const FiltroBandejaMarcacionesComponent = ({
  filtros,
  setFiltros,
  onSearch,
}) => {
  const handleChangeRol = (roles) => {
    setFiltros({ ...filtros, rol: roles });
  };
  const [listaRoles, setListaRoles] = useState();
  const [showRoles, setShowRoles] = useState(false);

  const dispatch = useDispatch();
  const rolesRedux = useSelector((state) => state.rolesDistribucionState.lista);

  useEffect(() => {
    if (!(rolesRedux.length > 0)) {
      dispatch(fetchRoles());
    }

    const lista = rolesRedux.map((r) => ({
      value: r.id,
      name: r.rol_nombre,
      color: "#0e008c",
    }));

    setListaRoles(lista);
  }, [rolesRedux]);

  return (
    <>
      <FilterComponent title={"Filtro Marcaciones"} onSearch={onSearch}>
        <div>
          <input
            type="text"
            value={filtros.texto}
            className="modal-group-input w-full rounded-md border-blue-800 focus:border-blue-700 focus:shadow-md focus:shadow-blue-400"
            onChange={(e) =>
              setFiltros({
                ...filtros,
                texto: e.target.value,
              })
            }
            placeholder="Nombre o DNI Trabajador"
          />
        </div>
        <div>
          <button
            onClick={() => setShowRoles((prev) => !prev)}
            className="w-full text-left border-2 border-blue-800 px-2 py-1 rounded-md flex mt-4"
          >
            <div className="shrink w-full">Roles</div>
            <div className="flex-none">
              {showRoles ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </div>
          </button>
          {showRoles && (
            <CheckBoxEstadosComponent
              filtroEstados={filtros.rol}
              setFiltroEstados={handleChangeRol}
              estados={listaRoles}
              className="lg:grid-cols-1"
            />
          )}
        </div>
      </FilterComponent>
    </>
  );
};

export default FiltroBandejaMarcacionesComponent;
