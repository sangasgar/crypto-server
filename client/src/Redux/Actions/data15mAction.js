import axios from 'axios';
import { SET_15M } from '../type';

export const data15Action = (value) => ({
  type: SET_15M,
  payload: value,
});

export const get15m = () => async (dispatch) => {
  const data15m = await axios.get('/api/data-15m');
  dispatch(data15Action(data15m.data));
};
