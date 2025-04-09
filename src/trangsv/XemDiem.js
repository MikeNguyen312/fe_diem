import React from "react";
import '../stylessv/XemDiem.css';

const thongTinSinhVien = {
  id: 1,
  ma_sv: "SV001",
  ho_ten: "Nguyễn Văn A",
  ngay_sinh: "2002-05-15",
  gioi_tinh: "Nam",
  email: "vana@example.com",
  ma_lop: "DHKTPM15A",
};

const bangDiem = [
  { ma_diem: "D001", ma_lop_mh: "LPMH01", ten_mon: "Lập trình C++", so_tin_chi: 3, diem_cc: 8, diem_gk: 7.5, diem_ck: 8.5 },
  { ma_diem: "D002", ma_lop_mh: "LPMH02", ten_mon: "Cơ sở dữ liệu", so_tin_chi: 3, diem_cc: 7, diem_gk: 7.0, diem_ck: 8.0 },
  { ma_diem: "D003", ma_lop_mh: "LPMH03", ten_mon: "Kinh tế học", so_tin_chi: 2, diem_cc: 6.5, diem_gk: 6.0, diem_ck: 7.0 },
  { ma_diem: "D004", ma_lop_mh: "LPMH04", ten_mon: "Vật lý đại cương", so_tin_chi: 3, diem_cc: 9, diem_gk: 8.5, diem_ck: 9.5 },
];

function XemDiem() {
  return (
    <div className="sv-container">
      <h1>Xem điểm sinh viên</h1>

      <div className="info-box">
        <div><strong>Mã SV:</strong> {thongTinSinhVien.ma_sv}</div>
        <div><strong>Họ tên:</strong> {thongTinSinhVien.ho_ten}</div>
        <div><strong>Ngày sinh:</strong> {thongTinSinhVien.ngay_sinh}</div>
        <div><strong>Giới tính:</strong> {thongTinSinhVien.gioi_tinh}</div>
        <div><strong>Email:</strong> {thongTinSinhVien.email}</div>
        <div><strong>Lớp:</strong> {thongTinSinhVien.ma_lop}</div>
      </div>

      <h2>Bảng điểm</h2>
      <table className="diem-table">
        <thead>
          <tr>
            <th>Mã điểm</th>
            <th>Mã MH</th>
            <th>Tên môn</th>
            <th>Số tín chỉ</th>
            <th>Điểm CC</th>
            <th>Điểm GK</th>
            <th>Điểm CK</th>
            <th>Tổng điểm</th>
          </tr>
        </thead>
        <tbody>
          {bangDiem.map((item) => (
            <tr key={item.ma_diem}>
              <td>{item.ma_diem}</td>
              <td>{item.ma_lop_mh}</td>
              <td>{item.ten_mon}</td>
              <td>{item.so_tin_chi}</td>
              <td>{item.diem_cc}</td>
              <td>{item.diem_gk}</td>
              <td>{item.diem_ck}</td>
              <td>{((item.diem_cc + item.diem_gk + item.diem_ck) / 3).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default XemDiem;
