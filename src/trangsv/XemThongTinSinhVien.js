import React, { useEffect, useState } from "react";
import axios from "axios";
import "../stylessv/XemThongTinSinhVien.css";

const API_BASE_URL = "https://server-quanlydiemsinhvien-production.up.railway.app/api/students";

const XemThongTinSinhVien = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentInfo = async () => {
      const ma_sv = localStorage.getItem("ma_sv");
      const token = localStorage.getItem("token");

      if (!ma_sv || !token) {
        setError("Không tìm thấy mã sinh viên hoặc token.");
        return;
      }

      try {
        // Gọi trực tiếp API với mã sinh viên
        const response = await axios.get(`${API_BASE_URL}/${ma_sv}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudentInfo(response.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Lỗi khi lấy thông tin sinh viên.");
      }
    };

    fetchStudentInfo();
  }, []);

  return (
    <div className="xem-thong-tin-container">
      <h2>Thông tin sinh viên</h2>
      {error && <p className="error-message">{error}</p>}
      {studentInfo ? (
        <div className="student-info">
          <p><strong>Mã sinh viên:</strong> {studentInfo.ma_sv}</p>
          <p><strong>Họ tên:</strong> {studentInfo.ho_ten}</p>
          <p><strong>Ngày sinh:</strong> {studentInfo.ngay_sinh}</p>
          <p><strong>Giới tính:</strong> {studentInfo.gioi_tinh}</p>
          <p><strong>Email:</strong> {studentInfo.email}</p>
          <p><strong>Mã lớp:</strong> {studentInfo.ma_lop}</p>
        </div>
      ) : !error ? (
        <p>Đang tải thông tin...</p>
      ) : null}
    </div>
  );
};

export default XemThongTinSinhVien;
