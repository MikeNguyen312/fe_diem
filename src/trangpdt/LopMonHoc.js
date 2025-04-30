import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/LopMonHoc.css";

const apiBase = "https://server-quanlydiemsinhvien-production-e8d7.up.railway.app";

const LopMonHoc = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    ma_lop_mh: "",
    ma_mh: "",
    ma_gv: "",
    hoc_ky: "",
    nam_hoc: "",
    trong_so_cc: "",
    trong_so_gk: "",
    trong_so_ck: "",
    sinh_vien_toi_da: "",
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [subjects, setSubjects] = useState([]); 
  const [teachers, setTeachers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiBase}/api/class-subject`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lớp môn học:", error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [classRes, subjectsRes, teachersRes] = await Promise.all([
          axios.get(`${apiBase}/api/class-subject`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiBase}/api/subjects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiBase}/api/teachers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        setData(classRes.data.data);
        setFilteredData(classRes.data.data);
        setSubjects(subjectsRes.data);
        setTeachers(teachersRes.data);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };
  
    if (token) fetchAll();
  }, [token]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const ts_cc = Number(formData.trong_so_cc);
    const ts_gk = Number(formData.trong_so_gk);
    const ts_ck = Number(formData.trong_so_ck);
    const totalWeight = ts_cc + ts_gk + ts_ck;
  
    if (totalWeight !== 100) {
      setError("Tổng trọng số (CC + GK + CK) phải bằng 100");
      setTimeout(() => setError(""), 2000);
      return;
    }
  
    try {
      if (editing) {
        await axios.put(`${apiBase}/api/class-subject/update/${formData.ma_lop_mh}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Cập nhật lớp môn học thành công.");
      } else {
        await axios.post(`${apiBase}/api/class-subject/create`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Thêm lớp môn học thành công.");
      }
  
      setFormData({
        ma_lop_mh: "",
        ma_mh: "",
        ma_gv: "",
        hoc_ky: "",
        nam_hoc: "",
        trong_so_cc: "",
        trong_so_gk: "",
        trong_so_ck: "",
        sinh_vien_toi_da: "",
      });
      setEditing(false);
      fetchData();
    } catch (err) {
      setError("Lỗi khi lưu lớp môn học.");
    }
  
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 1000);
  };
  

  const handleEdit = (item) => {
    setFormData(item);
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      ma_lop_mh: "",
      ma_mh: "",
      ma_gv: "",
      hoc_ky: "",
      nam_hoc: "",
      trong_so_cc: "",
      trong_so_gk: "",
      trong_so_ck: "",
      sinh_vien_toi_da: "",
    });
    setEditing(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa lớp môn học này?")) {
      try {
        await axios.delete(`${apiBase}/api/class-subject/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Xóa lớp môn học thành công.");
        fetchData();
      } catch (err) {
        setError("Lỗi khi xóa lớp môn học.");
      }
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 1000);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = data.filter((item) =>
      item.ma_lop_mh.toLowerCase().includes(query) ||
      item.ma_mh.toLowerCase().includes(query) ||
      item.ma_gv.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  return (
    <div>
      <h2>Quản lí lớp môn học</h2>

      {message && <div className="lopmonhoc-success-message">{message}</div>}
      {error && <div className="lopmonhoc-error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="lopmonhoc-form-container">
        <input type="text" name="ma_lop_mh" placeholder="Mã lớp MH" value={formData.ma_lop_mh} onChange={handleChange} required disabled={editing} />
        
        <select name="ma_mh" value={formData.ma_mh} onChange={handleChange} required>
          <option value="">Chọn mã môn học</option>
          {subjects && subjects.map((subject) => (
            <option key={subject.ma_mh} value={subject.ma_mh}>
              {subject.ma_mh}
            </option>
          ))}
        </select>

        <select name="ma_gv" value={formData.ma_gv} onChange={handleChange} required>
          <option value="">Chọn mã giảng viên</option>
          {teachers && teachers.map((teacher) => (
            <option key={teacher.ma_gv} value={teacher.ma_gv}>
              {teacher.ho_ten} - {teacher.ma_gv}
            </option>
          ))}
        </select>

        <input type="number" name="hoc_ky" placeholder="Học kỳ" value={formData.hoc_ky} onChange={handleChange} required />
        <input type="text" name="nam_hoc" placeholder="Năm học" value={formData.nam_hoc} onChange={handleChange} required />
        <input type="number" name="trong_so_cc" placeholder="Trọng số CC" value={formData.trong_so_cc} onChange={handleChange} required />
        <input type="number" name="trong_so_gk" placeholder="Trọng số GK" value={formData.trong_so_gk} onChange={handleChange} required />
        <input type="number" name="trong_so_ck" placeholder="Trọng số CK" value={formData.trong_so_ck} onChange={handleChange} required />
        <input type="number" name="sinh_vien_toi_da" placeholder="SV tối đa" value={formData.sinh_vien_toi_da} onChange={handleChange} required />

        <button type="submit" className="lopmonhoc-button" disabled={editing}>
          Thêm lớp môn học
        </button>

        <button type="submit" className="lopmonhoc-button" disabled={!editing}>
          Cập nhật lớp môn học
        </button>

        {editing && (
          <button type="button" className="lopmonhoc-button cancel-button" onClick={handleCancel}>
            Hủy
          </button>
        )}
      </form>

      <div className="lopmonhoc-search-container">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã lớp, mã môn, mã GV..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <table className="lopmonhoc-table">
        <thead>
          <tr>
            <th>Mã lớp MH</th>
            <th>Mã MH</th>
            <th>Mã GV</th>
            <th>Học kỳ</th>
            <th>Năm học</th>
            <th>CC</th>
            <th>GK</th>
            <th>CK</th>
            <th>SV tối đa</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.ma_lop_mh}>
                <td>{item.ma_lop_mh}</td>
                <td>{item.ma_mh}</td>
                <td>{item.ma_gv}</td>
                <td>{item.hoc_ky}</td>
                <td>{item.nam_hoc}</td>
                <td>{item.trong_so_cc}</td>
                <td>{item.trong_so_gk}</td>
                <td>{item.trong_so_ck}</td>
                <td>{item.sinh_vien_toi_da}</td>
                <td>
                  <button onClick={() => handleEdit(item)} disabled={editing}>Sửa</button>
                  <button onClick={() => handleDelete(item.ma_lop_mh)} disabled={editing}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">Không tìm thấy lớp môn học phù hợp.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LopMonHoc;
