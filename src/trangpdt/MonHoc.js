import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MonHoc.css"; // Nếu cần

const API_BASE_URL = "https://server-quanlydiemsinhvien-production.up.railway.app/api/subjects";

function MonHoc() {
  const [monHocs, setMonHocs] = useState([]);
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

  const handleAddMonHoc = async () => {
    if (!maMh || !tenMon || !soTinChi || !maBoMon) {
      setError("Tất cả các trường đều phải được điền đầy đủ.");
      setTimeout(() => setError(""), 1000);
      return;
    }
    try {
      const response = await axios.post(
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
      setError("Mã môn học không tồn tại.");
      setTimeout(() => setError(""), 1000);
    }
  };
  

  const handleDeleteMonHoc = async (maMh) => {
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
      const response = await axios.put(
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
      <h2 style={{ textAlign: "center" }}>Quản lý Môn Học</h2>

      {error && <div className="monhoc-error-message">{error}</div>}
      {message && <div className="monhoc-success-message">{message}</div>}

      <div className="form-container">
        <input
          type="text"
          placeholder="Mã môn học"
          value={maMh}
          onChange={(e) => setMaMh(e.target.value)}
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
        <input
          type="text"
          placeholder="Mã bộ môn"
          value={maBoMon}
          onChange={(e) => setMaBoMon(e.target.value)}
        />

        <button onClick={handleAddMonHoc} disabled={isEditing}>
          Thêm Môn Học
        </button>
        <button onClick={handleUpdateMonHoc} disabled={!isEditing}>
          Cập Nhật Môn Học
        </button>
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
