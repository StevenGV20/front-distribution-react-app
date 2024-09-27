import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

/* export const fetchData = createAsyncThunk('data/fetchData', async () => {
  const response = await fetch('http://localhost:5006/api/Solicitudes/lista/sedes');
  const data = await response.json();
  return data;
});
 */
export const utilsSlice = createSlice({
  name: "utils",
  initialState: {
    token: localStorage.getItem("USUARIO_TOKEN"),
    message: {
      state: false,
      message: "",
      type: "",
    },
    loaderComponent: false,
  },
  reducers: {
    getToken: (state) => {
      state.value = localStorage.getItem("USUARIO_TOKEN");
    },
    setMessage: (state, action) => {
      state.message = {
        state: action.payload.state,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    setLoaderComponent: (state, action) => {
      state.loaderComponent = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getToken, setMessage } = utilsSlice.actions;

export default utilsSlice.reducer;
