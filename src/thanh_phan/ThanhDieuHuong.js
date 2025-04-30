import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ThanhDieuHuong.css';

function ThanhDieuHuong() {
  const [role, setRole] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole) {
      setRole(userRole);  
    }
  }, []);

  return (
    <div className="navbar">
      {role === 'SV' && (
        <>
          <Link to="/">Trang Chủ</Link>
          <Link to="/dang-ky-mon-hoc">Đăng Ký Môn Học</Link>
          <Link to="/xem-diem">Xem Điểm</Link>
          <Link to="/xem-thong-tin-sinh-vien">Thông Tin Sinh Viên</Link>
        </>
      )}

      {role === 'GV' && (
        <>
          <Link to="/quan-li-sinh-vien-lop-mh">Sinh Viên Lớp Môn Học</Link>
          <Link to="/quan-li-lop-mh">Quản Lí Lớp Môn Học</Link>
          <Link to="/xem-diem-gv">Xem Điểm</Link>
          <Link to="/xem-thong-tin-gv">Thông Tin Giảng Viên</Link>
        </>
      )}

      {role === 'PDT' && (
        <>
          <Link to="tao-tai-khoan">QUẢN LÍ TÀI KHOẢN</Link>
          <Link to="/sinh-vien">QUẢN LÍ SINH VIÊN</Link>
          <Link to="/giang-vien">QUẢN LÍ GIẢNG VIÊN</Link>
          <Link to="/mon-hoc">QUẢN LÍ MÔN HỌC</Link>
          <Link to="/lop-mon-hoc">QUẢN LÍ LỚP MÔN HỌC</Link>
          <Link to="/diem">QUẢN LÍ ĐIỂM</Link>
        </>
      )}
    </div>
  );
}

export default ThanhDieuHuong;
