export const AGRUPAR_ORDENES_DESPACHO_PAGE = {
  titlePage: "AGRUPAR ORDEN DE DESPACHO",
  tableListOrdenes: [
    "Ord. Despacho",
    "Pedido",
    "Canal",
    "Cliente",
    "Ord. Compra",
    "Tienda",
    "Vol. m3",
    "Bultos",
    "Peso",
    "Monto S/.",
    "Dirección de Entrega",
    "Rango Hora",
    "Grupo",
    "",
  ],
  formParticionarOrdenesDespacho: {
    titleForm: "Particionar Ordenes de Despacho",
    canal_label: "Canal:",
    cliente_label: "Cliente:",
    numPedido_label: "N° Pedido:",
    numOrden_label: "N° Orden:",
    emisionOrden_label: "Emisión Orden:",
    advertenciaText:
      "Una vez particionada la Orden de Despacho se eliminará y tendrá que volverla a importar.",
    copyOrderText: (order) =>
      `Recomendamos copiar el código de la Orden de Despacho, ${order} , para su posterior búsqueda.`,
  },
  detailsOrdenDespacho: {
    canal_label: "Canal:",
    rucCliente_label: "RUC:",
    cliente_label: "Cliente:",
    direccion_label: "Dir. Entrega:",
    numPedido_label: "N° Pedido:",
    numOrden_label: "N° Orden:",
    emisionOrden_label: "Fec. Emisión OD:",
    observacion_label: "Observación:",
    almacen_label: "Almacén:",
    importeTotal_label: "Importe Total:",
    voluemn_label: "Volumen (m3):",
    bultos_label: "Bultos:",
    peso_label: "Peso:",
    rangoHora_label: "Rango Hora:",
    tableHeaders: [
      "N°",
      "Item",
      "Cantidad",
      "Peso (tn)",
      "Vol. (m3)",
      "Importe",
    ],
  },
};

export const ASIGNAR_VEHICULO_PAGE = {
  titlePage: "ASIGNAR VEHICULO",
  table_grupos_titles: (isruta = false) => {
    let lista = [
      "GRUPO",
      "SEDE",
      "VOLUMEN (m3)",
      "BULTOS",
      "PESO (TN)",
      "N° ORDENES",
      "MONTO TOTAL",
      "DISTRITO MAS LEJANO",
      "VEHÍCULO",
    ];
    
    if (!isruta) lista.push("ACOPLE");

    if (isruta) lista.push("RUTA");

    lista.push("");

    return lista;
  },
  tableMobile_grupos_titles: ["GRUPO", " ", "VEHÍCULO", ""],
};

export const GGUIA_REMISION_REMITENTE_PAGE = {
  titlePage: "IMPORTAR GUIA DE REMISIÓN DE REMITENTE",
  filtroFechaSalidaLabel: "Fecha de inicio de Traslado:",
  btnImportarGRR: "Importar GRR",
  msgConfirmacionImportar:
    "¿Estás seguro de Importar las Guías de Remisión de Remitente para las Ordenes de Despacho?",
  titleModalReAgrupar: "¿Estás seguro de reagrupar las Ordenes de Despacho?",
  msgConfirmacionReAgrupar:
    "Al ReAgrupar las Ordenes de Despacho se hará un recalculo del distrito mas lejano",
  titleModalImportarGRR: "Importar Guías de Remisión de Remitente",
  tbGuiasRemisionHeaders: [
    "CLIENTE",
    "N° GRR",
    "AGENCIA",
    "N° ORD",
    "GRUPO",
    "",
  ],
};

