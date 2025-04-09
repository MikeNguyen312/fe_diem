import React from 'react';
import '../styles/TrangChu.css';

function TrangChu() {
  const links = [
    { text: "QUY CHẾ, QUY ĐỊNH, VĂN BẢN HƯỚNG DẪN", url: "#" },
    { text: "KIỂM ĐỊNH CƠ SỞ GIÁO DỤC VÀ CHƯƠNG TRÌNH ĐÀO TẠO", url: "#" },
    { text: "HƯỚNG DẪN VÀ QUY TRÌNH", url: "#" },
    { text: "BIỂU MẪU", url: "#" },
    { text: "BIỂU ĐỒ GIẢNG DẠY HỌC TẬP", url: "#" },
    { text: "CHƯƠNG TRÌNH ĐÀO TẠO", url: "#" },
    { text: "DANH SÁCH CÁN BỘ THAM GIA CÔNG TÁC GIẢNG DẠY", url: "#" },
    { text: "NIÊN GIÁM", url: "#" },
    { text: "SỔ TAY ĐĂNG KÝ MÔN HỌC", url: "#" }
  ];

  return (
    <section className="container">
      <h3 className="info-title">THÔNG TIN QUẢN LÝ ĐÀO TẠO</h3>
      <ul className="info-list">
        {links.map((item, index) => (
          <li key={index} className="info-item">
            <a href={item.url} className="info-link">{item.text}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TrangChu;
