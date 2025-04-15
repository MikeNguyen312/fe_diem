import React, { useState } from 'react';
import axios from 'axios';
import '../stylesgv/XemDiemGV.css'; // Bạn có thể tạo CSS nếu muốn tùy chỉnh giao diện

const XemDiemGV = () => {
  const [maLopMH, setMaLopMH] = useState('');
  const [diemList, setDiemList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleXemDiem = async () => {
    const token = localStorage.getItem("token");
    const maGv = localStorage.getItem("magv");

    if (!token || !maGv || !maLopMH) {
      setError('Vui lòng đăng nhập và nhập mã lớp môn học.');
      return;
    }

    setLoading(true);
    setError('');
    setDiemList([]);

    try {
      const response = await axios.get(
        `https://server-quanlydiemsinhvien-production.up.railway.app/api/teachers/${maGv}/lop-mon-hoc/${maLopMH}/diem`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && Array.isArray(response.data.data)) {
        setDiemList(response.data.data);
      } else {
        setError('Không có dữ liệu điểm từ server.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Lỗi khi tải dữ liệu điểm.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xem-diem-gv-container">
      <h2>Xem điểm sinh viên lớp môn học</h2>

      <div className="form-group">
        <label htmlFor="maLopMH">Nhập mã lớp môn học:</label>
        <input
          type="text"
          id="maLopMH"
          value={maLopMH}
          onChange={(e) => setMaLopMH(e.target.value)}
          placeholder="Ví dụ: LOPMH001"
        />
        <button onClick={handleXemDiem}>Xem điểm</button>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && diemList.length > 0 ? (
        <table className="diem-table">
          <thead>
            <tr>
              <th>Mã SV</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Điểm CC</th>
              <th>Điểm GK</th>
              <th>Điểm CK</th>
            </tr>
          </thead>
          <tbody>
            {diemList.map((sv, idx) => (
              <tr key={idx}>
                <td>{sv.ma_sv}</td>
                <td>{sv.ho_ten}</td>
                <td>{sv.email}</td>
                <td>{sv.diem_cc ?? '-'}</td>
                <td>{sv.diem_gk ?? '-'}</td>
                <td>{sv.diem_ck ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && !error && (
          <p>Không có điểm sinh viên trong lớp môn học này.</p>
        )
      )}
    </div>
  );
};

export default XemDiemGV;
