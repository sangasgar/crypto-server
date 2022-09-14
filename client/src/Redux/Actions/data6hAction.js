import axios from 'axios';
import { SET6h } from '../type';

export const data6hAction = (value) => ({
  type: SET6h,
  payload: value,
});

export const get6h = () => async (dispatch) => {
  const data6h = await axios.get('/api/data-6h');
  dispatch(data6hAction(data6h.data));
};
