/* eslint-disable default-param-last */
import { SET_5M } from '../type';

function data5mReducer(state = [], action) {
  const { type, payload } = action;
  switch (type) {
    case SET_5M:
      return payload;
    default:
      return state;
  }
}
export default data5mReducer;
