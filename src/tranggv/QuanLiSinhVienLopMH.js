import React, { useState } from 'react';
import axios from 'axios';
import '../stylesgv/QuanLiSinhVienLopMH.css';

const QuanLiSinhVienLopMH = () => {
  const [maLopMH, setMaLopMH] = useState('');
  const [sinhVienList, setSinhVienList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetchSinhVien = async () => {
    const token = localStorage.getItem("token");
    const maGv = localStorage.getItem("magv");

    if (!token || !maGv || !maLopMH) {
      setError('Vui lòng đăng nhập và nhập mã lớp môn học.');
      return;
    }

    setLoading(true);
    setError('');
    setSinhVienList([]);

    try {
      const response = await axios.get(
        `https://server-quanlydiemsinhvien-production-e8d7.up.railway.app/api/teachers/${maGv}/lop-mon-hoc/${maLopMH}/sinh-vien`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response?.data?.success &&
        Array.isArray(response?.data?.data)
      ) {
        setSinhVienList(response.data.data);
      } else {
        setError('Dữ liệu không hợp lệ từ server.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Lỗi không xác định khi tải danh sách sinh viên.'
      );
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
