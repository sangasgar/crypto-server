import React from 'react';
import { Menu } from 'antd';
import './NavBar.css';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div className="menu">
      <Menu mode="horizontal" style={{ color: 'black' }} defaultSelectedKeys={['main']}>
        <Menu.Item key="main">
          <Link to="/">Главная</Link>
        </Menu.Item>
        <Menu.Item key="singin">
          <Link to="/singin">Вход</Link>
        </Menu.Item>
        <Menu.Item key="feedback">
          <Link to="/feedback">  Обратная связь</Link>
        </Menu.Item>
      </Menu>
    </div>

  );
}

export default NavBar;