export const GENERAR_OT_Y_GRT_PAGE = {
  titlePage: "GENERAR ORDEN DE TRABAJO Y GUIA DE REMISION DE TRANSPORTISTA",
  filtroFechaSalidaLabel: "Fecha de inicio de Traslado:",
  buttonGenerarOTandGRT: "Generar OT y GRT",
  tableHeaders: [
    "VEHÍCULO",
    "",
    "CHOFER",
    "N° LICENCIA",
    "N° ODS",
    "N° VIAJE",
    "VOL. (m3)",
    "RUTA",
    "TARIFA",
    "N° OT",
    "N° GRT",
    "",
  ],
  modalEditarChofer: {
    titleModal: "Editar Chofer",
    btnAceptar: "Asignar",
  },
  modalOT: {
    title: "Generar OT y GRT",
    msgConfirmacion: "¿Estás seguro de generar las OT?",
  },
  modalAnular: {
    title: "Anular Guías",
    msgConfirmacion: "¿Estás seguro de anular las siguientes guías?",
    anularOTyGRT: "Anular OT y GRT",
    anularTodo: "Anular OT, GRT y GRR",
  },
  modalShowGuias: {
    title: "Ver Guías",
  },
  modalDetailViaje: {
    titleModal: "Detalle del Viaje",
    titleTableODs: "Lista de Ordenes de Despacho",
  },
};

export const CARRITO_ORDENES_DESPACHO = {
  title: "Ordenes de Despacho Seleccionadas",
  tabla_titulos: [
    "N°",
    "OD",
    "Vol m3",
    "Bultos",
    "Peso",
    "Cliente",
    "Dirección de Entrega",
    "",
  ],
  sede_label: "Punto de salida:",
  fecha_entrega_label: "Fecha de inicio de Traslado:",
  observacion_label: "Observación",
};

export const FORM_ASIGNAR_VEHICULO = {
  titleModal: (placa) => `Cierre de Vehículo ${placa}`,
  vehiculo_label: "Vehículo:",
  volumen_label: "Volumen (m3):",
  fechaSalida_label: "Fecha de inicio de Traslado:",
  horaSalida_label: "Hora de Salida:",
  fechaRetorno_label: "Fecha de Retorno:",
  fechaCarga_label: "Fecha de Carga:",
  horaCarga_label: "Hora de Carga:",
  nPalets_label: "N° Palets:",
  observacion_label: "Observación:",
};

export const VEHICULOS_DISPONIBLES_COMPONENT_TEXT = {
  title: "Vehículos Disponibles",
  estado_0: { value: 0, text: "" },
  estado_1: { value: 1, text: "En Proceso" },
  estado_2: { value: 2, text: "Cerrada" },
  estado_3: { value: 3, text: "Con OT" },
  table_titles: [
    "VEHÍCULO",
    "N° ODS",
    "N° VIAJE",
    "VOL. ASIG. (m3)",
    "VOL. DISP. (m3)",
    "RUTA",
    "TARIFA",
    "",
    "",
  ],
  tableMobile_title: ["VEHÍCULO", ""],
  modalConfirmarVehiculoTitle: "Asigar Vehiculo",
  modalConfirmarVehiculoDescription: (
    <>
      Los grupos asignados han{" "}
      <span className="text-lg font-bold">sobrepasado la capacidad</span> del
      vehículo. <br />
      ¿Estás seguro de cerrar este vehículo?
    </>
  ),
};

export const LIST_ORDENES_DESPACHO_COMPONENT_TEXT = {
  tableHeaders: (titlePage, showOptions = true) => {
    let headers = [];
    //if (!titlePage.match(ASIGNAR_VEHICULO_PAGE.titlePage)) headers.push("");

    headers.push("Ord. Despacho");

    if (!titlePage.match(ASIGNAR_VEHICULO_PAGE.titlePage))
      headers.push("Pedido");

    headers = [
      ...headers,
      "Canal",
      "Cliente",
      "Vol. m3",
      "Bultos",
      "Peso (Tn)",
      "Monto S/.",
      "Ord. compra",
      "Tienda",
      "Dirección de Entrega",
      "Rango Hora",
    ];
    if (
      titlePage.match(AGRUPAR_ORDENES_DESPACHO_PAGE.titlePage) //|| titlePage.match(GGUIA_REMISION_REMITENTE_PAGE.titlePage)
    )
      headers.push("Grupo");
    if (titlePage.match(GGUIA_REMISION_REMITENTE_PAGE.titlePage)) {
      headers = [...headers, "", "Guia Remisión Remitente"];
      //headers = [...headers, "", "Vehículo", "Guia Remisión Remitente"];
      //headers.push("Guia Remisión Remitente");
    }
    if (titlePage.match(AGRUPAR_ORDENES_DESPACHO_PAGE.titlePage))
      headers.push("");
    return headers;
  },
};

