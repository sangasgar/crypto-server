import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../Redux/Actions/userAction';

function AdminNavBar() {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
    <div className="menu">
      <Menu mode="horizontal" defaultSelectedKeys={['main']}>
        <Menu.Item key="chart">
          <Link to="/chart">График</Link>
        </Menu.Item>
        <Menu.Item key="bot">
          <Link to="/bot">Управление ботом</Link>
        </Menu.Item>
        <Menu.Item key="account">
          <Link to="/account">Аккаунт</Link>
        </Menu.Item>
        <Menu.Item key="logout">
          <Link to="/" onClick={logoutHandler}>Выход</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default AdminNavBar;
