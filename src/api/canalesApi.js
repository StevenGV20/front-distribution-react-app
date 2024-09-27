import axios from "axios";
import { API_MAESTRO, URL_MASTERLOGIC_API } from "../utils/general";

export const getListCanales = () => {
  return axios
    .get(`${URL_MASTERLOGIC_API}${API_MAESTRO}/canales/lista?empresa=01`)
    .then((res) => res.data)
    .catch((err) => //console.log(err));
};
