import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const TimePickerCustomComponent = ({
  labelTitle = "Hora",
  styles = {
    padding: "0.25em",
    width: "100%",
  },
  minTime = null,
  maxTime = null,
  valueTime,
  nameValue,
  formik,
}) => {
  const [value, setValue] = React.useState(dayjs(valueTime));

  const handleChangeTime = (time, context) => {
    setValue(time);
    console.log(context);
    formik.setFieldValue(nameValue, time);
    if (context.validationError === "minTime")
      formik.setFieldError(
        nameValue,
        "La hora no puede ser menor a la permitida"
      );
  };

  const inputStyles = {
    padding: "0",
    borderRadius: "0",
    border: "",
    width: styles.width,
    ".css-1bn53lx": {
      padding: "0",
      borderRadius: "0px",
    },
    ".css-1nvf7g0": {
      marginLeft: "0",
      marginRight: "2px",
      scale: "0.8",
      padding: "0.1em",
      paddingRight: "0.2em",
      paddingLeft: "0em",
    },
    ".css-1uvydh2": {
      padding: styles.padding,
      paddingRight: "0",
      borderRadius: "0px",
      fontSize: "14px",
      textAlign: "center",
    },
    ".css-slyssw": {
      paddingLeft: "0em",
      marginRight: "0.005em",
    },
    ".css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root": {
      padding: "0",
      borderRadius: "0px",
    },
    ".css-1laqsz7-MuiInputAdornment-root": {
      marginLeft: "0",
      scale: "0.8",
      padding: "0.2em",
      paddingRight: "0.2em",
      paddingLeft: "0em",
    },
    ".css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
      padding: styles.padding,
      paddingRight: "0",
      borderRadius: "0px",
      fontSize: "14px",
      textAlign: "center",
    },
    ".css-1yq5fb3-MuiButtonBase-root-MuiIconButton-root": {
      paddingLeft: "0em",
      marginRight: "0.005em",
    },
    fieldset: {
      border: "blue 1px solid",
      borderRadius: "0.3em",
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={labelTitle}
        value={value}
        onChange={(time, context) => handleChangeTime(time, context)}
        sx={inputStyles}
        minTime={dayjs(minTime)}
        maxTime={dayjs(maxTime)}
      />
    </LocalizationProvider>
  );
};

export default TimePickerCustomComponent;
