import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_MAESTRO, URL_MASTERLOGIC_API } from "../../../utils/general";

export const fetchCanales = createAsyncThunk(
  "canales/fetchCanales",
  async () => {
    const token = localStorage.getItem("USUARIO_TOKEN");
    /* const data = await getListCanales();
    //console.log(data);
    return data.result; */
    const response = await fetch(
      `${URL_MASTERLOGIC_API}${API_MAESTRO}/canales/lista?empresa=01`,
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
  }
);

export const canalesSlice = createSlice({
  name: "canales",
  initialState: {
    lista: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCanales.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCanales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lista = action.payload;
      })
      .addCase(fetchCanales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getCanales = (state) => state.canalesState.lista;

export default canalesSlice.reducer;