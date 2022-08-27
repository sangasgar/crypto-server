import { configureStore } from '@reduxjs/toolkit';
import data15mReducer from './Reducers/data15mReducer';
import data1hReducer from './Reducers/data1hReducer';
import data2hReducer from './Reducers/data2hReducer';
import data30mReducer from './Reducers/data30mReducer';
import data5mReducer from './Reducers/data5mReducer';
import data6hReducer from './Reducers/data6hReducer';
import userReducer from './Reducers/userReducer';
// ...

const store = configureStore({
  reducer: {
    user: userReducer,
    data5m: data5mReducer,
    data15m: data15mReducer,
    data30m: data30mReducer,
    data1h: data1hReducer,
    data2h: data2hReducer,
    data6h: data6hReducer,
  },
});

export default store;
