/* eslint-disable default-param-last */
import { SET_30M } from '../type';

function data30mReducer(state = [], action) {
  const { type, payload } = action;
  switch (type) {
    case SET_30M:
      return payload;
    default:
      return state;
  }
}
export default data30mReducer;
