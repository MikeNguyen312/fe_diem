import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MonHoc.css";

const API_BASE_URL = "https://server-quanlydiemsinhvien-production-e8d7.up.railway.app/api/subjects";

function MonHoc() {
  const [monHocs, setMonHocs] = useState([]);
  const [dsBoMon, setDsBoMon] = useState([]);
  const [maMh, setMaMh] = useState("");
  const [tenMon, setTenMon] = useState("");
  const [soTinChi, setSoTinChi] = useState("");
  const [maBoMon, setMaBoMon] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMonHocs();
    fetchBoMons();
  }, []);

  const fetchMonHocs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonHocs(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách môn học:", error);
    }
  };

  const fetchBoMons = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/bo-mon/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDsBoMon(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bộ môn:", error);
    }
  };

  const handleAddMonHoc = async () => {
    if (!maMh || !tenMon || !soTinChi || !maBoMon) {
      setError("Tất cả các trường đều phải được điền đầy đủ.");
      setTimeout(() => setError(""), 1000);
      return;
    }
    try {
      await axios.post(
        API_BASE_URL,
        {
          ma_mh: maMh,
          ten_mon: tenMon,
          so_tin_chi: soTinChi,
          ma_bo_mon: maBoMon,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Thêm môn học thành công!");
      setTimeout(() => setMessage(""), 1000);
      fetchMonHocs();
      clearForm();
    } catch (error) {
      console.error("Lỗi khi thêm môn học:", error);
      setError("Mã môn học đã tồn tại hoặc dữ liệu không hợp lệ.");
      setTimeout(() => setError(""), 1000);
    }
  };

  const handleDeleteMonHoc = async (maMh) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa môn học này?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`${API_BASE_URL}/${maMh}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessage("Xóa môn học thành công!");
      setTimeout(() => setMessage(""), 1000);
      fetchMonHocs();
    } catch (error) {
      console.error("Lỗi khi xóa môn học:", error);
      setError("Có lỗi xảy ra khi xóa môn học.");
      setTimeout(() => setError(""), 1000);
    }
  };
  
  const handleEditMonHoc = (monHoc) => {
    setMaMh(monHoc.ma_mh);
    setTenMon(monHoc.ten_mon);
    setSoTinChi(monHoc.so_tin_chi);
    setMaBoMon(monHoc.ma_bo_mon);
    setIsEditing(true);
  };

  const handleUpdateMonHoc = async () => {
    if (!maMh || !tenMon || !soTinChi || !maBoMon) {
      setError("Tất cả các trường đều phải được điền đầy đủ.");
      setTimeout(() => setError(""), 1000);
      return;
    }
    try {
      await axios.put(
        `${API_BASE_URL}/${maMh}`,
        {
          ten_mon: tenMon,
          so_tin_chi: soTinChi,
          ma_bo_mon: maBoMon,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Cập nhật môn học thành công!");
      setTimeout(() => setMessage(""), 1000);
      fetchMonHocs();
      clearForm();
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật môn học:", error);
      setError("Có lỗi xảy ra khi cập nhật môn học.");
      setTimeout(() => setError(""), 1000);
    }
  };

  const handleCancelEdit = () => {
    clearForm();
    setIsEditing(false);
  };

  const clearForm = () => {
    setMaMh("");
    setTenMon("");
    setSoTinChi("");
    setMaBoMon("");
    setError("");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMonHocs = monHocs.filter((monHoc) =>
    monHoc.ma_mh.toLowerCase().includes(searchQuery.toLowerCase()) ||
    monHoc.ten_mon.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="monhoc-container">
      <h2 style={{ textAlign: "center" }}>Quản lí Môn Học</h2>

      {error && <div className="monhoc-error-message">{error}</div>}
      {message && <div className="monhoc-success-message">{message}</div>}

      <div className="form-container">
        <input
          type="text"
          placeholder="Mã môn học"
          value={maMh}
          onChange={(e) => setMaMh(e.target.value)}
          disabled={isEditing}
        />
        <input
          type="text"
          placeholder="Tên môn học"
          value={tenMon}
          onChange={(e) => setTenMon(e.target.value)}
        />
        <input
          type="number"
          placeholder="Số tín chỉ"
          value={soTinChi}
          onChange={(e) => setSoTinChi(e.target.value)}
        />
        <select
          className="chon"
          value={maBoMon} 
          onChange={(e) => setMaBoMon(e.target.value)}
        > 
          <option value="">Chọn Mã Bộ Môn</option>
          {dsBoMon.map((boMon, index) => (
            <option key={index} value={boMon.ma_bo_mon}>
              {boMon.ma_bo_mon}
            </option>
          ))}
        </select>
      </div>

      <div className="button-group">
        <button className="monhoc-button" onClick={handleAddMonHoc} disabled={isEditing}>
          Thêm Môn Học
        </button>
        <button className="monhoc-button" onClick={handleUpdateMonHoc} disabled={!isEditing}>
          Cập Nhật Môn Học
        </button>
        {isEditing && (
          <button className="monhoc-button cancel-button" onClick={handleCancelEdit}>
            Hủy
          </button>
        )}
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm môn học..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <table className="subject-table">
        <thead>
          <tr>
            <th>Mã Môn</th>
            <th>Tên Môn</th>
            <th>Số Tín Chỉ</th>
            <th>Mã Bộ Môn</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredMonHocs.length > 0 ? (
            filteredMonHocs.map((monHoc) => (
              <tr key={monHoc.ma_mh}>
                <td>{monHoc.ma_mh}</td>
                <td>{monHoc.ten_mon}</td>
                <td>{monHoc.so_tin_chi}</td>
                <td>{monHoc.ma_bo_mon}</td>
                <td>
                  <button onClick={() => handleEditMonHoc(monHoc)}>Sửa</button>
                  <button onClick={() => handleDeleteMonHoc(monHoc.ma_mh)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MonHoc;
