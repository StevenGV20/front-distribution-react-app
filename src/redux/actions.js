import { GET_SEDES } from './actionTypes'

let nextTodoId = 0
export const getSedes = (content) => ({
  type: GET_SEDES,
  payload: {
    id: ++nextTodoId,
    content,
  },
})