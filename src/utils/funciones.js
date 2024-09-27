import axios from "axios";
import { API_DISTRIBUCION, URL_MASTERLOGIC_API } from "./general";
import { ERRORS_TEXT } from "./properties.error.text";

export const calcularVolumenTotal = (ordenes) => {
  let totalVolumen = 0;
  for (let index = 0; index < ordenes.length; index++) {
    totalVolumen += ordenes[index].odc_volumen;
  }
  return totalVolumen;
};

export const calcularMontoTotal = (ordenes) => {
  let totalMonto = 0;
  for (let index = 0; index < ordenes.length; index++) {
    totalMonto += ordenes[index].odc_imptot;
  }
  return totalMonto.toFixed(2);
};

export const calcularPesoTotal = (ordenes) => {
  let totalPeso = 0;
  for (let index = 0; index < ordenes.length; index++) {
    totalPeso += ordenes[index].odc_peso;
  }
  return totalPeso.toFixed(2);
};

export const calcularBultosTotal = (ordenes) => {
  let totalPeso = 0;
  for (let index = 0; index < ordenes.length; index++) {
    totalPeso += ordenes[index].odc_bultos;
  }
  return totalPeso;
};

export const calcularVolumenAsignadoTotal = (grupos) => {
  let totalVolumen = 0;
  for (let index = 0; index < grupos.length; index++) {
    totalVolumen += grupos[index].volumenTotal;
  }
  return totalVolumen;
};

export const buscarCadena = (objeto, cadena) => {
  for (let clave in objeto) {
    if (typeof objeto[clave] === "object") {
      if (buscarCadena(objeto[clave], cadena)) {
        return true;
      }
    } else if (
      typeof objeto[clave] === "string" &&
      objeto[clave].includes(cadena)
    ) {
      return true;
    }
  }
  return false;
};

export const convertirDateToTimeString = (fechaHoraString, utc = false) => {
  const fechaHora = new Date(fechaHoraString);

  // Obtenemos la hora y los minutos
  const horas = utc ? fechaHora.getUTCHours() : fechaHora.getHours();
  const minutos = utc ? fechaHora.getUTCMinutes() : fechaHora.getMinutes();

  // Formateamos la hora en un string
  const horaString = `${horas < 10 ? "0" : ""}${horas}:${
    minutos < 10 ? "0" : ""
  }${minutos}`;

  return horaString;
};

export const parseZonaHoraria = (zonaHorario = 5, fecha) => {
  let fechaLocal = new Date(fecha);
  let fechaGMT5 = new Date(fechaLocal.getTime() - zonaHorario * 60 * 60 * 1000);
  return fechaGMT5;
};

export const convertirTimeStringToDate = (horaString) => {
  if (horaString) {
    // Obtenemos las horas y los minutos desde la cadena
    const [horasStr, minutosStr] = horaString.split(":");
    const horas = parseInt(horasStr, 10);
    const minutos = parseInt(minutosStr, 10);

    // Creamos un objeto de fecha y hora con la fecha actual y la hora de la cadena
    const fechaHora = new Date();
    fechaHora.setHours(horas);
    fechaHora.setMinutes(minutos);

    return fechaHora;
  } else {
    return null;
  }
};

export const convertirDateTimeToDate = (dia) => {
  // Fecha en formato 'YYYY-MM-DD HH:mm:ss.SSS'
  var fecha = new Date(dia);

  // Obtener partes de la fecha
  var year = fecha.getFullYear().toString();
  var month = (fecha.getMonth() + 1).toString().padStart(2, "0"); // El mes está basado en cero, por lo que sumamos 1
  var day = fecha.getDate().toString().padStart(2, "0");

  // Concatenar partes de la fecha en formato 'YYYY-MM-DD'
  var fechaFormateada = year + "-" + month + "-" + day;

  return fechaFormateada; // Salida: '20071009'
};

export const convertirDateTimeToDateYYYYMMDD = (dia) => {
  // Fecha en formato 'YYYY-MM-DD HH:mm:ss.SSS'
  var fecha = new Date(dia);

  // Obtener partes de la fecha
  var year = fecha.getFullYear().toString();
  var month = (fecha.getMonth() + 1).toString().padStart(2, "0"); // El mes está basado en cero, por lo que sumamos 1
  var day = fecha.getDate().toString().padStart(2, "0");

  // Concatenar partes de la fecha en formato 'YYYYMMDD'
  var fechaFormateada = year + month + day;

  return fechaFormateada; // Salida: '20071009'
};

