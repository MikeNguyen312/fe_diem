import React, { useState } from "react";
import '../stylessv/DangKyMonHoc.css'
const danhSachMonHoc = [
  { ma_mh: "CT101", ten_mon: "Lập trình C++", so_tin_chi: 3, ma_bo_mon: "CNTT" },
  { ma_mh: "CT102", ten_mon: "Cơ sở dữ liệu", so_tin_chi: 3, ma_bo_mon: "CNTT" },
  { ma_mh: "CT103", ten_mon: "Mạng máy tính", so_tin_chi: 3, ma_bo_mon: "CNTT" },
  { ma_mh: "CT104", ten_mon: "Hệ điều hành", so_tin_chi: 3, ma_bo_mon: "CNTT" },
];

const DangKyMonHoc = () => {
  const [monHocDaChon, setMonHocDaChon] = useState([]);
  const [monHocDaDangKy, setMonHocDaDangKy] = useState([]);

  const handleChonMon = (ma_mh) => {
    if (monHocDaChon.includes(ma_mh)) {
      setMonHocDaChon(monHocDaChon.filter((m) => m !== ma_mh));
    } else {
      setMonHocDaChon([...monHocDaChon, ma_mh]);
    }
  };

  const handleDangKy = () => {
    const monDangKyMoi = danhSachMonHoc.filter((mh) =>
      monHocDaChon.includes(mh.ma_mh)
    );

    // Tránh thêm trùng môn học
    const monDangKyMoiKhongTrung = monDangKyMoi.filter(
      (mh) => !monHocDaDangKy.some((m) => m.ma_mh === mh.ma_mh)
    );

    setMonHocDaDangKy([...monHocDaDangKy, ...monDangKyMoiKhongTrung]);
    setMonHocDaChon([]);
  };

  const handleHuyDangKy = (ma_mh) => {
    const updatedList = monHocDaDangKy.filter((mh) => mh.ma_mh !== ma_mh);
    setMonHocDaDangKy(updatedList);
  };

  return (
    <div className="container">
      <h1>Đăng ký môn học</h1>
      <table>
        <thead>
          <tr>
            <th>Chọn</th>
            <th>Mã MH</th>
            <th>Tên môn</th>
            <th>Số tín chỉ</th>
            <th>Mã bộ môn</th>
          </tr>
        </thead>
        <tbody>
          {danhSachMonHoc.map((mh) => (
            <tr key={mh.ma_mh}>
              <td>
                <input
                  type="checkbox"
                  checked={monHocDaChon.includes(mh.ma_mh)}
                  onChange={() => handleChonMon(mh.ma_mh)}
                />
              </td>
              <td>{mh.ma_mh}</td>
              <td>{mh.ten_mon}</td>
              <td>{mh.so_tin_chi}</td>
              <td>{mh.ma_bo_mon}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleDangKy}>Đăng ký</button>

      {monHocDaDangKy.length > 0 && (
        <div className="registered-section">
        <h2>Môn học đã đăng ký:</h2>
        <table>
          <thead>
            <tr>
              <th>Mã MH</th>
              <th>Tên môn</th>
              <th>Số tín chỉ</th>
              <th>Mã bộ môn</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {monHocDaDangKy.map((mh) => (
              <tr key={mh.ma_mh}>
                <td>{mh.ma_mh}</td>
                <td>{mh.ten_mon}</td>
                <td>{mh.so_tin_chi}</td>
                <td>{mh.ma_bo_mon}</td>
                <td>
                  <button
                    onClick={() => handleHuyDangKy(mh.ma_mh)}
                    className="btn-huy"
                  >
                    Hủy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default DangKyMonHoc;
