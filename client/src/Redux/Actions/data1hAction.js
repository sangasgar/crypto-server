import axios from 'axios';
import { SET1h } from '../type';

export const data1hAction = (value) => ({
  type: SET1h,
  payload: value,
});

export const get1h = (value) => async (dispatch) => {
  const data1h = await axios.post('/api/data-1h', value);
  dispatch(data1hAction(data1h.data));
};
