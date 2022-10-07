import axios from 'axios';
import { SET_15M } from '../type';

export const data15Action = (value) => ({
  type: SET_15M,
  payload: value,
});

export const get15m = (value) => async (dispatch) => {
  const data15m = await axios.post('/api/data-15m', value);
  dispatch(data15Action(data15m.data));
};
