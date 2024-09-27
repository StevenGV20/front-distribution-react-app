// dataSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_DISTRIBUCION, URL_MASTERLOGIC_API } from "../../../utils/general";

// Definir una acción asincrónica para cargar datos desde la API
export const fetchData = createAsyncThunk("sede/fetchData", async () => {
  const token = localStorage.getItem("USUARIO_TOKEN");
  const response = await fetch(
    `${URL_MASTERLOGIC_API}${API_DISTRIBUCION}/listaSedes`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data.result;
});

export const sedeSlice = createSlice({
  name: "sede",
  initialState: {
    lista: [],
    status: "idle",
    error: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lista = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getSedes = (state) => state.sedeState.lista;

export default sedeSlice.reducer;
