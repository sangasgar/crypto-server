import axios from 'axios';
import { SET6h } from '../type';

export const data6hAction = (value) => ({
  type: SET6h,
  payload: value,
});

export const get6h = (value) => async (dispatch) => {
  const data6h = await axios.post('/api/data-6h', value);
  dispatch(data6hAction(data6h.data));
};