export const diferenciaHorasString = (horaInicioStr, horaFinStr) => {
  // Crear objetos Date para cada hora
  var horaInicio = new Date("1970-01-01T" + horaInicioStr + ":00");
  var horaFin = new Date("1970-01-01T" + horaFinStr + ":00");

  // Calcular la diferencia en milisegundos
  var diferenciaMs = horaFin - horaInicio;

  // Convertir la diferencia de milisegundos a minutos
  var minutos = Math.floor(diferenciaMs / (1000 * 60));

  // Calcular la diferencia en horas en formato decimal
  var horasDecimal = minutos / 60;

  return horasDecimal.toFixed(2);
};

export const convertirHoraFormato12 = (hora24) => {
  // Dividir la cadena en horas y minutos
  var partes = hora24.split(":");
  var horas = parseInt(partes[0], 10);
  var minutos = partes[1];

  // Validar que las horas estén dentro del rango válido
  if (horas < 0 || horas > 23 || minutos < 0 || minutos > 59) {
    throw new Error("Hora no válida");
  }

  // Determinar si es AM o PM
  var meridiano = horas < 12 ? "AM" : "PM";

  // Convertir la hora a formato de 12 horas
  var hora12 = horas % 12;
  hora12 = hora12 === 0 ? 12 : hora12; // Convertir 0 a 12 en formato de 12 horas

  // Construir la cadena en formato de 12 horas
  var horaFormato12 = hora12 + ":" + minutos + " " + meridiano;

  return horaFormato12;
};

export async function enviarOrdenesSeleccionadas(orderIds) {
  // Estructura los datos para que coincidan con lo que espera el backend
  const requestPayload = orderIds.map(id => ({ Id: id }));

  try {
      const response = await fetch(
          `${URL_MASTERLOGIC_API}/api/Distribucion/ordenDespacho/selectToGroupMasivo`,
          {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestPayload)  // Envía la lista de objetos OrdenMasiva
          }
      );

      const data = await response.json();

      if (response.ok) {
          console.log('Solicitud exitosa', data);
      } else {
          console.error('Error en la solicitud:', data);
      }
  } catch (error) {
      console.error('Error en la solicitud:', error);
  }
}


export const redondearDecimales = (numero) => {
  return Math.round(numero * 100) / 100;
};

// export async function getPesoOD(){
//   try {
//     console.log("hola")
//     const token = localStorage.getItem("USUARIO_TOKEN");
//     const response = await fetch(`${URL_MASTERLOGIC_API}/ordenDespacho/listaPesoTotalOD`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (!response.ok) {
//       throw new Error("Error al cargar el archivo JSON");
//     }
//     const data = await response.json().then((data) => {
//       return data;
//     });
//     return data;
//   }
//   catch (error) {
//     console.error("error", error);
//     return error;
//   }
// }
export async function getPesoOD() {
  try {
    const response = await fetch(`${URL_MASTERLOGIC_API}/api/Distribucion/ordenDespacho/listaPesoTotalOD`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = `Error al cargar el archivo JSON: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(data)
    return data;

  } catch (error) {
    console.error("Error:", error);
    return null; // O devuelve un valor predeterminado o un mensaje de error personalizado
  }
}

export async function getTienda(cliente) {
  try {
    const response = await fetch(`${URL_MASTERLOGIC_API}/api/Distribucion/ordenDespacho/tiendabycliente?cliente=${cliente}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = `Error al cargar el archivo JSON: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error:", error);
    return null; // O devuelve un valor predeterminado o un mensaje de error personalizado
  }
}


export async function getFetchFunction(path, setLoadingTable, setData) {
  try {
    const token = localStorage.getItem("USUARIO_TOKEN");
    const response = await fetch(`${URL_MASTERLOGIC_API}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }
    const data = await response.json().then((data) => {
      console.log(data)
      setLoadingTable && setLoadingTable(false);
      return data;
    });
    setData(data);
    return data;
  } catch (error) {
    console.error("error", error);
    setLoadingTable && setLoadingTable(false);
    setData({ result: [] });
    return error;
  }
}