export const BANDEJA_MARCACIONES_PAGE = {
  title: "BANDEJA DE MARCACIONES (OFISIS)",
  filtroFechaLabel: "Fecha de marcación: ",
  btnDownloadMarcaciones: "Importar",
  modalDescarga: {
    titleModalDescarga: "Importar Marcaciones de Ofisis",
    msgConfirmacion: "¿Estás seguro de importar las Marcaciones desde Ofisis?",
  },
  tableMarcacionesHeaders: [
    "ID",
    "NOMBRES Y APELLIDOS",
    "N° DOC",
    "ROL",
    "H.A. Ini",
    "H.M. Entra",
    "H.M. Salida",
    "¿Almorzó?",
    "Horas Laboradas",
    "Usuario",
    "",
  ],
  rolDefault: "Ayudante",
  headersExportExcel: [
    "cia_cod",
    "suc_cod",
    "tra_codigo",
    "tra_nombre",
    "tra_rol",
    "rol_nombre",
    "mar_fch_marcado",
    "mar_hor_ingreso",
    "mar_hor_salida",
    "mar_hor_refrigerio",
    "mar_hor_comida",
    "mar_hor_laborado",
    "mar_emp_turno",
    "mar_hor_inicio",
    "mar_estado",
    "mar_est",
    "mar_migusu",
    "mar_migfch",
    "mar_delusu",
    "mar_delfch",
  ],
};

export const LLENADO_OT_PAGE = {
  title: "Gestión de OT".toUpperCase(),
  filtroFechaLabel: "Fecha de inicio de Traslado: ",
  btnSincronizarSAP: "SAP",
  btnCierreMasico: "Cerrar OT's",
  tableOTHeaders: [
    "N° OT",
    "Vehículo",
    "",
    "Fecha",
    "H. Ini",
    "H. Fin",
    "H. Laboradas",
    "Km. Ini",
    "Km. Fin",
    "Km. Reco",
    "EST/DES",
    "Estado",
    "",
    "GRT",
    "SAP",
    "Usuario",
    "",
  ],
  tableTrabajadoresAsignados: [
    "Empleado",
    "H. Laboradas",
    "MOD",
    "MOI",
    "EST/DES",
  ],
  formLlenadoOT: {
    title: "Llenado de OT",
    horaInicio_label: "Hora de Inicio",
    horaFinal_label: "Hora final",
    horas_label: "Horas",
    kmInicial_label: "Km. inicial",
    kmFinal_label: "Km. final",
    kmRecorrido_label: "Km. Recorrido",
    almuerzo_label: "¿Almorzó?",
  },
  formLlenadoGRT: {
    title: "Llenado de GRT",
    tableHeaders: [
      "GRT",
      "DESTINATARIO",
      "H. Llegada",
      "H.I. Des",
      "H.F. Des",
      "H. Salida",
      "Observación",
      "",
    ],
    horaLlegada_label: "Hora Llegada",
    horaIniDescarga: "Hora Inicio de Descarga",
    horaFinDescarga: "Hora Fin de Descarga",
    horaSalida: "Hora Salida",
  },
  modalCierreOT: {
    title: "Cerrar OT",
    msgConfirmacion: "¿Seguro desea cerrar la OT?",
  },
  modalSyncSAP: {
    title: "Sincronizar con SAP",
    msgConfirmacion: "¿Seguro desea sincronizar las OTs con SAP?",
  },
  modalOpenOT: {
    title: "Abrir OT",
    msgConfirmacion: "¿Seguro desea abrir la OT?",
  },
  headersExportExcel: [
    "IdViaje",
    "CIA_CODCIA",
    "SED_SEDCOD",
    "UTR_PLAUTR",
    "CHO_CODCHO",
    "VIA_NVIAJE",
    "VIA_NROODE",
    "VIA_DESFCH",
    "VIA_RETFCH",
    "VIA_VOLUMEN",
    "VIA_BULTOS",
    "VIA_PESO",
    "VIA_MONTO",
    "VIA_ESTADO",
    "UTR_CARTON",
    "UTR_CARVOL",
    "UTR_TERCERO",
    "RUT_CODIGO",
    "RUT_PRECIO",
    "VIA_OTRCOD",
    "VIA_OTREST",
    "CHO_NOMBRE",
    "CHO_NROLIC",
    "VIA_PARTIDA",
    "VIA_LLEGADA",
    "VIA_TOT_HORAS",
    "VIA_DESHOR",
    "VIA_KLMINI",
    "VIA_KLMFIN",
    "VIA_TOT_KLM",
    "VIA_OTRUSU",
    "VIA_OTRFCH",
    "IdGRT",
    "GRT_CODIGO",
    "GRT_HOR_LLEGADA",
    "GRT_HOR_INI_DESCARGA",
    "GRT_HOR_FIN_DESCARGA",
    "GRT_HOR_SALIDA",
    "GRT_HOR_DESCARGA",
    "GRT_HOR_TOTAL",
    "GRT_OBSERV",
    "GRT_ESTADO",
    "GRT_INSUSU",
    "GRT_INSCH",
    "GRT_UPDUSU",
    "GRT_UPDFCH",
    "GRT_DELUSU",
    "GRT_DELFCH",
    "GRT_KLM_INI",
    "GRT_KLM_LLG",
    "GRT_KLM_TOTAL",
  ],
  headersExportExcelGRT: [
    "idgrt",
    "idviaje",
    "grt_codigo",
    "grt_hor_llegada",
    "grt_hor_ini_descarga",
    "grt_hor_fin_descarga",
    "grt_hor_salida",
    "grt_hor_descarga",
    "grt_hor_total",
    "grt_observ",
    "grt_estado",
    "grt_insusu",
    "grt_insch",
    "grt_updusu",
    "grt_updfch",
    "grt_delusu",
    "grt_delfch",
    "grt_klm_ini",
    "grt_klm_llg",
    "grt_klm_total",
  ],
};

