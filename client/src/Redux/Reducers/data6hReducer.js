/* eslint-disable default-param-last */
import { SET6h } from '../type';

function data6hReducer(state = [], action) {
  const { type, payload } = action;
  switch (type) {
    case SET6h:
      return payload;
    default:
      return state;
  }
}
export default data6hReducer;
