import React from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';
import Feedback from './components/Feedback/Feedback';
import MainPage from './components/MainPage/MainPage';
import NavBar from './components/NavBar/NavBar';
import Singin from './components/Singin/Singin';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/singin" element={<Singin />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
      <div className="footer">
        <strong>Soon...</strong>
      </div>
    </>

  );
}

export default App;
