import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SinhVien.css";

const API_BASE_URL = "https://server-quanlydiemsinhvien-production-e8d7.up.railway.app/api/students";
const CLASS_API_URL = "https://server-quanlydiemsinhvien-production-e8d7.up.railway.app/api/class-subject/getAllClass";

function SinhVien() {
  const [students, setStudents] = useState([]);
  const [classList, setClassList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
    fetchClassList();
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

  const fetchClassList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(CLASS_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setClassList(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lớp:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      ma_sv: "",
      ho_ten: "",
      ngay_sinh: "",
      gioi_tinh: "Nam",
      email: "",
      ma_lop: "",
    });
    setIsEditing(false);
    setSelectedId(null);
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
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?");
    if (!confirmDelete) return;
  
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
  
    const formattedDate = formatDate(student.ngay_sinh);
  
    setFormData({
      ma_sv: student.ma_sv,
      ho_ten: student.ho_ten,
      ngay_sinh: formattedDate,  
      gioi_tinh: student.gioi_tinh,
      email: student.email,
      ma_lop: student.ma_lop,
    });
  };
  
  
  const formatDate = (dateString) => {
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  
  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="sinhvien-manager-container">
      <h2>Quản lí sinh viên</h2>

      {error && <p className="sinhvien-error-message">{error}</p>}
      {successMessage && <p className="sinhvien-success-message">{successMessage}</p>}
      <form className="sinhvien-form">
      <div className="form-tren">
        <input
          type="text"
          name="ma_sv"
          placeholder="Mã sinh viên"
          value={formData.ma_sv}
          onChange={handleChange}
          disabled={isEditing}
        />
        <input
          type="text"
          name="ho_ten"
          placeholder="Họ tên"
          value={formData.ho_ten}
          onChange={handleChange}
        />
        <input
          type="date"
          name="ngay_sinh"
          value={formData.ngay_sinh}
          onChange={handleChange}
        />
      </div>
        <div className="form-duoi">
          <select className="chon" name="gioi_tinh" value={formData.gioi_tinh} onChange={handleChange}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <select className="chon" name="ma_lop" value={formData.ma_lop} onChange={handleChange}>
            <option value="">Chọn lớp</option>
            {classList.map((lop) => (
              <option key={lop.ma_lop} value={lop.ma_lop}>
                {lop.ma_lop}
              </option>
            ))}
          </select>
        </div>
        <div className="form-container">
          <button type="button" onClick={handleAdd} disabled={isEditing}>
            Thêm sinh viên
          </button>
          <button type="button" onClick={handleEdit} disabled={!isEditing}>
            Cập nhật sinh viên
          </button>
          {isEditing && (
              <button
                type="button"
                className="sinhvien-button cancel-button"
                onClick={handleCancel}
              >
                Hủy
              </button>
          )}
        </div>
      </form>

      <div className="search-container">~
        <input
          type="text"
          placeholder="Tìm kiếm theo mã SV hoặc họ tên"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          style={{ padding: "8px", width: "250px" }}
        />
      </div>

      <div className="sinhvien-table-container">
        <table className="sinhvien-table">
          <thead>
            <tr>
              <th>Mã SV</th>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Email</th>
              <th>Mã lớp</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
          {students
            .filter(
              (sv) =>
                sv.ma_sv.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sv.ho_ten.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((sv) => (
              <tr key={sv.ma_sv}>
                <td>{sv.ma_sv}</td>
                <td>{sv.ho_ten}</td>
                <td>{sv.ngay_sinh}</td>
                <td>{sv.gioi_tinh}</td>
                <td>{sv.email}</td>
                <td>{sv.ma_lop}</td>
                <td>
                  <button onClick={() => handleEditClick(sv)}>Sửa</button>
                  <button onClick={() => handleDelete(sv.id)}>Xóa</button>
                </td>
              </tr>
          ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SinhVien;




// npm install react-datepicker
// npm install date-fns
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { parseISO } from "date-fns";
// import { format } from "date-fns";

// ...

// <DatePicker
//   selected={formData.ngay_sinh ? parseISO(formData.ngay_sinh) : null}
//   onChange={(date) => {
//     const formattedDate = format(date, "yyyy-MM-dd"); // để gửi đúng về backend
//     setFormData({ ...formData, ngay_sinh: formattedDate });
//   }}
//   dateFormat="dd/MM/yyyy" // định dạng hiển thị trên input
//   placeholderText="Ngày sinh (dd/mm/yyyy)"
// />
// <label>
//   Ngày sinh (dd/mm/yyyy):
//   <input
//     type="date"
//     name="ngay_sinh"
//     value={formData.ngay_sinh}
//     onChange={handleChange}
//   />
// </label>
