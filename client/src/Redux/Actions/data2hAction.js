import axios from 'axios';
import { SET2h } from '../type';

export const data5Action = (value) => ({
  type: SET2h,
  payload: value,
});

export const get2h = (value) => async (dispatch) => {
  const data2h = await axios.post('/api/data-2h', value);
  dispatch(data5Action(data2h.data));
};
