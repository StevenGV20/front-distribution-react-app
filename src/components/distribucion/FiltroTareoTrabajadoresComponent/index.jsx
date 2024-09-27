import React from "react";
import FilterComponent from "../../widgets/FilterComponent";

const FiltroTareoTrabajadoresComponent = ({ filtros, setFiltros,onSearch }) => {
  return (
    <>
      <FilterComponent title={"Filtro Tareo"} onSearch={onSearch}>
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
            placeholder="Nombre o DNI Trabajador, N° OT"
          />
        </div>
      </FilterComponent>
    </>
  );
};

export default FiltroTareoTrabajadoresComponent;
