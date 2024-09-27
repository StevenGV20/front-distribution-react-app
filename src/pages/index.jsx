import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import OpcionCardComponent from "../components/distribucion/OpcionCardComponent";
import { routesPages } from "../utils/routes";
import { buscarCadena } from "../utils/funciones";
const Home = () => {
  const rutas = localStorage.getItem("MENUS_CODIFICADO");
  const listaModulos = rutas ? JSON.parse(window.atob(rutas)) : "";
  return (
    <div className="w-full p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-8 gap-12">
        {routesPages.map((route) => (
          <React.Fragment key={route.name}>
            {(route.path != "/" /* && buscarCadena(listaModulos, route.path) */) && (
              <NavLink to={route.path} key={route.name}>
                <OpcionCardComponent route={route} />
              </NavLink>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Home;
