import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SinhVien.css";

const API_BASE_URL = "https://server-quanlydiemsinhvien-production.up.railway.app/api/students";

function SinhVien() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    ma_sv: "",
    ho_ten: "",
    ngay_sinh: "",
    gioi_tinh: "Nam",
    email: "",
    ma_lop: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sinh viên:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.ma_sv || !formData.ho_ten || !formData.ngay_sinh || !formData.email || !formData.ma_lop) {
      setError("Vui lòng điền đầy đủ thông tin");
      setTimeout(() => setError(""), 1000);
      return;
    }
    try {
      const existingStudent = students.find((student) => student.ma_sv === formData.ma_sv);
      if (existingStudent) {
        setError("Mã sinh viên đã tồn tại");
        setTimeout(() => setError(""), 1000);
        return;
      }

      const token = localStorage.getItem("token");
      await axios.post(API_BASE_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
      setSuccessMessage("Thêm sinh viên thành công");
      setTimeout(() => setSuccessMessage(""), 1000);
      resetForm();
    } catch (error) {
      setError("Lỗi khi thêm sinh viên");
      setTimeout(() => setError(""), 1000);
      console.error(error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!formData.ma_sv || !formData.ho_ten || !formData.ngay_sinh || !formData.email || !formData.ma_lop) {
      setError("Vui lòng điền đầy đủ thông tin");
      setTimeout(() => setError(""), 1000);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/${selectedId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
      setSuccessMessage("Cập nhật sinh viên thành công");
      setTimeout(() => setSuccessMessage(""), 1000);
      resetForm();
    } catch (error) {
      setError("Lỗi khi sửa sinh viên");
      setTimeout(() => setError(""), 1000);
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
      setSuccessMessage("Xóa sinh viên thành công");
      setTimeout(() => setSuccessMessage(""), 1000);
    } catch (error) {
      setError("Lỗi khi xóa sinh viên");
      setTimeout(() => setError(""), 1000);
      console.error(error);
    }
  };

  const handleEditClick = (student) => {
    setIsEditing(true);
    setSelectedId(student.id);
    setFormData({
      ma_sv: student.ma_sv,
      ho_ten: student.ho_ten,
      ngay_sinh: student.ngay_sinh.split("T")[0],
      gioi_tinh: student.gioi_tinh,
      email: student.email,
      ma_lop: student.ma_lop,
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedId(null);
    setFormData({
      ma_sv: "",
      ho_ten: "",
      ngay_sinh: "",
      gioi_tinh: "Nam",
      email: "",
      ma_lop: "",
    });
    setError("");
    setTimeout(() => setSuccessMessage(""), 1000);
  };

  return (
    <div className="sinhvien-manager-container">
      <h2>Quản lý sinh viên</h2>

      {error && <div className="sinhvien-error-message">{error}</div>}
      {successMessage && <div className="sinhvien-success-message">{successMessage}</div>}

      <form className="form-container">
        <input
          type="text"
          name="ma_sv"
          placeholder="Mã SV"
          value={formData.ma_sv}
          onChange={(e) => setFormData({ ...formData, ma_sv: e.target.value })}
          disabled={isEditing}
        />
        <input
          type="text"
          name="ho_ten"
          placeholder="Họ tên"
          value={formData.ho_ten}
          onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
        />
        <input
          type="date"
          name="ngay_sinh"
          value={formData.ngay_sinh}
          onChange={(e) => setFormData({ ...formData, ngay_sinh: e.target.value })}
        />
        <select
          name="gioi_tinh"
          value={formData.gioi_tinh}
          onChange={(e) => setFormData({ ...formData, gioi_tinh: e.target.value })}
        >
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="text"
          name="ma_lop"
          placeholder="Mã lớp"
          value={formData.ma_lop}
          onChange={(e) => setFormData({ ...formData, ma_lop: e.target.value })}
        />

        <button type="button" onClick={handleAdd} disabled={isEditing}>
          Thêm sinh viên
        </button>

        <button type="button" onClick={handleEdit} disabled={!isEditing}>
          Cập nhật sinh viên
        </button>
      </form>

      <table className="sinhvien-table">
        <thead>
          <tr>
            <th>Mã SV</th>
            <th>Họ tên</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Email</th>
            <th>Mã lớp</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.ma_sv}</td>
              <td>{student.ho_ten}</td>
              <td>{student.ngay_sinh ? student.ngay_sinh.split("T")[0] : ""}</td>
              <td>{student.gioi_tinh}</td>
              <td>{student.email}</td>
              <td>{student.ma_lop}</td>
              <td>
                <button onClick={() => handleEditClick(student)}>Sửa</button>
                <button onClick={() => handleDelete(student.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SinhVien;
