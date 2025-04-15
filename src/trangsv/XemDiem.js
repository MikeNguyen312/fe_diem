import React, { useEffect, useState } from "react";
import axios from "axios";
import '../stylessv/XemDiem.css';

const XemDiem = () => {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState("");
  const masv = localStorage.getItem("masv");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!masv || !token) {
      setError("Bạn chưa đăng nhập!");
      return;
    }

    const fetchScores = async () => {
      try {
        const response = await axios.get(
          `https://server-quanlydiemsinhvien-production.up.railway.app/api/scores/${masv}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 && response.data.length > 0) {
          setScores(response.data);
        } else {
          setError("Không có điểm nào được tìm thấy.");
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu điểm:", err);
        setError("Không thể tải dữ liệu điểm. Vui lòng thử lại.");
      }
    };

    fetchScores();
  }, [masv, token]);

  return (
    <div>
      <h2>Kết quả học tập</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {scores.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Mã lớp MH</th>
              <th>Tên môn</th>
              <th>Học kỳ</th>
              <th>Năm học</th>
              <th>Điểm chuyên cần</th>
              <th>Điểm giữa kỳ</th>
              <th>Điểm cuối kỳ</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{score.ma_lop_mh}</td>
                <td>{score.ten_mon}</td>
                <td>{score.hoc_ky}</td>
                <td>{score.nam_hoc}</td>
                <td>{score.diem_cc}</td>
                <td>{score.diem_gk}</td>
                <td>{score.diem_ck}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !error && <p>Không có điểm nào được tìm thấy.</p>
      )}
    </div>
  );
};

export default XemDiem;
