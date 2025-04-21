import React, { useEffect, useState } from "react";
import axios from "axios";
import '../stylessv/DangKyMonHoc.css';

const DangKyMonHoc = () => {
    const [subjects, setSubjects] = useState([]);
    const [error, setError] = useState("");
    const [newMaLopMH, setNewMaLopMH] = useState("");
    const [updateOldMaLopMH, setUpdateOldMaLopMH] = useState("");
    const [updateNewMaLopMH, setUpdateNewMaLopMH] = useState("");
    const [deleteMaLopMH, setDeleteMaLopMH] = useState("");
    const [message, setMessage] = useState("");

    const masv = localStorage.getItem("masv");
    const token = localStorage.getItem("token");

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(
                `https://server-quanlydiemsinhvien-production.up.railway.app/api/register-subject/${masv}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200 && response.data.length > 0) {
                setSubjects(response.data);
                setError("");
            } else {
                setSubjects([]);
                setError("Không có môn học nào được đăng ký.");
            }
        } catch (err) {
            console.error("Lỗi khi lấy danh sách môn học:", err);
            setError("Không thể tải danh sách môn học. Vui lòng thử lại.");
        }
    };

    useEffect(() => {
        if (!masv || !token) {
            setError("Bạn chưa đăng nhập!");
            return;
        }
        fetchSubjects();
    }, [masv, token]);

    // --- Thêm đăng ký ---
    const handleRegister = async () => {
        try {
            const res = await axios.post(
                `https://server-quanlydiemsinhvien-production.up.railway.app/api/register-subject`,
                { ma_sv: masv, ma_lop_mh: newMaLopMH }, // Đổi tên 'masv' thành 'ma_sv'
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage(res.data.message);
            setNewMaLopMH("");
            fetchSubjects(); // Tự động load lại dữ liệu
        } catch (err) {
            setMessage(err.response?.data?.message || "Lỗi khi đăng ký môn học");
        }
    };
    

    // --- Cập nhật đăng ký ---
    const handleUpdate = async () => {
        try {
            const res = await axios.put(
                `https://server-quanlydiemsinhvien-production.up.railway.app/api/register-subject/${masv}/${updateOldMaLopMH}`,
                { new_ma_lop_mh: updateNewMaLopMH },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage(res.data.message);
            setUpdateOldMaLopMH("");
            setUpdateNewMaLopMH("");
            fetchSubjects(); // Load lại danh sách
        } catch (err) {
            setMessage(err.response?.data?.message || "Lỗi khi cập nhật đăng ký");
        }
    };

    // --- Xóa đăng ký ---
    const handleDelete = async () => {
        try {
            const res = await axios.delete(
                `https://server-quanlydiemsinhvien-production.up.railway.app/api/register-subject/${masv}/${deleteMaLopMH}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage(res.data.message);
            setDeleteMaLopMH("");
            fetchSubjects(); // Load lại danh sách
        } catch (err) {
            setMessage(err.response?.data?.message || "Lỗi khi xóa đăng ký");
        }
    };

    return (
        <div>
            <h2>Danh sách môn học đã đăng ký</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            {subjects.length > 0 ? (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Mã sinh viên</th>
                            <th>Mã lớp MH</th>
                            <th>Học kỳ</th>
                            <th>Năm học</th>
                            <th>Mã môn</th>
                            <th>Tên môn</th>
                            <th>Số tín chỉ</th>
                            <th>Bộ môn</th>
                            <th>Khoa</th>
                            <th>Lớp</th>
                            <th>GV phụ trách</th>
                            <th>Email GV</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject, index) => (
                            <tr key={index}>
                                <td>{subject.ma_sv}</td>
                                <td>{subject.ma_lop_mh}</td>
                                <td>{subject.hoc_ky}</td>
                                <td>{subject.nam_hoc}</td>
                                <td>{subject.ma_mh}</td>
                                <td>{subject.ten_mh}</td>
                                <td>{subject.so_tin_chi}</td>
                                <td>{subject.ten_bo_mon}</td>
                                <td>{subject.ten_khoa}</td>
                                <td>{subject.ten_lop}</td>
                                <td>{subject.giang_vien.ho_ten}</td>
                                <td>{subject.giang_vien.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !error && <p>Không có môn học nào được đăng ký.</p>
            )}

            {/* --------- Các chức năng thêm, cập nhật, xóa --------- */}
            <div style={{ marginTop: "20px" }}>
                <h3>Đăng ký môn học mới</h3>
                <input
                    type="text"
                    placeholder="Nhập mã lớp môn học"
                    value={newMaLopMH}
                    onChange={(e) => setNewMaLopMH(e.target.value)}
                />
                <button onClick={handleRegister}>Đăng ký</button>
            </div>

            <div style={{ marginTop: "20px" }}>
                <h3>Cập nhật đăng ký môn học</h3>
                <input
                    type="text"
                    placeholder="Mã lớp MH cũ"
                    value={updateOldMaLopMH}
                    onChange={(e) => setUpdateOldMaLopMH(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Mã lớp MH mới"
                    value={updateNewMaLopMH}
                    onChange={(e) => setUpdateNewMaLopMH(e.target.value)}
                />
                <button onClick={handleUpdate}>Cập nhật</button>
            </div>

            <div style={{ marginTop: "20px" }}>
                <h3>Xóa đăng ký môn học</h3>
                <input
                    type="text"
                    placeholder="Nhập mã lớp môn học cần xóa"
                    value={deleteMaLopMH}
                    onChange={(e) => setDeleteMaLopMH(e.target.value)}
                />
                <button onClick={handleDelete}>Xóa</button>
            </div>
        </div>
    );
};

export default DangKyMonHoc;
