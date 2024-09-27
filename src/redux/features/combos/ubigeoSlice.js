// dataSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_MAESTRO, URL_MASTERLOGIC_API } from "../../../utils/general";

export const fetchDepartamentos = createAsyncThunk("data/fetchDepartamentos", async () => {
  const token = localStorage.getItem("USUARIO_TOKEN");
  const response = await fetch(
    `${URL_MASTERLOGIC_API}${API_MAESTRO}/lista/departamentos`,
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

export const fetchProvincias = createAsyncThunk("data/fetchProvincias", async (departamento='') => {
  const token = localStorage.getItem("USUARIO_TOKEN");
  const response = await fetch(
    `${URL_MASTERLOGIC_API}${API_MAESTRO}/lista/provinciasByDepartamento?departamento=${departamento}`,
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

export const fetchDistritos = createAsyncThunk("data/fetchDistritos", async (provincia='') => {
  const token = localStorage.getItem("USUARIO_TOKEN");
  const response = await fetch(
    `${URL_MASTERLOGIC_API}${API_MAESTRO}/lista/distritosByProvincia?provincia=${provincia}`,
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

export const ubigeoSlice = createSlice({
  name: "ubigeo",
  initialState: {
    departamentos: [],
    provincias: [],
    distritos: [],
    status: "idle",
    error: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartamentos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDepartamentos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.departamentos = action.payload;
      })
      .addCase(fetchDepartamentos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProvincias.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProvincias.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.provincias = action.payload;
      })
      .addCase(fetchProvincias.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchDistritos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDistritos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.distritos = action.payload;
      })
      .addCase(fetchDistritos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getDepartamentos = (state) => state.ubigeoState.departamentos;
export const getProvincias = (state) => state.ubigeoState.provincias;
export const getDistritos = (state) => state.ubigeoState.distritos;

export default ubigeoSlice.reducer;
