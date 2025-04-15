import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../stylesgv/QuanLiSinhVienLopMH.css';

const QuanLiSinhVienLopMH = () => {
  const [maLopMH, setMaLopMH] = useState('');
  const [sinhVienList, setSinhVienList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Kiểm tra thông tin khi trang được tải lại
  useEffect(() => {
    const token = localStorage.getItem("token");
    const magv = localStorage.getItem("magv");

    if (!token || !magv) {
      setError('Bạn chưa đăng nhập hoặc không tìm thấy mã giảng viên.');
    } else {
      setError('');
    }
  }, []);

  const handleFetchSinhVien = async () => {
    const token = localStorage.getItem("token");
    const magv = localStorage.getItem("magv");

    // Kiểm tra token, mã giảng viên và mã lớp môn học
    if (!token) {
      setError('Bạn chưa đăng nhập.');
      return;
    }

    if (!magv) {
      setError('Không tìm thấy mã giảng viên. Vui lòng đăng nhập lại.');
      return;
    }

    if (!maLopMH) {
      setError('Vui lòng nhập mã lớp môn học.');
      return;
    }

    setLoading(true);
    setError('');
    setSinhVienList([]);

    try {
      const response = await axios.get(
        `https://server-quanlydiemsinhvien-production.up.railway.app/api/teachers/${magv}/lop-mon-hoc/${maLopMH}/sinh-vien`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      console.log('Response:', response.data);

      if (response?.data?.success && Array.isArray(response.data.data)) {
        setSinhVienList(response.data.data);
      } else {
        setError('Dữ liệu không hợp lệ từ server.');
      }
    } catch (err) {
      console.error('Lỗi API:', err.response || err);

      if (err.response?.status === 401) {
        setError('Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
      } else if (err.response?.status === 403) {
        setError('Bạn không có quyền truy cập danh sách sinh viên của lớp này.');
      } else {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Lỗi không xác định khi tải danh sách sinh viên.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quan-li-sv-lopmh-container">
      <h2>Danh sách sinh viên lớp môn học</h2>

      <div className="form-group">
        <label htmlFor="maLopMH">Nhập mã lớp môn học:</label>
        <input
          type="text"
          id="maLopMH"
          value={maLopMH}
          onChange={(e) => setMaLopMH(e.target.value)}
          placeholder="Ví dụ: LOPMH001"
        />
        <button onClick={handleFetchSinhVien}>Xem danh sách</button>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && sinhVienList.length > 0 ? (
        <table className="sv-table">
          <thead>
            <tr>
              <th>Mã SV</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Mã lớp</th>
              <th>Mã lớp MH</th>
              <th>Tên môn</th>
            </tr>
          </thead>
          <tbody>
            {sinhVienList.map((sv, idx) => (
              <tr key={idx}>
                <td>{sv.ma_sv}</td>
                <td>{sv.ho_ten}</td>
                <td>{sv.email}</td>
                <td>{sv.ma_lop}</td>
                <td>{sv.ma_lop_mh}</td>
                <td>{sv.ten_mon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && !error && (
          <p>Không có sinh viên nào trong lớp môn học này.</p>
        )
      )}
    </div>
  );
};

export default QuanLiSinhVienLopMH;
