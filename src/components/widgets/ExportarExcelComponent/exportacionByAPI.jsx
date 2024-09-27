import React, { useState } from "react";
import { FaFileExcel } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

import { URL_MASTERLOGIC_API } from "../../../utils/general";
import { ERRORS_TEXT } from "../../../utils/properties.error.text";
import { setMessage } from "../../../redux/features/utils/utilsSlice";
import TooltipCustomComponent from "../TooltipCustomComponent";
import LoaderAllComponent from "../ModalComponent/LoaderAllComponent";

const ExportarExcelAPIComponent = ({
  headers,
  data,
  filename,
  msgTooltip = "Exportar data en Excel",
  isGetData = false,
  getData = [],
  buttonComponent,
}) => {
  const dispatch = useDispatch();

  function parameterExcel(name, headers, data) {
    let params = {
      sheets: [
        {
          sheetName: name,
          settings: {
            moveX: 0,
            moveY: 0,
            headers: headers,
          },
          data: data,
        },
      ],
    };
    return params;
  }

  const generateExcel = async (values) => {
    let url = "/api/general/generate/excel";

    const token = localStorage.getItem("USUARIO_TOKEN");

    return await fetch(`${URL_MASTERLOGIC_API}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values, null, 2),
    });
  };

  function urltoFile(url, filename, mimeType) {
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      });
  }

  async function generarExcel(parameter, filename) {
    await (await generateExcel(parameter)).json().then((response) => {
      //console.log(response);
      let base64 = response.join("/");
      urltoFile(
        "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
          base64,
        "file.xlsx",
        "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ).then(function (file) {
        var objectURL = URL.createObjectURL(file);
        /* let fecha =
          "REPORTE_MESAS_" +
          moment().format("YYMMDD") +
          "_" +
          moment().format("HHmmss"); */
        const exportLinkElement = document.createElement("a");
        exportLinkElement.hidden = true;
        exportLinkElement.download = `${filename}.xlsx`;
        exportLinkElement.href = objectURL;
        exportLinkElement.click();
        URL.revokeObjectURL(objectURL);
      });
    });
    //inactiveLoader();
  }

  const [loaderComponent, setLoaderComponent] = useState(false);

  const getExcel = (dataExcel) => {
    let parameters = parameterExcel("Hoja1", headers, dataExcel);
    generarExcel(parameters, filename).then(() => {
      setLoaderComponent(false);
    });
  };

  const exportarExcel = async () => {
    if (isGetData) {
      setLoaderComponent(true);
      await getData().then((res) => {
        getExcel(res);
        if (res.length < 1) {
          setLoaderComponent(false);
          dispatch(
            setMessage({
              state: true,
              message: ERRORS_TEXT.exportDataError,
              type: ERRORS_TEXT.typeError,
            })
          );
        }
      });
    } else {
      setLoaderComponent(true);
      if (data.length > 0) {
        getExcel(data);
      } else {
        setLoaderComponent(false);
        dispatch(
          setMessage({
            state: true,
            message: ERRORS_TEXT.exportDataError,
            type: ERRORS_TEXT.typeError,
          })
        );
      }
    }
  };

  return (
    <>
      <TooltipCustomComponent title={<span>{msgTooltip}</span>}>
        {buttonComponent ? (
          <>{buttonComponent(exportarExcel)}</>
        ) : (
          <button onClick={() => exportarExcel()} className="">
            <FaFileExcel className="text-green-700 text-xl" />
          </button>
        )}
      </TooltipCustomComponent>
      <LoaderAllComponent open={loaderComponent} setOpen={setLoaderComponent} />
    </>
  );
};

export default ExportarExcelAPIComponent;
