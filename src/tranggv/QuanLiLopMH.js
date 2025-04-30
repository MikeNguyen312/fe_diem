import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../stylesgv/QuanLiLopMH.css';

const QuanLiLopMH = () => {
  const [lopMonHocList, setLopMonHocList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const magv = localStorage.getItem("magv");

      if (!token || !magv) {
        setError('Bạn chưa đăng nhập hoặc thiếu mã giảng viên.');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://server-quanlydiemsinhvien-production-e8d7.up.railway.app/api/teachers/${magv}/lop-mon-hoc`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { data } = response;
        if (data.success && Array.isArray(data.data)) {
          setLopMonHocList(data.data);
        } else {
          setError('Dữ liệu không hợp lệ từ server.');
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu lớp môn học.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="quan-li-lopmh-container">
      <h2>Danh sách lớp môn học của giảng viên</h2>
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="error">{error}</p>}
      <table className="lopmh-table">
        <thead>
          <tr>
            <th>Mã lớp MH</th>
            <th>Mã môn học</th>
            <th>Tên môn</th>
            <th>Học kỳ</th>
            <th>Năm học</th>
          </tr>
        </thead>
        <tbody>
          {lopMonHocList.length > 0 ? (
            lopMonHocList.map((lop, idx) => (
              <tr key={idx}>
                <td>{lop.ma_lop_mh}</td>
                <td>{lop.ma_mh}</td>
                <td>{lop.ten_mon}</td>
                <td>{lop.hoc_ky}</td>
                <td>{lop.nam_hoc}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Không có lớp môn học nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuanLiLopMH;
