import React from "react";
import "./Footer.css";

interface SocialLink {
  icon: string;
  link: string;
}

const Footer: React.FC = () => {
  const socialLinks: SocialLink[] = [
    { icon: "fab fa-facebook-f", link: "#" },
    { icon: "fab fa-twitter", link: "#" },
    { icon: "fab fa-instagram", link: "#" },
    { icon: "fab fa-linkedin-in", link: "#" },
  ];

  return (
    <footer className="footer-premium pt-5 pb-4">
      <div className="container">
        <div className="row">
          
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="col-lg-4 col-md-6 mb-4 pe-lg-5">
            <h5 className="brand-title mb-3 d-flex align-items-center">
              <span className="brand-icon me-2">
                <i className="fas fa-book"></i>
              </span>
              BOOKSTORE
            </h5>
            <p className="footer-text">
              Hành trình khám phá tri thức của bạn bắt đầu từ đây. Chúng tôi cung
              cấp những đầu sách chất lượng nhất với dịch vụ tận tâm.
            </p>
          </div>

          {/* Cột 2: Sản phẩm */}
          <div className="col-lg-2 col-md-3 mb-4">
            <h6 className="footer-heading mb-3">Sản phẩm</h6>
            <ul className="list-unstyled footer-list">
              <li className="mb-2"><a href="#" className="footer-link">Tiểu thuyết</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Kinh tế - Đầu tư</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Công nghệ IT</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Tâm lý - Kỹ năng</a></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="col-lg-2 col-md-3 mb-4">
            <h6 className="footer-heading mb-3">Hỗ trợ</h6>
            <ul className="list-unstyled footer-list">
              <li className="mb-2"><a href="#" className="footer-link">Tài khoản của bạn</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Tra cứu đơn hàng</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Chính sách bảo mật</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Cột 4: Đăng ký nhận tin */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h6 className="footer-heading mb-3">Nhận bản tin</h6>
            <p className="footer-text">
              Đăng ký để nhận mã giảm giá và tin tức sách mới nhất.
            </p>
            <form>
              <div className="input-group mb-3 newsletter-group">
                <input
                  type="email"
                  className="form-control newsletter-input shadow-none"
                  placeholder="Email của bạn..."
                  aria-label="Email của bạn"
                />
                <button className="btn btn-subscribe fw-bold border-0" type="button">
                  Gửi
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Phần Bottom Copyright & Social Icons */}
        <div className="footer-bottom d-flex flex-column flex-sm-row justify-content-between align-items-center py-3 mt-3">
          <p className="copyright-text mb-0">
            © 2026 Bản quyền thuộc về <span className="brand-highlight">BookStore Inc</span>. All rights reserved.
          </p>
          <ul className="list-unstyled d-flex mb-0 mt-3 mt-sm-0">
            {socialLinks.map((social, index) => (
              <li className="ms-2" key={index}>
                <a href={social.link} className="social-icon">
                  <i className={social.icon}></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;