import React, { useState, useEffect, useRef } from 'react';
import './UserProfile.css';
import DangNhap from './DangNhap';
import { useNavigate } from 'react-router-dom';
import { layThongTinCaNhan } from '../../api/ThongTinCaNhanApi';
interface ThongTinTaiKhoan {
  ten: string,
  hoDem: string,
  gioiTinh: string,
  anhDaiDien: string , 
  email : string
}
const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const accessToken = localStorage.getItem("accessToken");
  const [trangThaiDangNhap, setTrangThaiDangNhap] = useState(false);

  const [thongTinNguoiDung, setThongTinNguoiDung] = useState<ThongTinTaiKhoan | null>(null);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    layThongTinCaNhan().then(
      data => {
        setThongTinNguoiDung(data);
      }
    )
  }, [])
  const navigate = useNavigate();
  const handleDangNhap = () => {
    navigate("/dang-nhap");

  }
  const handleDangXuat = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    await fetch('http://localhost:8080/tai-khoan/logout',
      {
        method: 'POST',
        headers: {
          'content-type': "application/json"
        },
        body: JSON.stringify(
          { refreshToken: refreshToken }
        )
      }
    )
    localStorage.clear();

    navigate("/dang-nhap");
  }
  return (
    // Thêm position-relative để dropdown bám theo icon này
   <div className="user-profile-container position-relative" ref={dropdownRef}>

      {/* SỬA CHỖ NÀY:
         Thay button bằng span có class "nav-link" để giống hệt menu của bạn.
         Thêm style cursor: pointer để có hình bàn tay khi di chuột vào.
      */}
      <span
        className="nav-link"
        onClick={toggleDropdown}
        style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' }}
      >
        {accessToken ? (
          // Nếu đã đăng nhập thì hiện Avatar nhỏ
          thongTinNguoiDung &&<img
            src={thongTinNguoiDung.anhDaiDien}
            alt="Avatar"
            className="rounded-circle"
            style={{ width: '25px', height: '25px', objectFit: 'cover' }}
          />
        ) : (
          // Nếu chưa đăng nhập thì hiện Icon người như cũ
          <i className="fas fa-user fs-5 text-primary"></i>
        )}
      </span>

      {/* Phần Dropdown (Cửa sổ popup) */}
      {isOpen && (
        <div className="profile-dropdown">
          {accessToken ? (
            thongTinNguoiDung &&<>
              <div className="dropdown-header">
                 <img
                  src={thongTinNguoiDung.anhDaiDien}
                  alt="Avatar"
                  className="rounded-circle"
                  style={{ width: '25px', height: '25px', objectFit: 'cover' }}
                />
                <p className="user-name">{thongTinNguoiDung.hoDem + thongTinNguoiDung.ten}</p>
                <p className="user-email">{thongTinNguoiDung.email}</p>
              </div>
              <button className="action-btn">👤 Hồ sơ</button>
              <button className="action-btn">⚙️ Cài đặt</button>
              <button className="action-btn logout-btn" onClick={handleDangXuat}>
                🚪 Đăng xuất
              </button>
            </>
          ) : (
            <>
              <div className="dropdown-header">
                <p className="user-name">Khách</p>
                <p className="user-email">Vui lòng đăng nhập</p>
              </div>
              <button className="action-btn primary-btn" onClick={handleDangNhap}>
                Đăng nhập
              </button>
              <button className="action-btn secondary-btn">
                Đăng ký
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;