import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector, useDispatch } from "react-redux";

import { fetchData } from "../../../redux/features/combos/sedeSlice";

import {
  calcularBultosTotal,
  calcularMontoTotal,
  calcularPesoTotal,
  calcularVolumenTotal,
  convertirDateTimeToDate,
  postFetchFunction,
  postFetchFunctionCustomFunction,
} from "../../../utils/funciones";
import { objOrdenesDespachoEntity } from "../../../api/ordenesDespachoApi";
import { API_DISTRIBUCION, PEN_CURRENCY } from "../../../utils/general";
import { CARRITO_ORDENES_DESPACHO } from "../../../utils/properties.text";
import TableCustom from "../../widgets/TableComponent";
import ModalMessage from "../../widgets/ModalComponent";
import FormEditCargaOrdenDespachoComponent from "../FormEditCargaOrdenDespachoComponent";
import LoaderAllComponent from "../../widgets/ModalComponent/LoaderAllComponent";
import { setMessage } from "../../../redux/features/utils/utilsSlice";

const FormCarritoAgrupacionODComponent = ({
  carritoOrdenesDespacho = objOrdenesDespachoEntity.result,
  handleSelectRow,
  setCarritoOrdenesDespacho,
  setOpenCarritoGrupos,
  setRefreshTable,
}) => {
  registerLocale("es", es);
  setDefaultLocale("es");

  const sedesCombo = useSelector((state) => state.sedeState.lista);
  const dispatch = useDispatch();

  const [openEditOrden, setOpenEditOrden] = useState(false);
  const [ordenSelected, setOrdenSelected] = useState(null);
  const [openLoader, setOpenLoader] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const setOpenMessage = (data) => {
    dispatch(setMessage(data));
  };

  useEffect(() => {
    if (!(sedesCombo.length > 0)) dispatch(fetchData());
  }, []);

  const formik = useFormik({
    initialValues: {
      cia_codcia: "01",
      sed_sedcod: "",
      gru_desfch: new Date(),
      gru_observ: "",
      gru_volumen: calcularVolumenTotal(carritoOrdenesDespacho),
      gru_bultos: calcularBultosTotal(carritoOrdenesDespacho),
      gru_peso: calcularPesoTotal(carritoOrdenesDespacho),
      gru_monto: calcularMontoTotal(carritoOrdenesDespacho),
      gru_nroode: carritoOrdenesDespacho.length,
      gru_insusu: localStorage.getItem("USERNAME"),
      listaOrdenesDespacho: carritoOrdenesDespacho,
      isErrorItems: false,
      provincia: 0,
    },
    validate: (values) => {
      const errors = {};
      // if (!(values.gru_volumen > 0))
      //   errors.gru_volumen = "Debes agregar el volumen a los item";

      // if (!(values.gru_bultos > 0))
      //   errors.gru_bultos = "Debes agregar el bulto a los item";

      if (!(values.gru_peso > 0))
        errors.gru_peso = "Debes agregar el peso a los item";

      if (!(values.sed_sedcod > 0))
        errors.sed_sedcod = "Debes seleccionar una sede";

      if (values.isErrorItems)
        errors.listaOrdenesDespacho =
          "Debes ingresar las cantidades solicitadas en los items";
      return errors;
    },
    onSubmit: (values) => {
      console.log('values', values)
      setOpenLoader(true);
      setBtnDisabled(true)
      let listODs = "";
      values.listaOrdenesDespacho.map(
        (o, index) => (listODs += (index > 0 ? "," : "") + o.id)
      );

      delete values.isErrorItems;
      delete values.volumen;
      delete values.bultos;
      delete values.peso;
      delete values.monto;
      delete values.listaOrdenesDespacho;

      let data = { grupo: values, listaOds: listODs };

      //////console.log(JSON.stringify(data, null, 2));

      const afterPost = (data) => {
        if (data.statusCode === 200) {
          localStorage.setItem("ODSAGRUPAR", null);
          setOpenLoader(false);
          //setCarritoOrdenesDespacho([]);
          setTimeout(() => {
            setRefreshTable((prev) => !prev);
            setOpenCarritoGrupos(false);
            setBtnDisabled(false)
          }, 3000);
        }
      };
      postFetchFunctionCustomFunction(
        `${API_DISTRIBUCION}/grupo/save`,
        data,
        setOpenMessage,
        afterPost
      );
    },
  });

  const formiktest = useFormik({
    initialValues: {
      cia_codcia: "01",
      sed_sedcod: "",
      gru_desfch: new Date(),
      gru_observ: "",
      gru_volumen: calcularVolumenTotal(carritoOrdenesDespacho),
      gru_bultos: calcularBultosTotal(carritoOrdenesDespacho),
      gru_peso: calcularPesoTotal(carritoOrdenesDespacho),
      gru_monto: calcularMontoTotal(carritoOrdenesDespacho),
      gru_nroode: carritoOrdenesDespacho.length,
      gru_insusu: localStorage.getItem("USERNAME"),
      listaOrdenesDespacho: carritoOrdenesDespacho,
      isErrorItems: false,
      provincia: false,
    },
    validate: (values) => {
      const errors = {};
      if (!(values.gru_volumen > 0))
        errors.gru_volumen = "Debes agregar el volumen a los item";

      if (!(values.gru_bultos > 0))
        errors.gru_bultos = "Debes agregar el bulto a los item";

      if (!(values.gru_peso > 0))
        errors.gru_peso = "Debes agregar el peso a los item";

      if (!(values.sed_sedcod > 0))
        errors.sed_sedcod = "Debes seleccionar una sede";

      if (values.isErrorItems)
        errors.listaOrdenesDespacho =
          "Debes ingresar las cantidades solicitadas en los items";
      return errors;
    },
    onSubmit: (values) => {
      setOpenLoader(true);
      setBtnDisabled(true)
      let listODs = "";
      values.listaOrdenesDespacho.map(
        (o, index) => (listODs += (index > 0 ? "," : "") + o.id)
      );

      delete values.isErrorItems;
      delete values.volumen;
      delete values.bultos;
      delete values.peso;
      delete values.monto;
      delete values.listaOrdenesDespacho;

      let data = { grupo: values, listaOds: listODs };

      console.log(data)
      //////console.log(JSON.stringify(data, null, 2));

      // const afterPost = (data) => {
      //   if (data.statusCode === 200) {
      //     localStorage.setItem("ODSAGRUPAR", null);
      //     setOpenLoader(false);
      //     //setCarritoOrdenesDespacho([]);
      //     setTimeout(() => {
      //       setRefreshTable((prev) => !prev);
      //       setOpenCarritoGrupos(false);
      //       setBtnDisabled(false)
      //     }, 3000);
      //   }
      // };
      // postFetchFunctionCustomFunction(
      //   `${API_DISTRIBUCION}/grupo/save`,
      //   data,
      //   setOpenMessage,
      //   afterPost
      // );
    },
  });

  useEffect(() => {
    formik.setFieldValue("listaOrdenesDespacho", carritoOrdenesDespacho);
    formik.setFieldValue(
      "gru_volumen",
      calcularVolumenTotal(carritoOrdenesDespacho)
    );
    formik.setFieldValue(
      "gru_bultos",
      calcularBultosTotal(carritoOrdenesDespacho)
    );
    formik.setFieldValue("gru_peso", calcularPesoTotal(carritoOrdenesDespacho));
    formik.setFieldValue(
      "gru_monto",
      calcularMontoTotal(carritoOrdenesDespacho)
    );
  }, [carritoOrdenesDespacho]);

  const verifyCantidad = (cantidad, index, tipo) => {
    if (!(cantidad > 0)) {
      formik.values.isErrorItems = true;
      return (
        <span className="form-container-group-content-span-error">
          <br />
          Ingresa {tipo}
        </span>
      );
    } else {
      formik.values.isErrorItems = false;
    }
  };

  return (
    <>
      <ModalMessage
        open={openEditOrden}
        setOpen={setOpenEditOrden}
        title={"Editar Carga de la Orden de Despacho"}
        titleBtnAceptar={""}
        showButtons={false}
        onBtnAceptar={() => setOpenEditOrden(false)}
      >
        <FormEditCargaOrdenDespachoComponent
          ordenSelected={ordenSelected}
          setOpenModal={setOpenEditOrden}
          setCarritoOrdenesDespacho={setCarritoOrdenesDespacho}
        />
      </ModalMessage>

      <LoaderAllComponent open={openLoader} setOpen={setOpenLoader} />

      <div className="overflow-scroll overflow-x-hidden max-h-96">
        <div className="desktop">
          <TableCustom cols={CARRITO_ORDENES_DESPACHO.tabla_titulos}>
            {carritoOrdenesDespacho.map((orden, index) => (
              <tr key={orden.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="td-group">
                    <div>{orden.odc_numodc}</div>
                  </div>
                  <div className="td-group">
                    <div>
                      {orden.odc_fecdoc &&
                        convertirDateTimeToDate(orden.odc_fecdoc)}
                    </div>
                  </div>
                </td>
                <td>{orden.odc_volumen}</td>
                <td>{orden.odc_bultos}</td>
                <td>{orden.odc_peso}</td>
                <td>
                  <div>{orden.aux_nomaux}</div>
                  <div>{orden.aux_codaux}</div>
                </td>
                <td>{orden.odc_dirdes}</td>
                <td>
                  {" "}
                  <div className="">
                    <button
                      onClick={() => {
                        setOrdenSelected(orden);
                        setOpenEditOrden(true);
                      }}
                    >
                      <EditIcon className="text-gray-500" />
                    </button>
                    <button
                      onClick={() => {
                        handleSelectRow(orden);
                      }}
                    >
                      <DeleteIcon className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </TableCustom>
        </div>
        {carritoOrdenesDespacho.map((orden, index) => (
          <div className="grid grid-cols-12 md:hidden" key={index}>
            <div className="col-span-1 content-center">{index + 1}</div>
            <div className="td-group-mobile p-2 text-sm col-span-10">
              <div>
                <label>Orden de Despacho:</label>
                <div className="flex space-x-4">
                  <div>{orden.odc_numodc}</div>
                  <div>{convertirDateTimeToDate(orden.odc_fecdoc)}</div>
                </div>
              </div>
              <div>
                <label>Pedido:</label>
                <div className="flex space-x-4">
                  <div>{orden.ppc_numppc}</div>
                </div>
              </div>
              <div>
                <label htmlFor="">Canal:</label> {orden.odc_canal_des}
              </div>
              <div>
                <label>Cliente:</label>
                <div>{orden.aux_nomaux}</div>
                <div>{orden.odc_dirdes}</div>
                <div>{orden.odc_ubigeo}</div>
              </div>
              <div className="block space-x-3">
                <label>Carga:</label>
                <div className="grid grid-cols-2">
                  <div>{orden.odc_volumen}</div>
                  <div>{orden.odc_bultos} bultos</div>
                  <div>{orden.odc_peso}</div>
                  <div>
                    {PEN_CURRENCY}{" "}
                    {orden.odc_imptot && orden.odc_imptot.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 content-center">
              <button onClick={() => setOrdenSelected(orden)}>
                <EditIcon className="text-gray-500 text-center" />
              </button>
              <button
                onClick={() => {
                  handleSelectRow(orden);
                }}
              >
                <DeleteIcon className="text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <form
        className="mt-4 py-4 grid grid-cols-2 space-y-2"
        onSubmit={formik.handleSubmit}
      >
        {formik.errors.listaOrdenesDespacho ? (
          <div className="w-full col-span-2">
            <div className="w-full text-base text-red-500 col-span-2 text-center mb-4">
              {formik.errors.listaOrdenesDespacho}
            </div>
          </div>
        ) : null}

        <div className="col-span-4 grid grid-cols-1 sm:grid-cols-2 space-y-4 sm:space-y-0 items-center">
          <div className="block col-span-1  pr-4 space-y-2">
            <div className="">
              <input type="checkbox" id="provincia" name="provincia" className="mr-2" checked={formik.values.provincia}
                 onChange={(e) =>
                  formik.setFieldValue("provincia", e.target.checked ? 1 : 0)
                } />
              <label htmlFor="provincia">Provincia</label>
            </div>
            <div className="w-full grid sm:grid-cols-4">
              <label htmlFor="" className="col-span-2">
                {CARRITO_ORDENES_DESPACHO.sede_label}
              </label>
              <div className="block col-span-2 ">
                <select
                  type="text"
                  name="sed_sedcod"
                  id="sed_sedcod"
                  value={formik.values.sed_sedcod}
                  onChange={formik.handleChange}
                  autoComplete="given-name"
                  className={`w-full p-2 outline-none border-2 border-blue-600 focus:ring-blue-600 focus:ring-2`}
                >
                  <option value="0">[ Seleccione la Sede ]</option>
                  {sedesCombo.map((sede) => (
                    <option key={sede.sed_codsed} value={sede.sed_codsed}>
                      {sede.sed_descor}
                    </option>
                  ))}
                </select>
                {formik.errors.sed_sedcod ? (
                  <div className="text-sm text-red-500 text-left ml-2">
                    {formik.errors.sed_sedcod}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="w-full grid sm:grid-cols-2">
              <label htmlFor="">
                {CARRITO_ORDENES_DESPACHO.fecha_entrega_label}
              </label>
              <DatePicker
                selected={formik.values.gru_desfch}
                value={formik.values.gru_desfch}
                onChange={(date) => formik.setFieldValue("gru_desfch", date)}
                name="gru_desfch"
                id="gru_desfch"
                selectsStart
                locale="es"
                dateFormat="dd/MM/yyyy"
                popperPlacement="bottom-end"
                className="w-full p-2 border-2 border-blue-600 focus:ring-2 focus: ring-blue-600 outline-none"
              />
              {formik.errors.gru_desfch ? (
                <div className="text-sm text-red-500 col-span-2 text-left ml-2">
                  {formik.errors.gru_desfch}
                </div>
              ) : null}
            </div>
          </div>
          <div className="w-full col-span-1 space-y-2">
            <textarea
              className="border-2 border-gray-700 p-2 outline-none w-full placeholder:text-gray-600"
              rows={4}
              value={formik.values.gru_observ}
              name="gru_observ"
              id="gru_observ"
              onChange={formik.handleChange}
              placeholder={CARRITO_ORDENES_DESPACHO.observacion_label}
            />
          </div>
        </div>
        <div className="col-span-4 grid grid-cols-6 lg:grid-cols-3">
          <div className="w-full col-span-3 sm:col-span-2 lg:col-span-1 flex flex-wrap items-center justify-start">
            <label htmlFor="">Vol. m3</label>
            <input
              type="text"
              value={formik.values.gru_volumen}
              name="gru_volumen"
              className="w-14 p-1 ml-2 text-left"
              readOnly
            />
            {formik.errors.gru_volumen ? (
              <div className="text-sm text-red-500 col-span-2 text-center">
                {formik.errors.gru_volumen}
              </div>
            ) : null}
          </div>
          <div className="w-full col-span-3 sm:col-span-2 lg:col-span-1 flex flex-wrap items-center justify-start">
            <label htmlFor="">Bultos</label>
            <input
              type="text"
              value={formik.values.gru_bultos}
              name="gru_bultos"
              className="w-14 p-1 ml-2 text-left"
              readOnly
            />
            {formik.errors.gru_bultos ? (
              <div className="text-sm text-red-500 col-span-2 text-center">
                {formik.errors.gru_bultos}
              </div>
            ) : null}
          </div>
          <div className="w-full col-span-3 sm:col-span-2 lg:col-span-1 flex flex-wrap items-center justify-start">
            <label htmlFor="">Peso</label>
            <input
              type="text"
              value={formik.values.gru_peso}
              name="gru_peso"
              className="w-24 p-1 ml-2 text-left"
              readOnly
            />
            {formik.errors.gru_peso ? (
              <div className="text-sm text-red-500 col-span-2 text-center">
                {formik.errors.gru_peso}
              </div>
            ) : null}
          </div>
          <div className="w-full col-span-3 sm:col-span-2 lg:col-span-1 flex flex-wrap items-center justify-start">
            <label htmlFor="">N° ODs</label>
            <input
              type="text"
              value={carritoOrdenesDespacho.length}
              className="w-14 p-1 ml-2 text-left"
              name="gru_nroode"
              readOnly
            />
          </div>
          <div className="w-full col-span-6 sm:col-span-2 lg:col-span-1 flex flex-wrap items-center justify-start">
            <label htmlFor="">Monto</label>
            <input
              type="text"
              value={formik.values.gru_monto}
              name="gru_monto"
              className="w-32 p-1 ml-2 text-left"
              readOnly
            />
            {formik.errors.gru_monto ? (
              <div className="text-sm text-red-500 col-span-2 text-center">
                {formik.errors.gru_monto}
              </div>
            ) : null}
          </div>
        </div>
        <div className="col-span-2">
          <button
            className={`w-full mt-4 bg-black py-2 text-white ${btnDisabled && 'bg-gray-300'}`}
            type="submit"
            onClick={formik.handleSubmit}
            disabled={btnDisabled}
          >
            AGRUPAR
          </button>

          {/* <button
            className={`w-full mt-4 bg-black py-2 text-white ${btnDisabled && 'bg-gray-300'}`}
            type="submit"
            onClick={console.log(formiktest.initialValues)}
            disabled={btnDisabled}
          >
            AGRUPAR test
          </button> */}
        </div>
      </form>
    </>
  );
};

export default FormCarritoAgrupacionODComponent;
