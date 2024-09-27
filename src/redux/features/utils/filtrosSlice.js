import { createSlice } from "@reduxjs/toolkit";

/* export const fetchData = createAsyncThunk('data/fetchData', async () => {
  const response = await fetch('http://localhost:5006/api/Solicitudes/lista/sedes');
  const data = await response.json();
  return data;
});
 */
export const filtrosSlice = createSlice({
  name: "filtros",
  initialState: {
    filtrosOrdenesDespacho: {
      fechaInicio: new Date(),
      fechaFinal: new Date(),
      filtro1: "",
      filtro2: "",
      filtro3: "",
      orderBy: "volumen",
      estados: "",
      btnFechaSelected: "btnFechaToday",
      canales: "",
    },
    filtroMarcaciones:{
      texto:"",
      rol: ""
    }
  },
  reducers: {
    setFechaInicio: (state, action) => {
      state.filtrosOrdenesDespacho.fechaInicio = action.date;
      state.filtrosOrdenesDespacho.fechaFinal =
        action.date > state.filtrosOrdenesDespacho.fechaFinal
          ? date
          : state.filtrosOrdenesDespacho.fechaFinal;
    },
    setFechaFinal: (state, action) => {
        state.filtrosOrdenesDespacho.fechaFinal = action.date;
      },
  },
});

// Action creators are generated for each case reducer function
export const { getToken } = utilsSlice.actions;

export default utilsSlice.reducer;
