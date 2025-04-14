import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TrangChu from './trangpdt/TrangChu';
import SinhVien from './trangpdt/SinhVien';
import GiangVien from './trangpdt/GiangVien';
import Diem from './trangpdt/Diem';
import ThanhDieuHuong from './thanh_phan/ThanhDieuHuong';
import Login from './trangpdt/Login';
import QuanLiLopMH from './tranggv/QuanLiLopMH';
import QuanLiSinhVienLopMH from './tranggv/QuanLiSinhVienLopMH';
import XemDiemGV from './tranggv/XemDiemGV';
import XemThongTinGiangVien from './tranggv/XemThongTinGiangVien';
import DangKyMonHoc from './trangsv/DangKyMonHoc';
import XemDiem from './trangsv/XemDiem';
import XemThongTinSinhVien from './trangsv/XemThongTinSinhVien';
import MonHoc from './trangpdt/MonHoc';
import Register from './trangpdt/Register';
import './App.css';

function PrivateRoute({ element, isAuthenticated }) {
  return isAuthenticated ? element : <Navigate to="/login" />;
}
const API_BASE_URL = 'https://server-quanlydiemsinhvien-production.up.railway.app';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    if (token) {
      axios.get(`${API_BASE_URL}/api/auth/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIsAuthenticated(true);
        setRole(res.data.role || savedRole);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsAuthenticated(false);
        setRole('');
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole('');
  };

  const redirectDashboardByRole = () => {
    switch (role) {
      case 'SV':
        return <Navigate to="/dang-ky-mon-hoc" />;
      case 'GV':
        return <Navigate to="/quan-li-lop-mh" />;
      case 'PDT':
        return <Navigate to="/" />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <div className='left-header'>
            <div className="logo-placeholder">Future</div>
            <div className="school-name">Trường Đại học Công Nghệ Future</div>
          </div>
          {isAuthenticated && (
            <span className="logout-text" onClick={handleLogout}>
              Đăng xuất
            </span>
          )}
        </header>

        {isAuthenticated && <ThanhDieuHuong role={role} />}

        <div className="content">
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? redirectDashboardByRole() : <Login setIsAuthenticated={setIsAuthenticated} />
              }
            />
            <Route path="/register" element={<Register />} />

            {/* Các route bảo vệ bằng isAuthenticated */}
            <Route path="/" element={<PrivateRoute element={<TrangChu />} isAuthenticated={isAuthenticated} />} />
            <Route path="/sinh-vien" element={<PrivateRoute element={<SinhVien />} isAuthenticated={isAuthenticated} />} />
            <Route path="/giang-vien" element={<PrivateRoute element={<GiangVien />} isAuthenticated={isAuthenticated} />} />
            <Route path="/diem" element={<PrivateRoute element={<Diem />} isAuthenticated={isAuthenticated} />} />
            <Route path="/quan-li-lop-mh" element={<PrivateRoute element={<QuanLiLopMH />} isAuthenticated={isAuthenticated} />} />
            <Route path="/quan-li-sinh-vien-lop-mh" element={<PrivateRoute element={<QuanLiSinhVienLopMH />} isAuthenticated={isAuthenticated} />} />
            <Route path="/xem-diem-gv" element={<PrivateRoute element={<XemDiemGV />} isAuthenticated={isAuthenticated} />} />
            <Route path="/xem-thong-tin-gv" element={<PrivateRoute element={<XemThongTinGiangVien />} isAuthenticated={isAuthenticated} />} />
            <Route path="/dang-ky-mon-hoc" element={<PrivateRoute element={<DangKyMonHoc />} isAuthenticated={isAuthenticated} />} />
            <Route path="/xem-diem" element={<PrivateRoute element={<XemDiem />} isAuthenticated={isAuthenticated} />} />
            <Route path="/Xem-Thong-Tin-Sinh-Vien" element={<PrivateRoute element={<XemThongTinSinhVien />} isAuthenticated={isAuthenticated} />} />
            <Route path="/mon-hoc" element={<PrivateRoute element={<MonHoc />} isAuthenticated={isAuthenticated} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
