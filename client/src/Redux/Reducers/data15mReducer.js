/* eslint-disable default-param-last */
import { SET_15M } from '../type';

function data15mReducer(state = [], action) {
  const { type, payload } = action;
  switch (type) {
    case SET_15M:
      return payload;
    default:
      return state;
  }
}
export default data15mReducer;
