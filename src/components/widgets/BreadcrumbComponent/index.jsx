import React from "react";
import { NavLink } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const BreadcrumbComponent = ({ message }) => {
  return (
    <div className="font-bold flex text-color-azulReyPlast">
      <NavLink to={"/"}>
        <KeyboardBackspaceIcon className="mb-1" />
      </NavLink>
      <div className="ml-4"> {message}</div>
    </div>
  );
};

export default BreadcrumbComponent;
