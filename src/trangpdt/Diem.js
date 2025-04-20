import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Diem.css";

const API_BASE_URL = "https://server-quanlydiemsinhvien-production.up.railway.app/api/scores";

function Diem() {
  const [scores, setScores] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    ma_diem: "",
    ma_sv: "",
    ma_lop_mh: "",
    diem_cc: "",
    diem_gk: "",
    diem_ck: "",
    ma_pdt: "PDT01",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchScores();
    fetchData();
  }, []);

  const fetchScores = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScores(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy điểm:", error);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [studentsRes, classesRes] = await Promise.all([
        axios.get("https://server-quanlydiemsinhvien-production.up.railway.app/api/students", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://server-quanlydiemsinhvien-production.up.railway.app/api/class-subject", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (Array.isArray(studentsRes.data)) {
        setStudents(studentsRes.data);
      } else {
        console.error("Dữ liệu sinh viên không phải là mảng");
        setStudents([]);
      }
      if (Array.isArray(classesRes.data.data)) {
        setClasses(classesRes.data.data); 
      } else {
        console.error("class-subject không trả về mảng hoặc không có data");
        setClasses([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.ma_diem || !formData.ma_sv || !formData.ma_lop_mh || !formData.diem_cc || !formData.diem_gk || !formData.diem_ck) {
      setError("Vui lòng điền đầy đủ thông tin");
      setTimeout(() => setError(""), 1500);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchScores();
      resetForm();
      setSuccessMessage("Thêm điểm thành công!");
      setTimeout(() => setSuccessMessage(""), 1500);
    } catch (error) {
      setError("Lỗi khi thêm điểm: " + error.message);
      setTimeout(() => setSuccessMessage(""), 1500);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!formData.diem_cc || !formData.diem_gk || !formData.diem_ck) {
      setError("Vui lòng điền đầy đủ thông tin điểm");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/update/ma_sv/${formData.ma_sv}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchScores();
      resetForm();
      setSuccessMessage("Cập nhật điểm thành công!");
      setTimeout(() => setSuccessMessage(""), 1500);
    } catch (error) {
      setError("Lỗi khi sửa điểm");
      setTimeout(() => setSuccessMessage(""), 1500);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa điểm này?");
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchScores();
      setSuccessMessage("Xóa điểm thành công!");
      setTimeout(() => setSuccessMessage(""), 1500);
    } catch (error) {
      setError(`Lỗi khi xóa điểm: ${error.message}`);
      setTimeout(() => setError(""), 1500);
    }
  };
  

  const handleEditClick = (score) => {
    setIsEditing(true);
    setSelectedId(score.id);
    setFormData({
      ma_diem: score.ma_diem,
      ma_sv: score.ma_sv,
      ma_lop_mh: score.ma_lop_mh,
      diem_cc: score.diem_cc,
      diem_gk: score.diem_gk,
      diem_ck: score.diem_ck,
      ma_pdt: score.ma_pdt,
    });
  };
  
  const resetForm = () => {
    setIsEditing(false);
    setSelectedId(null);
    setFormData({
      ma_diem: "",
      ma_sv: "",
      ma_lop_mh: "",
      diem_cc: "",
      diem_gk: "",
      diem_ck: "",
      ma_pdt: "PDT01",
    });
    setError("");
  };
  

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredScores = scores.filter((score) =>
    score.ma_sv.toLowerCase().includes(search.toLowerCase()) ||
    score.ma_lop_mh.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="diem-manager-container">
      <h2>Quản lí điểm</h2>
      {error && <div className="diem-manager-error-message">{error}</div>}
      {successMessage && <div className="diem-manager-success-message">{successMessage}</div>}
      
      <form className="diem-manager-form-container">
        <input
          type="text"
          name="ma_diem"
          placeholder="Mã Điểm"
          value={formData.ma_diem}
          onChange={(e) => setFormData({ ...formData, ma_diem: e.target.value })}
          disabled={isEditing}
        />
        <select
          name="ma_sv"
          value={formData.ma_sv}
          onChange={(e) => setFormData({ ...formData, ma_sv: e.target.value })}
          disabled={isEditing}
        >
          <option value="">Chọn Mã Sinh Viên</option>
          {students.map((student) => (
            <option key={student.ma_sv} value={student.ma_sv}>
              {student.ho_ten} - {student.ma_sv}
            </option>
          ))}
        </select>
        <select
          name="ma_lop_mh"
          value={formData.ma_lop_mh}
          onChange={(e) => setFormData({ ...formData, ma_lop_mh: e.target.value })}
          disabled={isEditing}
        >
          <option value="">Chọn Mã Lớp Môn Học</option>
          {classes.map((cls) => (
            <option key={cls.ma_lop_mh} value={cls.ma_lop_mh}>
              {cls.ma_lop_mh} - Môn: {cls.ma_mh} - GV: {cls.ma_gv}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="diem_cc"
          placeholder="Điểm CC"
          value={formData.diem_cc}
          onChange={(e) => setFormData({ ...formData, diem_cc: e.target.value })}
        />
        <input
          type="number"
          name="diem_gk"
          placeholder="Điểm GK"
          value={formData.diem_gk}
          onChange={(e) => setFormData({ ...formData, diem_gk: e.target.value })}
        />
        <input
          type="number"
          name="diem_ck"
          placeholder="Điểm CK"
          value={formData.diem_ck}
          onChange={(e) => setFormData({ ...formData, diem_ck: e.target.value })}
        />
        <select
          name="ma_pdt"
          value={formData.ma_pdt}
          onChange={(e) => setFormData({ ...formData, ma_pdt: e.target.value })}
          disabled={isEditing}
        >
          <option value="PDT01">PDT01</option>
        </select>
        <button
          type="button"
          className="diem-manager-button"
          onClick={handleAdd}
          disabled={isEditing}
        >
          Thêm điểm
        </button>
        <button
          type="button"
          className="diem-manager-button update-button"
          onClick={handleEdit}
          disabled={!isEditing}
        >
          Cập nhật điểm
        </button>
        {isEditing && (
          <button
            type="button"
            className="diem-manager-button cancel-button"
            onClick={resetForm}
          >
            Hủy
          </button>
        )}
      </form>

      <div className="diem-manager-search-container">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã SV hoặc mã lớp môn học"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <table className="diem-manager-scores-table">
        <thead>
          <tr>
            <th>Mã Điểm</th>
            <th>Mã SV</th>
            <th>Mã lớp môn học</th>
            <th>Điểm CC</th>
            <th>Điểm GK</th>
            <th>Điểm CK</th>
            <th>Mã PDT</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredScores.map((score) => (
            <tr key={score.id}>
              <td>{score.ma_diem}</td>
              <td>{score.ma_sv}</td>
              <td>{score.ma_lop_mh}</td>
              <td>{score.diem_cc}</td>
              <td>{score.diem_gk}</td>
              <td>{score.diem_ck}</td>
              <td>{score.ma_pdt}</td>
              <td>
                <button onClick={() => handleEditClick(score)}>Sửa</button>
                <button onClick={() => handleDelete(score.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Diem;