export const BANDEJA_LLENADO_HORAS_PAGE = {
  titlePage: "BANDEJA DE REGISTRO DE HORAS EN OT",
  filtroFechaLabel: "Fecha de Inicio de Traslado",
  btnIniciarTareo: "Iniciar Tareo",
  btnCalculateAllOTs: "Calcular OT's",
  btnSincronizarSAP: "SAP",
  limit: 80,
  modalTareo: { msgConfirmacion: "¿Estás seguro de iniciar el tareo?" },
  modalTerminarCMC: { msgConfirmacion: "¿Seguro desea terminar el registro?" },
  modalOpenCMC: { msgConfirmacion: "¿Estás seguro de volver a editar?" },
  modalSyncSAP: {
    title: "Sincronizacion con SAP",
    msgConfirmacion: "¿Seguro desea sincronizar con SAP?",
  },
  tableMainHeaders: [
    "N°",
    "TRABAJADOR",
    "H. Laborado",
    "¿Tareó?",
    "Rol",
    "OT",
    "Vehículo",
    "H. Inicial",
    "H. Final",
    "",
    //"","","","","","",
    "MOD",
    "MOI",
    "Est/Deses",
    "",
  ],
  subTableMainHeaders: [
    "Rol",
    "OT",
    "Vehículo",
    "Viaje",
    "H. Inicial",
    "H. Final",
    "MOD",
    "MOI",
    "Est/Deses",
    "",
  ],
  tableDivHeaders: [
    { colSpan: 1, name: "N°" },
    { colSpan: 1, name: "TRABAJADOR" },
    { colSpan: 1, name: "N° DOC" },
    { colSpan: 1, name: "ROL" },
    { colSpan: 1, name: "H. Laborado" },
    { colSpan: 1, name: "¿Tareó?" },
    { colSpan: 1, name: "Rol" },
    { colSpan: 1, name: "N° OT" },
    { colSpan: 1, name: "Vehículo" },
    { colSpan: 1, name: "Viaje" },
    { colSpan: 1, name: "H. Inicial" },
    { colSpan: 1, name: "H. Final" },
    { colSpan: 1, name: "MOD" },
    { colSpan: 1, name: "MOI" },
    { colSpan: 1, name: "Est/Deses" },
    { colSpan: 1, name: "" },
  ],
  tableDivFlexHeaders: [
    { colSpan: 1, name: "N°" },
    { colSpan: 1, name: "TRABAJADOR" },
    { colSpan: 1, name: "N° DOC" },
    { colSpan: 1, name: "ROL" },
    { colSpan: 1, name: "H. Laborado" },
    { colSpan: 1, name: "¿Tareó?" },
    { colSpan: 1, name: "Rol" },
    { colSpan: 1, name: "N° OT" },
    { colSpan: 1, name: "Vehículo" },
    { colSpan: 1, name: "Viaje" },
    { colSpan: 1, name: "H. Inicial" },
    { colSpan: 1, name: "H. Final" },
    { colSpan: 1, name: "MOD" },
    { colSpan: 1, name: "MOI" },
    { colSpan: 1, name: "Est/Deses" },
    { colSpan: 1, name: "" },
  ],
  tableDivFlexHeaders2: [
    { width: 10, name: "N°" },
    { width: 400, name: "TRABAJADOR" },
    { width: 150, name: "N° DOC" },
    { width: 150, name: "ROL" },
    { width: 100, name: "H. Laborado" },
    { width: 100, name: "¿Tareó?" },
    { width: 100, name: "Rol" },
    { width: 100, name: "N° OT" },
    { width: 100, name: "Vehículo" },
    { width: 100, name: "Viaje" },
    { width: 100, name: "H. Ini." },
    { width: 100, name: "H. Fin." },
    { width: 100, name: "MOD" },
    { width: 100, name: "MOI" },
    { width: 100, name: "Est/Deses" },
    { width: 100, name: "" },
  ],
  tableOTHeaders: [
    "N° OT",
    "Vehículo",
    "H. Ini",
    "H. Fin",
    "H. Laboradas",
    "Estado",
    "",
  ],
  tableOTAsignadasHeaders: [
    "OT",
    "Vehículo",
    "Hora Trabajo",
    "Rol",
    "H. Inicial",
    "H. Final",
    "Almorzó",
    "H. Laboradas",
    "",
  ],
  headersExcel: [
    "LINEA",
    "CODIGO TRABAJADOR",
    "NOMBRE DE TRABAJADOR",
    "CENTRO DE COSTO",
    "TOTAL HORAS DE ASISTENCIA",
    "HORAS DE TAREO",
    "HORAS DE REFRIGERIO",
    "HORAS DE TAREO INDIRECTO",
    "TOTAL HORAS TAREO",
    "DIFERENCIA",
  ],
};

export const PRE_ORDEN_PAGE = {
  headersExcel: [
    "FECHA",
    "VEHICULO",
    "HORA DE SALIDA",
    "HORA DE CARGA",
    "HORA DE RETORNO",
    "CLIENTE - CITA",
  ],
  times: [
    {
      order: 5,
      data: "5:00am",
    },
    {
      order: 6,
      data: "6:00am",
    },
    {
      order: 7,
      data: "7:00am",
    },
    {
      order: 8,
      data: "8:00am",
    },
    {
      order: 9,
      data: "9:00am",
    },
    {
      order: 10,
      data: "10:00am",
    },
    {
      order: 11,
      data: "11:00am",
    },
    {
      order: 12,
      data: "12:00pm",
    },
    {
      order: 13,
      data: "1:00pm",
    },
    {
      order: 14,
      data: "2:00pm",
    },
    {
      order: 15,
      data: "3:00pm",
    },
    {
      order: 16,
      data: "4:00pm",
    },
    {
      order: 17,
      data: "5:00pm",
    },
    {
      order: 18,
      data: "6:00pm",
    },
  ],
};
