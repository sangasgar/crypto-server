import axios from 'axios';
import { SET1h } from '../type';

export const data1hAction = (value) => ({
  type: SET1h,
  payload: value,
});

export const get1h = () => async (dispatch) => {
  const data1h = await axios.get('http://localhost:3010/api/data-1h');
  dispatch(data1hAction(data1h.data));
};
