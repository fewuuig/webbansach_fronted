import React from "react";
import "./Banner.css";

const Bannerr: React.FC = () => {
    return (
        <div className="hero-banner-container">
            {/* Lớp phủ mờ màu xanh cổ vịt tối */}
            <div className="hero-overlay"></div>
            
            {/* Nội dung Banner */}
            <div className="container position-relative z-1 text-center text-white banner-content">
                <h1 className="banner-title mb-3">
                    Đọc sách là hộ chiếu<br />cho vô số cuộc phiêu lưu
                </h1>
                <p className="banner-subtitle mb-4">
                    KHÁM PHÁ TRI THỨC - KHƠI NGUỒN SÁNG TẠO
                </p>
                <button className="btn banner-btn shadow-sm">
                    KHÁM PHÁ STORE NGAY
                </button>
            </div>
        </div>
    );
};

export default Bannerr;