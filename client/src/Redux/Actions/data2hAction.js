import axios from 'axios';
import { SET2h } from '../type';

export const data5Action = (value) => ({
  type: SET2h,
  payload: value,
});

export const get2h = () => async (dispatch) => {
  const data2h = await axios.get('http://localhost:3010/api/data-2h');
  dispatch(data5Action(data2h.data));
};
