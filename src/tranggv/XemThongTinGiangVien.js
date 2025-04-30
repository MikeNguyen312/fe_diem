import React, { useEffect, useState } from "react";
import axios from "axios";
import "../stylesgv/XemThongTinGiangVien.css";

const API_BASE_URL = "https://server-quanlydiemsinhvien-production-e8d7.up.railway.app/api/teachers";

const XemThongTinGiangVien = () => {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      const magv = localStorage.getItem("magv"); // giống key bạn đang dùng ở QuanLiLopMH
      const token = localStorage.getItem("token");

      if (!magv || !token) {
        setError("Không tìm thấy mã giảng viên hoặc token.");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/${magv}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTeacherInfo(response.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Lỗi khi lấy thông tin giảng viên.");
      }
    };

    fetchTeacherInfo();
  }, []);

  return (
    <div className="xem-thong-tin-container">
      <h2>Thông tin giảng viên</h2>
      {error && <p className="error-message">{error}</p>}
      {teacherInfo ? (
        <div className="teacher-info">
          <p><strong>Mã giảng viên:</strong> {teacherInfo.ma_gv}</p>
          <p><strong>Họ tên:</strong> {teacherInfo.ho_ten}</p>
          <p><strong>Email:</strong> {teacherInfo.email}</p>
          <p><strong>Mã bộ môn:</strong> {teacherInfo.ma_bo_mon}</p>
        </div>
      ) : !error ? (
        <p>Đang tải thông tin...</p>
      ) : null}
    </div>
  );
};

export default XemThongTinGiangVien;
