import React, { useState } from "react";
import '../stylesgv/QuanLiLopMH.css';

function QuanLiLopMH() {
    const [lopMonHocs, setLopMonHocs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [form, setForm] = useState({
        ma_lop_mh: '',
        ma_mh: '',
        ma_gv: '',
        hoc_ky: '',
        nam_hoc: '',
        trong_so_cc: '',
        trong_so_gk: '',
        trong_so_ck: '',
        sinh_vien_toi_da: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = () => {
        if (form.trong_so_cc * 1 + form.trong_so_gk * 1 + form.trong_so_ck * 1 !== 100) {
            alert("Tổng trọng số phải bằng 100%");
            return;
        }
        setLopMonHocs([...lopMonHocs, { ...form }]);
        setForm({
            ma_lop_mh: '',
            ma_mh: '',
            ma_gv: '',
            hoc_ky: '',
            nam_hoc: '',
            trong_so_cc: '',
            trong_so_gk: '',
            trong_so_ck: '',
            sinh_vien_toi_da: '',
        });
    };

    const handleDelete = (ma_lop_mh) => {
        setLopMonHocs(lopMonHocs.filter(item => item.ma_lop_mh !== ma_lop_mh));
    };

    // Lọc dữ liệu theo searchTerm
    const filteredLopMonHocs = lopMonHocs.filter(item =>
        item.ma_lop_mh.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="lopmonhoc-container">
            <h2>Quản lý lớp môn học</h2>

            <div className="form-container">
                <input type="text" name="ma_lop_mh" placeholder="Mã lớp MH" value={form.ma_lop_mh} onChange={handleChange} />
                <input type="text" name="ma_mh" placeholder="Mã MH" value={form.ma_mh} onChange={handleChange} />
                <input type="text" name="ma_gv" placeholder="Mã GV" value={form.ma_gv} onChange={handleChange} />
                <input type="text" name="hoc_ky" placeholder="Học kỳ" value={form.hoc_ky} onChange={handleChange} />
                <input type="text" name="nam_hoc" placeholder="Năm học" value={form.nam_hoc} onChange={handleChange} />
                <input type="number" name="trong_so_cc" placeholder="Trọng số CC" value={form.trong_so_cc} onChange={handleChange} />
                <input type="number" name="trong_so_gk" placeholder="Trọng số GK" value={form.trong_so_gk} onChange={handleChange} />
                <input type="number" name="trong_so_ck" placeholder="Trọng số CK" value={form.trong_so_ck} onChange={handleChange} />
                <input type="number" name="sinh_vien_toi_da" placeholder="Số SV tối đa" value={form.sinh_vien_toi_da} onChange={handleChange} />
                <div className="them_lmh">
                    <button onClick={handleAdd}>Thêm lớp môn học</button>
                </div>
            </div>

            <h3>Danh sách lớp môn học</h3>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Nhập mã lớp môn học"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Mã lớp MH</th>
                        <th>Mã MH</th>
                        <th>Mã GV</th>
                        <th>Học kỳ</th>
                        <th>Năm học</th>
                        <th>Trọng số CC</th>
                        <th>Trọng số GK</th>
                        <th>Trọng số CK</th>
                        <th>Số SV tối đa</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLopMonHocs.length > 0 ? (
                        filteredLopMonHocs.map((item) => (
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
                                <td><button onClick={() => handleDelete(item.ma_lop_mh)}>Xóa</button></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>Không tìm thấy dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default QuanLiLopMH;
