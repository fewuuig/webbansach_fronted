import React from "react";
import { useAppSettings } from "../../context/AppSettingsContext";
import "./Footer.css";

interface SocialLink {
    icon: string;
    link: string;
}

const footerText = {
    vi: {
        description: "Hành trình khám phá tri thức của bạn bắt đầu từ đây. Chúng tôi cung cấp những đầu sách chất lượng với dịch vụ tận tâm.",
        products: "Sản phẩm",
        novel: "Tiểu thuyết",
        economy: "Kinh tế - Đầu tư",
        it: "Công nghệ IT",
        skills: "Tâm lý - Kỹ năng",
        support: "Hỗ trợ",
        account: "Tài khoản của bạn",
        orderLookup: "Tra cứu đơn hàng",
        privacy: "Chính sách bảo mật",
        faq: "Câu hỏi thường gặp",
        newsletter: "Nhận bản tin",
        newsletterDescription: "Đăng ký để nhận mã giảm giá và tin tức sách mới nhất.",
        emailPlaceholder: "Email của bạn...",
        subscribe: "Gửi",
        copyright: "Bản quyền thuộc về",
        rights: "Đã đăng ký bản quyền."
    },
    en: {
        description: "Your journey to explore knowledge starts here. We provide quality books with dedicated service.",
        products: "Products",
        novel: "Novel",
        economy: "Economy - Investment",
        it: "IT Technology",
        skills: "Psychology - Skills",
        support: "Support",
        account: "Your account",
        orderLookup: "Order tracking",
        privacy: "Privacy policy",
        faq: "Frequently asked questions",
        newsletter: "Newsletter",
        newsletterDescription: "Subscribe to get discount codes and the latest book updates.",
        emailPlaceholder: "Your email...",
        subscribe: "Send",
        copyright: "Copyright belongs to",
        rights: "All rights reserved."
    }
} as const;

const Footer: React.FC = () => {
    const { language } = useAppSettings();
    const text = footerText[language];
    const socialLinks: SocialLink[] = [
        { icon: "fab fa-facebook-f", link: "#" },
        { icon: "fab fa-twitter", link: "#" },
        { icon: "fab fa-instagram", link: "#" },
        { icon: "fab fa-linkedin-in", link: "#" }
    ];

    return (
        <footer className="footer-premium pt-5 pb-4">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-6 mb-4 pe-lg-5">
                        <h5 className="brand-title mb-3 d-flex align-items-center">
                            <span className="brand-icon me-2">
                                <i className="fas fa-book"></i>
                            </span>
                            BOOKSTORE
                        </h5>
                        <p className="footer-text">{text.description}</p>
                    </div>

                    <div className="col-lg-2 col-md-3 mb-4">
                        <h6 className="footer-heading mb-3">{text.products}</h6>
                        <ul className="list-unstyled footer-list">
                            <li className="mb-2"><a href="/" className="footer-link">{text.novel}</a></li>
                            <li className="mb-2"><a href="/" className="footer-link">{text.economy}</a></li>
                            <li className="mb-2"><a href="/" className="footer-link">{text.it}</a></li>
                            <li className="mb-2"><a href="/" className="footer-link">{text.skills}</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-3 mb-4">
                        <h6 className="footer-heading mb-3">{text.support}</h6>
                        <ul className="list-unstyled footer-list">
                            <li className="mb-2"><a href="/" className="footer-link">{text.account}</a></li>
                            <li className="mb-2"><a href="/" className="footer-link">{text.orderLookup}</a></li>
                            <li className="mb-2"><a href="/" className="footer-link">{text.privacy}</a></li>
                            <li className="mb-2"><a href="/" className="footer-link">{text.faq}</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">
                        <h6 className="footer-heading mb-3">{text.newsletter}</h6>
                        <p className="footer-text">{text.newsletterDescription}</p>
                        <form>
                            <div className="input-group mb-3 newsletter-group">
                                <input
                                    type="email"
                                    className="form-control newsletter-input shadow-none"
                                    placeholder={text.emailPlaceholder}
                                    aria-label={text.emailPlaceholder}
                                />
                                <button className="btn btn-subscribe fw-bold border-0" type="button">
                                    {text.subscribe}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom d-flex flex-column flex-sm-row justify-content-between align-items-center py-3 mt-3">
                    <p className="copyright-text mb-0">
                        © 2026 {text.copyright} <span className="brand-highlight">BookStore Inc</span>. {text.rights}
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
