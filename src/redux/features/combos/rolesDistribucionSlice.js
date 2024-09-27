import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_DISTRIBUCION, URL_MASTERLOGIC_API } from "../../../utils/general";

export const fetchRoles = createAsyncThunk(
  "rolesDistribucion/fetchRoles",
  async () => {
    const token = localStorage.getItem("USUARIO_TOKEN");
    /* const data = await getListCanales();
    //console.log(data);
    return data.result; */
    const response = await fetch(
      `${URL_MASTERLOGIC_API}${API_DISTRIBUCION}/roles/lista?cia=06`,
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

export const rolesDistribucionSlice = createSlice({
  name: "rolesDistribucion",
  initialState: {
    lista: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lista = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getRolesDistribucion = (state) => state.rolesDistribucionState.lista;

export default rolesDistribucionSlice.reducer;