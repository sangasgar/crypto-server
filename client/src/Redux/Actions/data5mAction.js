import axios from 'axios';
import { SET_5M } from '../type';

export const data5Action = (value) => ({
  type: SET_5M,
  payload: value,
});

export const get5m = (value) => async (dispatch) => {
  const data5m = await axios.post('/api/data-5m', value);
  dispatch(data5Action(data5m.data));
};
