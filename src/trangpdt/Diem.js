import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Diem.css";

const API_BASE_URL = "https://server-quanlydiemsinhvien-production.up.railway.app/api/scores";

function Diem() {
  const [scores, setScores] = useState([]);
  const [formData, setFormData] = useState({
    ma_diem: "",
    ma_sv: "",
    ma_lop_mh: "",
    diem_cc: "",
    diem_gk: "",
    diem_ck: "",
    ma_pdt: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Dữ liệu từ backend:", response.data);
      setScores(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy điểm:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.ma_sv || !formData.ma_lop_mh || !formData.diem_cc || !formData.diem_gk || !formData.diem_ck) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(API_BASE_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchScores();
      resetForm();
      setSuccessMessage("Thêm điểm thành công!");
      setTimeout(() => setSuccessMessage(""), 1000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("Mã sinh viên không tồn tại.");
      } else if (error.response && error.response.status === 500) {
        setError("Lỗi hệ thống. Vui lòng thử lại sau.");
      } else {
        setError("Lỗi khi thêm điểm: " + error.message);
      }
      console.error("Lỗi khi thêm điểm:", error);
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
      setTimeout(() => setSuccessMessage(""), 1000);
    } catch (error) {
      setError("Lỗi khi sửa điểm");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchScores();
      setSuccessMessage("Xóa điểm thành công!");
      setTimeout(() => setSuccessMessage(""), 1000);
    } catch (error) {
      setError(`Lỗi khi xóa điểm: ${error.response?.data?.message || error.message}`);
      console.error("Lỗi khi xóa điểm:", error);
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
      ma_pdt: "",
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
      <h2>Quản lý điểm</h2>
      {error && <div className="diem-manager-error-message">{error}</div>}
      {successMessage && <div className="diem-manager-success-message">{successMessage}</div>}
      <form className="diem-manager-form-container">
        <input
          type="text"
          name="ma_sv"
          placeholder="Mã SV"
          value={formData.ma_sv}
          onChange={(e) => setFormData({ ...formData, ma_sv: e.target.value })}
        />
        <input
          type="text"
          name="ma_lop_mh"
          placeholder="Mã lớp môn học"
          value={formData.ma_lop_mh}
          onChange={(e) => setFormData({ ...formData, ma_lop_mh: e.target.value })}
        />
        <input
          type="text"
          name="ma_pdt"
          placeholder="Mã PDT"
          value={formData.ma_pdt}
          onChange={(e) => setFormData({ ...formData, ma_pdt: e.target.value })}
        />
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
