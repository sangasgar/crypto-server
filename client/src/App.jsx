import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Account from './components/Admin/Account/Account';
import AdminNavBar from './components/Admin/AdminNavBar/AdminNavBar';
import BotPage from './components/Admin/BotPage/BotPage';
import ChartPage from './components/Admin/Chart/ChartPage';
import Feedback from './components/Feedback/Feedback';
import MainPage from './components/MainPage/MainPage';
import NavBar from './components/NavBar/NavBar';
import Singin from './components/Singin/Singin';
import { checkUser } from './Redux/Actions/userAction';

const AppWrapper = styled.div`
margin: 5%;
`;

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkUser());
  }, []);
  const { user } = useSelector((state) => state);
  return (
    <>
      {user.name ? <AdminNavBar /> : <NavBar />}
      <Routes>
        <Route path="/" element={user.name ? <Navigate replace to="/account" /> : <MainPage />} />
        <Route path="/account" element={user.name ? <Account /> : <Navigate replace to="/singin" />} />
        <Route path="/chart" element={user.name ? <ChartPage /> : <Navigate replace to="/singin" />} />
        <Route path="/singin" element={!user.name ? <Singin /> : <Navigate replace to="/account" />} />
        <Route path="/bot" element={user.name ? <BotPage /> : <Navigate replace to="/singin" />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
      <AppWrapper>
        <div className="footer">
          <strong>Copyright Neural Network 2022</strong>
        </div>

      </AppWrapper>
    </>

  );
}

export default App;
