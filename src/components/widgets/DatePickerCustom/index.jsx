import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";

const DatePickerCustom = ({
  selected,
  value,
  onChange,
  classname = "",
  minDate = null,
  maxDate = null,
  readOnly = true
}) => {
  registerLocale("es", es);
  setDefaultLocale("es");

  const [open, setOpen] = useState(false);

  return (
    <div>
      <DatePicker
        selected={selected}
        value={value}
        onChange={onChange}
        onFocus={() => setOpen(true)}
        onClickOutside={() => setOpen(false)}
        open={open}
        locale="es"
        name="fechaSalida"
        dateFormat="dd/MM/yyyy"
        popperPlacement="bottom-end"
        minDate={minDate}
        maxDate={maxDate}
        readOnly={readOnly}
        className={`form-container-group-content-input border-blue-700 ${classname}`}
      />
    </div>
  );
};

export default DatePickerCustom;
