import React, { useEffect, useState } from "react";

import { Checkbox, Switch } from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { useFormik } from "formik";

import { BANDEJA_LLENADO_HORAS_PAGE } from "../../../utils/properties.text";
import {
  convertirDateToTimeString,
  deleteFetchFunction,
  diferenciaHorasString,
  ordenarAlfabeticamente,
  parseZonaHoraria,
  postFetchFunction,
} from "../../../utils/funciones";
import TableCustom from "../../widgets/TableComponent";
import { LocalizationProvider } from "@mui/x-date-pickers";
import TimePickerCustomComponent from "../../widgets/TimePickerCustomComponent";
import { API_DISTRIBUCION, USERNAME_LOCAL } from "../../../utils/general";
import { ERRORS_TEXT } from "../../../utils/properties.error.text";
import ModalMessage from "../../widgets/ModalComponent";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../../redux/features/utils/utilsSlice";
import { fetchRoles } from "../../../redux/features/combos/rolesDistribucionSlice";

const FormAsignarOTComponent = ({
  loadingTableViajes,
  viajes,
  trabajadorSelected,
  setRefreshTable,
  setOpenModal,
  setLoaderComponent,
}) => {
  const dispatch = useDispatch();
  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };
  const [roles, setRoles] = useState([]);
  const rolesRedux = useSelector((state) => state.rolesDistribucionState.lista);

  useEffect(() => {
    if (!(rolesRedux.length > 0)) {
      dispatch(fetchRoles());
    }

    setRoles(rolesRedux);
  }, [rolesRedux]);

  const [listaOTAsignadas, setListaOTAsignadas] = useState(
    trabajadorSelected.otAsignadas || []
  );
  
  const horasMOIActuales = () => {
    let totalHoras = trabajadorSelected.otAsignadas.reduce(
      (total, current) => total + current.cmc_hormoi,
      0
    );
    return totalHoras;
  };


  const [errorMessage, setErrorMessage] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [horasMOICustom, setHorasMOICustom] = useState(
    (trabajadorSelected.otAsignadas && horasMOIActuales()) || 1
  );

  const handleCheckOT = (value, ot) => {
    //setOtSelected(ot);
    setErrorMessage(null);
    let listOT = [...listaOTAsignadas];
    if (value) {
      console.log(ot);
      console.log(trabajadorSelected.otAsignadas);
      let otBefore = trabajadorSelected.otAsignadas.filter(
        (tot) => tot.via_otrcod === ot.via_otrcod
      );
      if (otBefore.length > 0) {
        listOT.push(otBefore[0]);
      } else {
        listOT.push({
          cmc_id: trabajadorSelected.cmc_id,
          tra_cmdrol: trabajadorSelected.tra_emprol,
          via_otrcod: ot.via_otrcod,
          utr_plautr: ot.utr_plautr,
          via_partida: ot.via_partida,
          via_llegada: ot.via_llegada,
          via_nviaje: ot.via_nviaje,
          cmc_ingreso: ot.via_partida,
          cmc_salida: ot.via_llegada,
          cmc_comida: trabajadorSelected.cmc_comida,
          cmc_hormod: ot.via_tot_horas,
          cmc_hormoi: 0,
          cmc_horede: 0,
          cmc_regusu: USERNAME_LOCAL,
        });
      }

      setErrorMessage(false);
    } else {
      listOT = listaOTAsignadas.filter((o) => o.via_otrcod !== ot.via_otrcod);
    }
    setListaOTAsignadas(listOT);
  };

  const isSelected = (ot) => {
    return (
      listaOTAsignadas.filter((a) => a.via_otrcod === ot.via_otrcod).length > 0
    );
  };

  const onAsignarOTs = () => {
    if (listaOTAsignadas.length > 0) {
      let totalHoras = listaOTAsignadas.reduce(
        (total, current) => total + current.cmc_hormod,
        0
      );
      console.log("horas usadas: ", totalHoras + horasMOICustom);

      if (totalHoras + horasMOICustom > trabajadorSelected.hor_laborado) {
        setErrorMessage(
          "No puedes agregar OTs que superen la cantidad total de horas laboradas"
        );
        return false;
      }

      listaOTAsignadas.forEach((objeto) => {
        objeto.cmc_ingreso = parseZonaHoraria(5, objeto.cmc_ingreso);
        objeto.cmc_salida = parseZonaHoraria(5, objeto.cmc_salida);
        objeto.cmc_hormoi = horasMOICustom / listaOTAsignadas.length;
      });

      setLoaderComponent(true);
      const fetchData = async () => {
        try {
          await postFetchFunction(
            `${API_DISTRIBUCION}/cuadreMano/asignarOTs`,
            listaOTAsignadas,
            setOpenMessage
          ).then((data) => {
            setLoaderComponent(false);
            setRefreshTable((prev) => !prev);
          });
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
      setOpenModal(false);
      setRefreshTable((prev) => !prev);
    } else {
      const deleteData = async () => {
        try {
          await deleteFetchFunction(
            `${API_DISTRIBUCION}/cuadreMano/eliminarAllOTAsignadas?cmcId=${trabajadorSelected.cmc_id}&cia=06`,
            {},
            setOpenMessage
          ).then((data) => {
            setRefreshTable((prev) => !prev);
            setOpenModal(false);
          });
        } catch (error) {
          console.error(error);
        }
      };

      deleteData();
    }
  };

  const estadosOT = (estado) => {
    switch (estado) {
      case "3":
        return (
          <>
            <AutorenewIcon
              sx={{ fontSize: "20px" }}
              className="text-blue-600 mr-1"
            />
          </>
        );
      default:
        return (
          <>
            <AccessTimeFilledIcon
              sx={{ fontSize: "18px" }}
              className="text-yellow-600 mr-1"
            />
          </>
        );
    }
  };

  const [showRowEditable, setShowRowEditable] = useState(false);
  const [otSelected, setOtSelected] = useState();
  const formik = useFormik({
    initialValues: {
      cmd_id: "",
      tra_cmdrol:
        (otSelected && otSelected.tra_cmdrol) || trabajadorSelected.tra_emprol,
      via_otrcod: "",
      utr_plautr: "",
      via_nviaje: "",
      cmc_ingreso: (otSelected && otSelected.cmc_ingreso) || "",
      cmc_salida: (otSelected && otSelected.cmc_salida) || "",
      cmc_comida: "",
      cmc_hormod: "",
      cmc_hormoi: 0,
      cmc_horede: 0,
      cmc_regusu: "",
    },
    onSubmit: (values) => {
      values.cmc_regusu = USERNAME_LOCAL;

      values.cmd_id = otSelected.cmd_id;
      values.via_otrcod = otSelected.via_otrcod;
      values.utr_plautr = otSelected.utr_plautr;
      values.via_nviaje = otSelected.via_nviaje;
      values.cmc_comida = values.almuerzo ? "S" : "N";
      values.cmc_hormod =
        diferenciaHorasString(
          convertirDateToTimeString(new Date(values.cmc_ingreso)),
          convertirDateToTimeString(new Date(values.cmc_salida))
        ) - (values.almuerzo ? 1 : 0);

      delete values.horaIngreso;
      delete values.horaSalida;

      console.log(values);
      let listaOTAsg = [...listaOTAsignadas];

      listaOTAsg = listaOTAsg.filter((o) => o.via_otrcod !== values.via_otrcod);

      listaOTAsg.push(values);

      listaOTAsg = ordenarAlfabeticamente(listaOTAsg, "via_otrcod");

      setListaOTAsignadas(listaOTAsg);
      setShowRowEditable(false);
      setBtnDisabled(false);
    },
    validate: (values) => {
      const errors = {};
      if (otSelected) {
        let thisViaje = viajes.result.find(
          (v) => v.via_otrcod === values.via_otrcod
        );
        if (
          convertirDateToTimeString(values.cmc_ingreso) <
          convertirDateToTimeString(thisViaje.via_partida)
        )
          errors.cmc_ingreso =
            "La Hora de inicio no puede ser inferior a la hora de partida de la OT";

        if (
          convertirDateToTimeString(values.cmc_salida) <
          convertirDateToTimeString(thisViaje.via_partida)
        )
          errors.cmc_salida =
            "La Hora final no puede ser inferior a la hora de partida de la OT";

        if (
          convertirDateToTimeString(values.cmc_ingreso) >
          convertirDateToTimeString(thisViaje.via_llegada)
        )
          errors.cmc_ingreso =
            "La Hora de inicio no puede ser superior a la hora de llegada de la OT";

        if (
          convertirDateToTimeString(values.cmc_salida) >
          convertirDateToTimeString(thisViaje.via_llegada)
        )
          errors.cmc_salida =
            "La Hora final no puede ser superior a la hora de llegada de la OT";
      }

      if (
        convertirDateToTimeString(values.cmc_ingreso) ===
        convertirDateToTimeString(values.cmc_salida)
      )
        errors.cmc_salida =
          "La Hora de inicio no puede ser igual a la hora final de trabajo";

      if (values.cmc_hormod < 0) errors.cmc_hormod = "No puede ser menor a 0";

      return errors;
    },
  });

  const screenWidth = window.innerWidth;
  const inputStylesTimePicker = {
    padding: "0.25em",
    width: () => {
      switch (true) {
        case screenWidth > 1500:
          return "50%";
        case screenWidth > 1000:
          return "80%";
        default:
          return "100%";
      }
    },
  };

  const handleSelectOTEdit = (ot) => {
    setOtSelected(ot);
    setShowRowEditable(true);
    setErrorMessage(null);
    setBtnDisabled(true);
    formik.setErrors({});
    formik.setValues({
      cmc_id: trabajadorSelected.cmc_id,
      cmd_id: ot.cmd_id,
      cmc_ingreso: ot.cmc_ingreso,
      cmc_salida: ot.cmc_salida,
      cmc_hormoi: 0,
      cmc_horede: 0,
      cmc_regusu: USERNAME_LOCAL,
      tra_cmdrol: ot.tra_cmdrol,
      via_otrcod: ot.via_otrcod,
      utr_plautr: ot.utr_plautr,
      via_nviaje: ot.via_nviaje,
      cmc_comida: ot.cmc_comida,
      via_partida: ot.via_partida,
      via_llegada: ot.via_llegada,
      cmc_hormod: ot.via_tot_horas,
      almuerzo: ot.cmc_comida === "S",
    });
  };

  return (
    <div>
      <div className="block md:flex justify-between px-2 mb-2 items-center">
        <div className="text-sm flex space-x-2">
          <label htmlFor="" className="font-semibold">
            Trabajador:{" "}
          </label>
          <div>{trabajadorSelected && trabajadorSelected.tra_nombre}</div>
        </div>
        <div className="text-sm flex space-x-2">
          <label htmlFor="" className="font-semibold">
            Rol:{" "}
          </label>
          <div>{trabajadorSelected && trabajadorSelected.rol_nombre}</div>
        </div>
        <div className="text-sm flex space-x-2">
          <label htmlFor="" className="font-semibold">
            Horas Laboradas:{" "}
          </label>
          <div>{trabajadorSelected && trabajadorSelected.hor_laborado}</div>
        </div>
      </div>
      <div className="modal-children-content">
        <TableCustom
          cols={BANDEJA_LLENADO_HORAS_PAGE.tableOTHeaders}
          maxHeight={30}
          mini={true}
        >
          {!loadingTableViajes &&
            viajes.result &&
            viajes.result.map(
              (viaje) =>
                !isSelected(viaje) &&
                viaje.utr_plautr &&
                viaje.via_tot_horas > 0 && (
                  <tr key={viaje.via_otrcod}>
                    <td>{viaje.via_otrcod}</td>
                    <td>
                      {viaje.utr_plautr} - {viaje.via_nviaje}
                    </td>
                    <td className="text-center">
                      {viaje.via_partida &&
                        convertirDateToTimeString(viaje.via_partida)}
                    </td>
                    <td className="text-center">
                      {viaje.via_llegada &&
                        convertirDateToTimeString(viaje.via_llegada)}
                    </td>
                    <td className="text-center">
                      {viaje.via_tot_horas && viaje.via_tot_horas.toFixed(2)}
                    </td>
                    <td>{estadosOT(viaje.via_otrest)}</td>
                    <td>
                      <Checkbox
                        sx={{ padding: "0 4px" }}
                        size="small"
                        onChange={(e) => handleCheckOT(e.target.checked, viaje)}
                        checked={isSelected(viaje)}
                      />
                    </td>
                  </tr>
                )
            )}
        </TableCustom>
        <br />

        {trabajadorSelected.tra_emprol == 1 && <div className="w-full mb-4">
          <div className="col xs:flex w-full xs:space-x-4 justify-start items-center">
            <label htmlFor="" className="w-auto">
              Horas de Mano de Obra Indirecta:{" "}
            </label>
            <input
              type="number"
              className="form-container-group-content-input lg:w-48"
              value={horasMOICustom}
              onChange={(e) => setHorasMOICustom(parseFloat(e.target.value))}
              min={1}
            />
          </div>
        </div>}
        <TableCustom
          cols={BANDEJA_LLENADO_HORAS_PAGE.tableOTAsignadasHeaders}
          maxHeight={30}
          mini={true}
        >
          {listaOTAsignadas &&
            listaOTAsignadas.map((ot) => {
              return (
                <tr key={ot.via_otrcod}>
                  <td>{ot.via_otrcod}</td>
                  <td>
                    {ot.utr_plautr} - {ot.via_nviaje}
                  </td>
                  <td>
                    <div>{convertirDateToTimeString(ot.via_partida)}</div>
                    <div>{convertirDateToTimeString(ot.via_llegada)}</div>
                  </td>
                  {showRowEditable &&
                  ot.via_otrcod === otSelected.via_otrcod ? (
                    <>
                      <td>
                        <select
                          value={formik.values.tra_cmdrol}
                          onChange={formik.handleChange}
                          name="tra_cmdrol"
                        >
                          {roles &&
                            roles.map((r) => (
                              <option value={r.id}>{r.rol_nombre}</option>
                            ))}
                        </select>
                      </td>
                      <td>
                        <div className="flex flex-col items-center">
                          <TimePickerCustomComponent
                            labelTitle=""
                            styles={inputStylesTimePicker}
                            valueTime={formik.values.cmc_ingreso}
                            minTime={ot.via_partida}
                            maxTime={ot.via_llegada}
                            nameValue="cmc_ingreso"
                            formik={formik}
                          />
                          {formik.errors.cmc_ingreso && (
                            <span className="form-container-group-content-span-error xs:text-xs">
                              {formik.errors.cmc_ingreso}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col items-center">
                          <TimePickerCustomComponent
                            labelTitle=""
                            styles={inputStylesTimePicker}
                            minTime={formik.values.cmc_ingreso}
                            maxTime={ot.via_llegada}
                            valueTime={formik.values.cmc_salida}
                            nameValue="cmc_salida"
                            formik={formik}
                          />
                          {formik.errors.cmc_salida && (
                            <span className="form-container-group-content-span-error xs:text-xs">
                              {formik.errors.cmc_salida}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <Switch
                          onChange={(e) =>
                            formik.setFieldValue("almuerzo", e.target.checked)
                          }
                          checked={formik.values.almuerzo}
                        />
                      </td>
                      <td>
                        <div>
                          {diferenciaHorasString(
                            convertirDateToTimeString(
                              new Date(formik.values.cmc_ingreso)
                            ),
                            convertirDateToTimeString(
                              new Date(formik.values.cmc_salida)
                            )
                          ) - (formik.values.almuerzo ? 1 : 0)}
                        </div>
                      </td>
                      <td>
                        <button onClick={formik.handleSubmit} type="button">
                          <CheckCircleIcon className="text-green-600" />
                        </button>
                        <button
                          onClick={() => {
                            setShowRowEditable(false);
                            setOtSelected(null);
                            setBtnDisabled(false);
                          }}
                        >
                          <CancelIcon className="text-red-600" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        {ot.rol_nombre ||
                          roles.filter(
                            (r) => r.id.toString() === ot.tra_cmdrol
                          )[0].rol_nombre}
                      </td>
                      <td className="text-center">
                        {ot.cmc_ingreso &&
                          convertirDateToTimeString(ot.cmc_ingreso)}
                      </td>
                      <td className="text-center">
                        {ot.cmc_salida &&
                          convertirDateToTimeString(ot.cmc_salida)}
                      </td>
                      <td>{ot.cmc_comida === "S" ? "SI" : "NO"}</td>
                      <td>{ot.cmc_hormod}</td>
                      <td>
                        <button onClick={() => handleSelectOTEdit(ot)}>
                          <EditIcon className="text-blue-700" />
                        </button>
                        <button onClick={(e) => handleCheckOT(false, ot)}>
                          <DeleteIcon className="text-red-600" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
        </TableCustom>
      </div>
      <div className="w-full flex items-end justify-end">
        <div className="px-4 font-semibold text-sm">
          Total horas de Mano de Obra Directa:
        </div>
        <div className="px-4">
          {listaOTAsignadas.reduce(
            (total, current) => total + current.cmc_hormod,
            0
          )}
        </div>
      </div>
      {errorMessage && (
        <div className="form-container-group-content-span-error w-full text-center p-2">
          {errorMessage}
        </div>
      )}
      <div className="form-buttons-container">
        <button
          type="button"
          className="form-buttons-btn form-buttons-btn-white"
          onClick={() => setOpenModal(false)}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`form-buttons-btn form-buttons-btn-red ${
            btnDisabled && "form-buttons-btn-disabled"
          }`}
          onClick={() => onAsignarOTs()}
          disabled={btnDisabled}
        >
          Asignar
        </button>
      </div>
    </div>
  );
};

export default FormAsignarOTComponent;
