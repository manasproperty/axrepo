import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './MyLoading';
import FirstPage from './pages/FirstPage';
import SecondPage from './pages/SecondPage';
import SuccessPage from './pages/SuccessPage';
import '../src/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/second/:id" element={<SecondPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;