import axios from 'axios';
import { SET_5M } from '../type';

export const data5Action = (value) => ({
  type: SET_5M,
  payload: value,
});

export const get5m = () => async (dispatch) => {
  const data5m = await axios.get('http://localhost:3010/api/data-5m');
  dispatch(data5Action(data5m.data));
};
