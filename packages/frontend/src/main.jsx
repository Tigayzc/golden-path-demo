import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import UnderTheHood from './pages/UnderTheHood.jsx'
import Problems from './pages/Problems.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/under-the-hood" element={<UnderTheHood />} />
        <Route path="/under-the-hood/problems" element={<Problems />} />
        {/* 旧地址兼容 */}
        <Route path="/problems" element={<Navigate to="/under-the-hood/problems" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
