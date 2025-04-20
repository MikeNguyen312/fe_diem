import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/TaoTaiKhoan.css';

const TaoTaiKhoan = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "SV",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchUsers();
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://server-quanlydiemsinhvien-production.up.railway.app/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
      setError("Không thể tải danh sách người dùng.");
      clearMessages();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        await axios.put(
          `https://server-quanlydiemsinhvien-production.up.railway.app/api/users/${editingUserId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage("Cập nhật tài khoản thành công!");
        setEditingUserId(null);
      } else {
        await axios.post(
          "https://server-quanlydiemsinhvien-production.up.railway.app/api/auth/register",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage("Tạo tài khoản thành công!");
      }

      setFormData({
        username: "",
        password: "",
        role: "SV",
      });
      fetchUsers();
    } catch (error) {
      console.error("Lỗi khi xử lý người dùng:", error);
      setError("Đã xảy ra lỗi. Vui lòng kiểm tra lại thông tin.");
    }
    clearMessages();
  };

  const handleEdit = (user) => {
    setFormData({
      username: user.username,
      password: "",
      role: user.role,
    });
    setEditingUserId(user.id); 
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?");
    
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://server-quanlydiemsinhvien-production.up.railway.app/api/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage("Xóa tài khoản thành công!");
        fetchUsers();
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        setError("Không thể xóa người dùng.");
      }
      clearMessages();
    } else {
      setMessage("Hành động xóa bị hủy.");
      clearMessages();
    }
  };
  

  const handleCancel = () => {
    setEditingUserId(null);
    setFormData({
      username: "",
      password: "",
      role: "SV",
    });
  };

  const clearMessages = () => {
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  if (userRole !== "PDT") {
    return <p>Bạn không có quyền truy cập trang này.</p>;
  }

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="taikhoan-manager-container">
      <h2>Quản lí tài khoản</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="taikhoan-manager-form-container">
        <input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required={!editingUserId}
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="SV">Sinh viên</option>
          <option value="GV">Giảng viên</option>
          <option value="PDT">Phòng đào tạo</option>
        </select>

        <button
          type="submit"
          className="taikhoan-manager-button"
          disabled={editingUserId}
        >
          Thêm mới
        </button>

        <button
          type="submit"
          className="taikhoan-manager-button"
          disabled={!editingUserId}
        >
          Cập nhật
        </button>

        {editingUserId && (
          <button
            type="button"
            onClick={handleCancel}
            className="taikhoan-manager-button cancel-button"
          >
            Hủy
          </button>
        )}
      </form>

      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên đăng nhập"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="taikhoan-manager-table">
        <thead>
          <tr>
            <th>Tên đăng nhập</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Sửa</button>
                <button onClick={() => handleDelete(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaoTaiKhoan;