export const postFetchFunction = async (path, values, setOpenMessage) => {
  try {
    const token = localStorage.getItem("USUARIO_TOKEN");
    const response = await fetch(`${URL_MASTERLOGIC_API}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values, null, 2),
    });
    if (!response.ok) {
      setOpenMessage({
        state: true,
        message: ERRORS_TEXT.fetchError,
        type: ERRORS_TEXT.typeError,
      });
      throw new Error("Error al cargar el archivo JSON");
    }
    const data = await response.json();
    setOpenMessage({
      state: true,
      message: data.mensaje,
      type: data.status.toLowerCase(),
    });
  } catch (error) {
    setOpenMessage({
      state: true,
      message: ERRORS_TEXT.fetchError,
      type: ERRORS_TEXT.typeError,
    });
    console.error(error);
    throw error;
  }
};

export const postFetchFunctionCustomFunction = async (
  path,
  values,
  setOpenMessage,
  customFunction
) => {
  try {
    const token = localStorage.getItem("USUARIO_TOKEN");
    console.log(token);
    const response = await fetch(`${URL_MASTERLOGIC_API}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values, null, 2),
    });
    if (!response.ok) {
      setOpenMessage({
        state: true,
        message: ERRORS_TEXT.fetchError,
        type: ERRORS_TEXT.typeError,
      });
      throw new Error("Error al cargar el archivo JSON");
    }
    const data = await response.json();
    setOpenMessage({
      state: true,
      message: data.mensaje,
      type: data.status.toLowerCase(),
    });
    customFunction(data);
  } catch (error) {
    console.error(error);
    setOpenMessage({
      state: true,
      message: "Ocurrio un error. " + error,
      type: "error",
    });
    throw error;
  }
};

export const putFetchFunction = async (path, values, fnActions) => {
  try {
    const token = localStorage.getItem("USUARIO_TOKEN");
    const response = await fetch(`${URL_MASTERLOGIC_API}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values, null, 2),
    });
    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }
    const data = await response.json();
    fnActions(data);
  } catch (error) {
    console.error(error);
  }
};

export const deleteFetchFunction = async (path, values, setOpenMessage) => {
  try {
    const token = localStorage.getItem("USUARIO_TOKEN");
    const response = await fetch(`${URL_MASTERLOGIC_API}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values, null, 2),
    });
    if (!response.ok) {
      setOpenMessage({
        state: true,
        message: ERRORS_TEXT.fetchError,
        type: ERRORS_TEXT.typeError,
      });
      throw new Error("Error al cargar el archivo JSON");
    }
    const data = await response.json();
    ////console.log(data);
    setOpenMessage({
      state: true,
      message: data.mensaje,
      type: data.status.toLowerCase(),
    });
  } catch (error) {
    console.error(error);
    setOpenMessage({
      state: true,
      message: ERRORS_TEXT.fetchError,
      type: ERRORS_TEXT.typeError,
    });
  }
};

export const leftOnlyeArray = (arrayLeft, arrayRight, nomProp) => {
  const nonMatchingItems = arrayLeft.filter(
    (itemA) => !arrayRight.some((itemB) => itemB[nomProp] === itemA[nomProp])
  );
  return nonMatchingItems;
};

export const ordenarAlfabeticamente = (array, nameProp) => {
  return array.sort((a, b) => a[nameProp].localeCompare(b[nameProp]));
};

export const groupByAndCount = (array, prop) => {
  // Usando reduce para agrupar por la propiedad 'prop' y contar
  let groupedCounts = array.reduce((acc, obj) => {
    let key = obj[prop];
    if (!acc[key]) {
      acc[key] = {
        [prop]: key,
        count: 0,
      };
    }
    acc[key].count++;
    return acc;
  }, {});

  // Convertir el objeto de agrupación a un array de objetos
  let result = Object.values(groupedCounts);

  return result;
};

export function generarPeriodos(startYear, startMonth, endYear, endMonth) {
  let periodos = [];
  let currentDate = new Date(startYear, startMonth - 1); // startMonth - 1 porque los meses en JavaScript son indexados desde 0

  while (currentDate <= new Date(endYear, endMonth - 1)) {
    // endMonth - 1 para ajustar el mes final
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // Sumamos 1 porque getMonth() devuelve valores de 0 a 11
    let periodo = `${year}${month.toString().padStart(2, "0")}`; // Aseguramos que el mes tenga dos dígitos
    periodos.push(periodo);

    // Avanzamos al siguiente mes
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Ordenar periodos de forma descendente (de más reciente a más antiguo)
  periodos.sort((a, b) => b.localeCompare(a));

  return periodos;
}

export function getPrimeraFechaDelMes() {
  var hoy = new Date(); // Obtener la fecha actual
  var primerDiaDelMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  return primerDiaDelMes.toISOString().slice(0, 10); // Formato YYYY-MM-DD
}