import axios from 'axios';
import { SET_30M } from '../type';

export const data30Action = (value) => ({
  type: SET_30M,
  payload: value,
});

export const get30m = (value) => async (dispatch) => {
  const data30m = await axios.post('/api/data-30m', value);
  dispatch(data30Action(data30m.data));
};
