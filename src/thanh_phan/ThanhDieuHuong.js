import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ThanhDieuHuong.css';

function ThanhDieuHuong() {
  const [role, setRole] = useState('');

  useEffect(() => {
    // Lấy role từ localStorage sau khi người dùng đăng nhập
    const userRole = localStorage.getItem('role');
    if (userRole) {
      setRole(userRole);  // Lưu role vào state
    }
  }, []);

  return (
    <div className="navbar">

          <Link to="/">Trang Chủ</Link>

      {role === 'SV' && (
        <>
          <Link to="/dang-ky-mon-hoc">Đăng Ký Môn Học</Link>
          <Link to="/xem-diem">Xem Điểm</Link>
          <Link to="/xem-thong-tin-sinh-vien">thông tin sinh viên</Link>
        </>
      )}

      {role === 'GV' && (
        <>
          <Link to="/quan-li-sinh-vien-lop-mh">sinh viên lớp môn học</Link>
          <Link to="/quan-li-lop-mh">Quản lí lớp môn học</Link>
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
