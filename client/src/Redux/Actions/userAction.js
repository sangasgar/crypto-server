import axios from 'axios';
import { SET_USER } from '../type';

export const userAction = (value) => ({
  type: SET_USER,
  payload: value,
});

export const getUser = (value) => async (dispatch) => {
  try {
    const user = await axios.post('http://localhost:3002/users', value);
    localStorage.setItem('token', user.data.token);
    dispatch(userAction({ id: user.data.id, name: user.data.name }));
  } catch (error) {
    dispatch(userAction({}));
  }
};

export const checkUser = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  const option = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const user = await axios.post('http://localhost:3002/users/check', {}, option);
  dispatch(userAction(user.data));
};

export const logout = () => (dispatch) => {
  dispatch(userAction({}));
  localStorage.removeItem('token');
};
