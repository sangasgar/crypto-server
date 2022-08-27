import axios from 'axios';
import { SET_30M } from '../type';

export const data30Action = (value) => ({
  type: SET_30M,
  payload: value,
});

export const get30m = () => async (dispatch) => {
  const data30m = await axios.get('http://localhost:3010/api/data-30m');
  dispatch(data30Action(data30m.data));
};
