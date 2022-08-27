/* eslint-disable default-param-last */
import { SET1h } from '../type';

function data1hReducer(state = [], action) {
  const { type, payload } = action;
  switch (type) {
    case SET1h:
      return payload;
    default:
      return state;
  }
}
export default data1hReducer;
