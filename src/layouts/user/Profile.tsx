import React, { useState, useEffect, useRef } from 'react';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';
import { layThongTinCaNhan } from '../../api/ThongTinCaNhanApi';

interface ThongTinTaiKhoan {
  ten: string,
  hoDem: string,
  gioiTinh: string,
  anhDaiDien: string,
  email: string,
  tenDangNhap: string,
  soDienThoai: string
}

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [thongTinNguoiDung, setThongTinNguoiDung] = useState<ThongTinTaiKhoan | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  
  // toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  // click outside (FIX)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // load user info
  useEffect(() => {
    if (!accessToken) return;

    layThongTinCaNhan().then(data => {
      setThongTinNguoiDung(data);
    }).catch(() => {
      setThongTinNguoiDung(null);
    });
  }, [accessToken]);

  // Điều hướng và đóng dropdown
  const handleNavigation = (path: string) => {
    setIsOpen(false); // Đóng menu thả xuống
    navigate(path);   // Chuyển trang
  };

  // login
  const handleDangNhap = () => {
    setIsOpen(false);
    navigate("/account/loggin");
  };

  // logout
  const handleDangXuat = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    await fetch('http://localhost:8080/tai-khoan/logout', {
      method: 'POST',
      headers: {
        'content-type': "application/json"
      },
      body: JSON.stringify({ refreshToken })
    });

    localStorage.clear();
    setIsOpen(false);
    navigate("/account/username");
  };

  return (
    <div className="user-profile-container position-relative" ref={dropdownRef}>

      {/* ICON / AVATAR */}
      <span
        className="nav-link"
        onClick={toggleDropdown}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        {accessToken ? (
          thongTinNguoiDung ? (
            <img
              src={thongTinNguoiDung.anhDaiDien || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Avatar"
              className="rounded-circle shadow-sm"
              style={{ width: '30px', height: '30px', objectFit: 'cover' }}
            />
          ) : (
            <div className="avatar-loading">...</div> // loading
          )
        ) : (
          <i className="fas fa-user fs-5 text-primary"></i>
        )}
      </span>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="profile-dropdown">

          {accessToken ? (
            thongTinNguoiDung ? (
              <>
                <div className="dropdown-header">
                  <img
                    src={thongTinNguoiDung.anhDaiDien || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="Avatar"
                    className="rounded-circle shadow-sm"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  />
                  <p className="user-name mt-2">
                    {thongTinNguoiDung.hoDem + " " + thongTinNguoiDung.ten}
                  </p>
                  <p className="user-email">{thongTinNguoiDung.email}</p>
                </div>

                <button 
                  className="action-btn" 
                  onClick={() => handleNavigation("/user/profile")}
                >
                  👤 Hồ sơ của tôi
                </button>
                <button 
                  className="action-btn" 
                  onClick={() => handleNavigation("/user/settings")}
                >
                  ⚙️ Cài đặt hệ thống
                </button>

                <button
                  className="action-btn logout-btn"
                  onClick={handleDangXuat}
                >
                  ⇨ Đăng xuất
                </button>
              </>
            ) : (
              <div className="p-3 text-center text-muted">Đang tải...</div>
            )
          ) : (
            <>
              <div className="dropdown-header">
                <p className="user-name">Khách</p>
                <p className="user-email">Vui lòng đăng nhập</p>
              </div>

              <button className="action-btn primary-btn fw-bold rounded" onClick={handleDangNhap}>
                Đăng nhập
              </button>

              <button 
                className="action-btn secondary-btn fw-bold rounded" 
                onClick={() => handleNavigation("/dang-ky")}
              >
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