import { configureStore } from "@reduxjs/toolkit";
import sedeReducer from "./features/combos/sedeSlice";
import utilsReducer from "./features/utils/utilsSlice";
import ubigeoReducer from "./features/combos/ubigeoSlice";
import canalesReducer from "./features/combos/canalesSlice";
import rolesDistribucionReducer from './features/combos/rolesDistribucionSlice'
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
  whiteList: ["canalesState", "sedeState", "ubigeoState","rolesDistribucionState"],
  blacklist: ["utilsState"],
};

const rootReducer = combineReducers({
  canalesState: canalesReducer,
  sedeState: sedeReducer,
  utilsState: utilsReducer,
  ubigeoState: ubigeoReducer,
  rolesDistribucionState:rolesDistribucionReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(thunk),
});

// Exporta el store
export { store }; // Exporta el store como un named export
