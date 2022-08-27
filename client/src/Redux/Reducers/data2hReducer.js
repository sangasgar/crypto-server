/* eslint-disable default-param-last */
import { SET2h } from '../type';

function data2hReducer(state = [], action) {
  const { type, payload } = action;
  switch (type) {
    case SET2h:
      return payload;
    default:
      return state;
  }
}
export default data2hReducer;
