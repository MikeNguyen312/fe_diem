import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/GiangVien.css';

const API_BASE_URL = "https://server-quanlydiemsinhvien-production-e8d7.up.railway.app/api/teachers";
const API_SUBJECTS_URL = "https://server-quanlydiemsinhvien-production-e8d7.up.railway.app/api/subjects";

function GiangVien() {
  const [giangViens, setGiangViens] = useState([]);
  const [maGv, setMaGv] = useState("");
  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");
  const [maBoMon, setMaBoMon] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGiangViens();
    fetchSubjects();
  }, []);

  const fetchGiangViens = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGiangViens(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách giảng viên:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_SUBJECTS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const uniqueSubjects = Array.from(
        new Set(response.data.map((subject) => subject.ma_bo_mon))
      ).map((ma_bo_mon) =>
        response.data.find((subject) => subject.ma_bo_mon === ma_bo_mon)
      );
      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bộ môn:", error);
    }
  };

  const handleAddGiangVien = async () => {
    if (!maGv || !hoTen || !email || !maBoMon) {
      setError("Tất cả các trường đều phải được điền đầy đủ.");
      return;
    }
    try {
      await axios.post(
        API_BASE_URL,
        { ma_gv: maGv, ho_ten: hoTen, email: email, ma_bo_mon: maBoMon },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      
      setMessage("Thêm giảng viên thành công!");
      fetchGiangViens();
      setMaGv("");
      setHoTen("");
      setEmail("");
      setMaBoMon("");
      setTimeout(() => setMessage(""), 1000);
    } catch (error) {
      console.error("Lỗi khi thêm giảng viên:", error.response || error.message);
      setError("Mã bộ môn không tồn tại hoặc lỗi hệ thống.");
      setTimeout(() => setError(""), 1000);
    }
  };

  const filteredGiangViens = giangViens.filter((giangVien) =>
    giangVien.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
    giangVien.ma_gv.toLowerCase().includes(searchTerm.toLowerCase()) ||
    giangVien.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="giangvien-container">
      <h2 style={{ textAlign: "center" }}>Quản lí Giảng Viên</h2>

      {error && <div className="giangvien-error-message">{error}</div>}
      {message && <div className="giangvien-success-message">{message}</div>}

      <div className="form-container">
        <input
          type="text"
          placeholder="Mã giảng viên"
          value={maGv}
          onChange={(e) => setMaGv(e.target.value)}
        />
        <input
          type="text"
          placeholder="Họ tên"
          value={hoTen}
          onChange={(e) => setHoTen(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select className="chon" value={maBoMon} onChange={(e) => setMaBoMon(e.target.value)}>
          <option value="">Chọn mã bộ môn</option>
          {subjects.map((subject) => (
            <option key={subject.ma_bo_mon} value={subject.ma_bo_mon}>
              {subject.ma_bo_mon}
            </option>
          ))}
        </select>
      </div>

      <div className="them">
        <button onClick={handleAddGiangVien}>Thêm Giảng Viên</button>
      </div>

      <div className="search-container" style={{ margin: "10px 0" }}>
        <input
          type="text"
          placeholder="Tìm kiếm giảng viên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="teacher-table">
        <thead>
          <tr>
            <th>Mã Giảng Viên</th>
            <th>Họ Tên</th>
            <th>Email</th>
            <th>Mã Bộ Môn</th>
          </tr>
        </thead>
        <tbody>
          {filteredGiangViens.length > 0 ? (
            filteredGiangViens.map((giangVien) => (
              <tr key={giangVien.ma_gv}>
                <td>{giangVien.ma_gv}</td>
                <td>{giangVien.ho_ten}</td>
                <td>{giangVien.email}</td>
                <td>{giangVien.ma_bo_mon}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GiangVien;


// const handleDeleteGiangVien = async (ma_gv) => {
//   if (window.confirm("Bạn có chắc chắn muốn xóa giảng viên này không?")) {
//     try {
//       await axios.delete(`${API_BASE_URL}/${ma_gv}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setMessage("Xóa giảng viên thành công!");
//       fetchGiangViens();
//       setTimeout(() => setMessage(""), 1000);
//     } catch (error) {
//       console.error("Lỗi khi xóa giảng viên:", error);
//       setError("Xóa thất bại. Có thể do quyền hạn hoặc lỗi hệ thống.");
//       setTimeout(() => setError(""), 1000);
//     }
//   }
// };