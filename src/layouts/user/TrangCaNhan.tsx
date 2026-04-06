import React, { useEffect, useRef, useState } from "react";

import { useLocation } from "react-router-dom";

import { layThongTinCaNhan } from "../../api/ThongTinCaNhanApi";

import { authFetch } from "../../api/authFetch";

import { useAppSettings } from "../../context/AppSettingsContext";



const content = {

    vi: {

        notice: "Thông báo",

        accountManagement: "Quản lý tài khoản",

        settingsMenu: "Thiết lập",

        myProfile: "Hồ sơ của tôi",

        systemSettings: "Cài đặt & Hệ thống",

        profileTitle: "Hồ Sơ Của Tôi",

        username: "Tên đăng nhập",

        email: "Email",

        fullName: "Họ & Tên",

        middleName: "Tên đệm",

        firstName: "Tên",

        phone: "Số điện thoại",

        birthday: "Ngày sinh",

        gender: "Giới tính",

        male: "Nam",

        female: "Nữ",

        saveProfile: "LƯU HỒ SƠ",

        settingsTitle: "Cài Đặt Hệ Thống",

        security: "Bảo Mật",

        changePassword: "Đổi Mật Khẩu",

        currentPassword: "Mật Khẩu Hiện Tại",

        newPassword: "Mật Khẩu Mới",

        confirmPassword: "Xác nhận mật khẩu mới",

        update: "Cập nhật",

        enable2FA: "Bật xác thực 2 lớp (2FA)",

        logoutDevices: "Đang xuất khỏi tất cả thiết bị",

        notifications: "Thông Báo",

        orderEmail: "Email thông báo đơn hàng",

        smsPush: "SMS / Push Notification",

        ads: "Bật/Tắt quảng cáo",

        customize: "Tùy Chỉnh",

        language: "Ngôn ngữ",

        vietnamese: "Tiếng Việt",

        english: "English",

        appearance: "Giao diện (Dark Mode)",

        other: "Khác",

        link: "Liên kết",

        deleteAccount: "Xóa Tài Khoản",

        deleteWarning: "Dữ liệu sẽ bị xóa vĩnh viễn.",

        requestDelete: "Yêu Cầu Xóa",

        loading: "Đang tải...",

        loginRequired: "Vui lòng đăng nhập!",

        imageLimit: "Ảnh tối đa 1MB",

        profileUpdated: "Cập nhật thành công!",

        serverError: "Lỗi kết nối máy chủ!",

        passwordMismatch: "Mật khẩu không khớp!",

        networkError: "Lỗi mạng!"

    },

    en: {

        notice: "Notice",

        accountManagement: "Account Management",

        settingsMenu: "Settings",

        myProfile: "My Profile",

        systemSettings: "Settings & System",

        profileTitle: "My Profile",

        username: "Username",

        email: "Email",

        fullName: "Full Name",

        middleName: "Middle name",

        firstName: "First name",

        phone: "Phone number",

        birthday: "Date of birth",

        gender: "Gender",

        male: "Male",

        female: "Female",

        saveProfile: "SAVE PROFILE",

        settingsTitle: "System Settings",

        security: "Security",

        changePassword: "Change password",

        currentPassword: "Current password",

        newPassword: "New password",

        confirmPassword: "Confirm new password",

        update: "Update",

        enable2FA: "Enable two-factor authentication (2FA)",

        logoutDevices: "Log out from all devices",

        notifications: "Notifications",

        orderEmail: "Order email notifications",

        smsPush: "SMS / Push Notification",

        ads: "Enable/Disable ads",

        customize: "Customization",

        language: "Language",

        vietnamese: "Vietnamese",

        english: "English",

        appearance: "Appearance (Dark Mode)",

        other: "Other",

        link: "Link",

        deleteAccount: "Delete Account",

        deleteWarning: "Your data will be deleted permanently.",

        requestDelete: "Request Deletion",

        loading: "Loading...",

        loginRequired: "Please sign in!",

        imageLimit: "Maximum image size is 1MB",

        profileUpdated: "Profile updated successfully!",

        serverError: "Server connection error!",

        passwordMismatch: "Passwords do not match!",

        networkError: "Network error!"

    }

} as const;



const TrangCaNhan: React.FC = () => {

    const location = useLocation();

    const { theme, setTheme, language, setLanguage } = useAppSettings();

    const [activeTab, setActiveTab] = useState<"profile" | "address" | "orders" | "wishlist" | "settings">("profile");

    const [user, setUser] = useState<any>(null);

    const [loading, setLoading] = useState(true);



    const [hoDem, setHoDem] = useState("");

    const [ten, setTen] = useState("");

    const [soDienThoai, setSoDienThoai] = useState("");

    const [gioiTinh, setGioiTinh] = useState("M");

    const [ngaySinh, setNgaySinh] = useState("");

    const [anhDaiDien, setAnhDaiDien] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);



    const [oldPassword, setOldPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [twoFA, setTwoFA] = useState(false);

    const [emailNoti, setEmailNoti] = useState(true);

    const [smsNoti, setSmsNoti] = useState(false);

    const [adsNoti, setAdsNoti] = useState(true);



    const [noti, setNoti] = useState({ message: "", type: "" });

    const text = content[language];



    useEffect(() => {

        if (location.pathname.includes("settings")) setActiveTab("settings");

        else if (location.pathname.includes("address")) setActiveTab("address");

        else if (location.pathname.includes("orders")) setActiveTab("orders");

        else setActiveTab("profile");

    }, [location]);



    useEffect(() => {

        layThongTinCaNhan().then(data => {

            if (data) {

                setUser(data);

                setHoDem(data.hoDem || "");

                setTen(data.ten || "");

                setSoDienThoai(data.soDienThoai || "");

                setGioiTinh(data.gioiTinh || "M");

                setAnhDaiDien(data.anhDaiDien || "");

            }

            setLoading(false);

        });

    }, []);



    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0];

        if (file) {

            if (file.size > 1024 * 1024) {

                setNoti({ message: text.imageLimit, type: "warning" });

                return;

            }

            const reader = new FileReader();

            reader.onloadend = () => setAnhDaiDien(reader.result as string);

            reader.readAsDataURL(file);

        }

    };



    const handleUpdateProfile = async () => {

        try {

            const res = await authFetch("http://localhost:8080/profile/update", {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,

                },

                body: JSON.stringify({ hoDem, ten, soDienThoai, anhDaiDien, gioiTinh, ngaySinh })

            });

            const message = await res.text();

            if (res.ok) {

                alert(text.profileUpdated);

                setNoti({ message, type: "success" });

                setUser({ ...user, hoDem, ten, soDienThoai, anhDaiDien, gioiTinh, ngaySinh });

                setTimeout(() => setNoti({ message: "", type: "" }), 3000);

            } else {

                setNoti({ message, type: "danger" });

            }

        } catch {

            setNoti({ message: text.serverError, type: "danger" });

        }

        window.scrollTo(0, 0);

    };



    const handleChangePassword = async () => {

        if (newPassword !== confirmPassword) {

            setNoti({ message: text.passwordMismatch, type: "warning" });

            return;

        }

        try {

            const res = await authFetch("http://localhost:8080/tai-khoan/change-password", {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,

                },

                body: JSON.stringify({ oldPassword, newPassword })

            });

            const message = await res.text();

            if (res.ok) {

                setNoti({ message, type: "success" });

                setOldPassword("");

                setNewPassword("");

                setConfirmPassword("");

            } else {

                setNoti({ message, type: "danger" });

            }

        } catch {

            setNoti({ message: text.networkError, type: "danger" });

        }

    };



    if (loading) {

        return (

            <div className="text-center mt-5">

                <div className="spinner-border text-primary"></div>

                <div className="mt-2">{text.loading}</div>

            </div>

        );

    }



    if (!user) {

        return <div className="text-center mt-5 text-danger"><h4>{text.loginRequired}</h4></div>;

    }



    return (

        <div className="container mt-4 mb-5" style={{ maxWidth: "1200px" }}>

            {noti.message && (

                <div className={`alert alert-${noti.type} alert-dismissible fade show shadow-sm`} role="alert">

                    <strong>{text.notice}: </strong> {noti.message}

                    <button type="button" className="btn-close" onClick={() => setNoti({ message: "", type: "" })}></button>

                </div>

            )}



            <div className="rounded-4 shadow-sm mb-4 position-relative" style={{ height: "220px", background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" }}>

                <div className="position-absolute d-flex align-items-end" style={{ bottom: "40px", left: "40px" }}>

                    <div className="position-relative">

                        <img src={anhDaiDien || user.anhDaiDien || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="rounded-circle border border-4 border-white shadow bg-white" style={{ width: "140px", height: "140px", objectFit: "cover" }} alt="Avatar" />

                        <button className="btn btn-light btn-sm position-absolute rounded-circle shadow border" style={{ bottom: "5px", right: "5px", width: "35px", height: "35px" }} onClick={() => fileInputRef.current?.click()}>📷</button>

                    </div>

                    <div className="ms-4 mb-4 text-white d-none d-md-block">

                        <h3 className="fw-bold mb-0 text-shadow">{hoDem} {ten}</h3>

                    </div>

                </div>

                <input type="file" hidden ref={fileInputRef} accept="image/jpeg, image/png" onChange={handleImageChange} />

            </div>



            <div className="row mt-5 pt-3">

                <div className="col-md-3 mb-4">

                    <div className="card shadow-sm border-0 rounded-4 sticky-top" style={{ top: "20px" }}>

                        <div className="card-body p-3">

                            <h6 className="text-muted fw-bold mb-3 ms-2 text-uppercase" style={{ fontSize: "12px" }}>{text.accountManagement}</h6>

                            <div className="list-group list-group-flush gap-1 mb-4">

                                <button className={`list-group-item list-group-item-action border-0 rounded-3 fw-semibold py-2 ${activeTab === "profile" ? "bg-primary text-white shadow-sm" : "bg-light text-secondary"}`} onClick={() => setActiveTab("profile")}>👤  {text.myProfile}</button>

                            </div>

                            <h6 className="text-muted fw-bold mb-3 ms-2 text-uppercase" style={{ fontSize: "12px" }}>{text.settingsMenu}</h6>

                            <div className="list-group list-group-flush gap-1">

                                <button className={`list-group-item list-group-item-action border-0 rounded-3 fw-semibold py-2 ${activeTab === "settings" ? "bg-primary text-white shadow-sm" : "bg-light text-secondary"}`} onClick={() => setActiveTab("settings")}>⚙️  {text.systemSettings}</button>

                            </div>

                        </div>

                    </div>

                </div>



                <div className="col-md-9">

                    <div className="card shadow-sm border-0 rounded-4" style={{ minHeight: "600px" }}>

                        <div className="card-body p-4 p-md-5">

                            {activeTab === "profile" && (

                                <div className="fade-in">

                                    <h4 className="fw-bold text-dark mb-4 pb-3 border-bottom">{text.profileTitle}</h4>

                                    <div className="row">

                                        <div className="col-lg-8">

                                            <div className="mb-3 row align-items-center"><label className="col-sm-3 col-form-label text-muted small">{text.username}</label><div className="col-sm-9"><input type="text" className="form-control bg-light border-0" value={user.tenDangNhap} disabled /></div></div>

                                            <div className="mb-3 row align-items-center"><label className="col-sm-3 col-form-label text-muted small">{text.email}</label><div className="col-sm-9"><input type="email" className="form-control bg-light border-0" value={user.email} disabled /></div></div>

                                            <div className="mb-3 row align-items-center">

                                                <label className="col-sm-3 col-form-label text-muted small">{text.fullName}</label>

                                                <div className="col-sm-4 mb-2 mb-sm-0"><input type="text" className="form-control" placeholder={text.middleName} value={hoDem} onChange={(e) => setHoDem(e.target.value)} /></div>

                                                <div className="col-sm-5"><input type="text" className="form-control" placeholder={text.firstName} value={ten} onChange={(e) => setTen(e.target.value)} /></div>

                                            </div>

                                            <div className="mb-3 row align-items-center"><label className="col-sm-3 col-form-label text-muted small">{text.phone}</label><div className="col-sm-9"><input type="text" className="form-control" value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)} /></div></div>

                                            <div className="mb-3 row align-items-center">

                                                <label className="col-sm-3 col-form-label text-muted small">{text.birthday}</label>

                                                <div className="col-sm-9">

                                                    <input type="datetime-local" className="form-control" value={ngaySinh} onChange={(e) => setNgaySinh(e.target.value)} />

                                                </div>

                                            </div>

                                            <div className="mb-4 row align-items-center">

                                                <label className="col-sm-3 col-form-label text-muted small">{text.gender}</label>

                                                <div className="col-sm-9 d-flex gap-4 mt-2">

                                                    <div className="form-check custom-radio"><input className="form-check-input" type="radio" id="male" checked={gioiTinh === "M"} onChange={() => setGioiTinh("M")} /><label htmlFor="male">{text.male}</label></div>

                                                    <div className="form-check custom-radio"><input className="form-check-input" type="radio" id="female" checked={gioiTinh === "F"} onChange={() => setGioiTinh("F")} /><label htmlFor="female">{text.female}</label></div>

                                                </div>

                                            </div>

                                            <div className="row"><div className="col-sm-3"></div><div className="col-sm-9"><button type="button" className="btn btn-primary px-5 shadow-sm rounded-3 fw-bold" onClick={handleUpdateProfile}>{text.saveProfile}</button></div></div>

                                        </div>

                                    </div>

                                </div>

                            )}



                            {activeTab === "settings" && (

                                <div className="fade-in">

                                    <h4 className="fw-bold text-dark mb-4 pb-3 border-bottom">{text.settingsTitle}</h4>



                                    <div className="row">

                                        <div className="col-lg-6 pe-lg-4 border-end">

                                            <h6 className="fw-bold mb-3 text-dark"><span className="text-warning"></span>🔒 {text.security}</h6>

                                            <div className="accordion mb-4" id="securityAccordion">

                                                <div className="accordion-item border rounded-3 mb-2 overflow-hidden shadow-sm">

                                                    <h2 className="accordion-header"><button className="accordion-button collapsed fw-semibold bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePwd">{text.changePassword}</button></h2>

                                                    <div id="collapsePwd" className="accordion-collapse collapse" data-bs-parent="#securityAccordion">

                                                        <div className="accordion-body bg-white">

                                                            <input type="password" className="form-control mb-2" placeholder={text.currentPassword} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />

                                                            <input type="password" className="form-control mb-2" placeholder={text.newPassword} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                                                            <input type="password" className="form-control mb-3" placeholder={text.confirmPassword} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                                                            <button className="btn btn-dark btn-sm w-100" onClick={handleChangePassword}>{text.update}</button>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>



                                            <div className="d-flex justify-content-between align-items-center mb-3">

                                                <div><h6 className="mb-0 fw-semibold text-dark small">{text.enable2FA}</h6></div>

                                                <div className="form-check form-switch fs-5 m-0"><input className="form-check-input" type="checkbox" checked={twoFA} onChange={() => setTwoFA(!twoFA)} /></div>

                                            </div>

                                            <div className="mb-5">

                                                <button className="btn btn-outline-danger btn-sm w-100 fw-bold">{text.logoutDevices}</button>

                                            </div>



                                            <h6 className="fw-bold mb-3 text-dark"><span className="text-info">🔔</span> {text.notifications}</h6>

                                            <div className="d-flex justify-content-between align-items-center mb-3">

                                                <div><h6 className="mb-0 fw-semibold text-dark small">{text.orderEmail}</h6></div>

                                                <div className="form-check form-switch fs-5 m-0"><input className="form-check-input" type="checkbox" checked={emailNoti} onChange={() => setEmailNoti(!emailNoti)} /></div>

                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mb-3">

                                                <div><h6 className="mb-0 fw-semibold text-dark small">{text.smsPush}</h6></div>

                                                <div className="form-check form-switch fs-5 m-0"><input className="form-check-input" type="checkbox" checked={smsNoti} onChange={() => setSmsNoti(!smsNoti)} /></div>

                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mb-4">

                                                <div><h6 className="mb-0 fw-semibold text-dark small">{text.ads}</h6></div>

                                                <div className="form-check form-switch fs-5 m-0"><input className="form-check-input" type="checkbox" checked={adsNoti} onChange={() => setAdsNoti(!adsNoti)} /></div>

                                            </div>

                                        </div>



                                        <div className="col-lg-6 ps-lg-4 mt-4 mt-lg-0">

                                            <h6 className="fw-bold mb-3 text-dark"><span className="text-primary"></span> {text.customize}</h6>

                                            <div className="mb-3">

                                                <label className="form-label small fw-semibold text-muted mb-1">🌐 {text.language}</label>

                                                <select className="form-select bg-light border-0 shadow-sm" value={language} onChange={(e) => setLanguage(e.target.value as "vi" | "en") }>

                                                    <option value="vi">{text.vietnamese}</option>

                                                    <option value="en">{text.english}</option>

                                                </select>

                                            </div>



                                            <div className="d-flex justify-content-between align-items-center mb-5 px-3 py-3 rounded bg-light border">

                                                <div><h6 className="mb-0 fw-semibold text-dark small">{text.appearance}</h6></div>

                                                <div className="form-check form-switch fs-5 m-0 d-flex align-items-center">

                                                    <input

                                                        className="form-check-input"

                                                        style={{ marginTop: 0 }}

                                                        type="checkbox"

                                                        checked={theme === "dark"}

                                                        onChange={() => setTheme(theme === "dark" ? "light" : "dark")}

                                                    />

                                                </div>

                                            </div>



                                            <h6 className="fw-bold mb-3 text-dark"><span className="text-secondary"></span> {text.other}</h6>

                                            <div className="d-flex gap-2 mb-4">

                                                <button className="btn btn-outline-primary btn-sm flex-fill d-flex align-items-center justify-content-center"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="16" className="me-2" /> {text.link}</button>

                                                <button className="btn btn-outline-primary btn-sm flex-fill d-flex align-items-center justify-content-center"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" width="16" className="me-2" /> {text.link}</button>

                                            </div>

                                            <div className="border border-danger rounded-3 p-3 bg-danger-subtle">

                                                <h6 className="fw-bold text-danger mb-1">{text.deleteAccount}</h6>

                                                <p className="text-danger small mb-2 opacity-75">{text.deleteWarning}</p>

                                                <button className="btn btn-danger btn-sm w-100 fw-bold shadow-sm">{text.requestDelete}</button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>



            <style>{`

                .fade-in { animation: fadeIn 0.3s ease-in-out; }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .hover-shadow:hover { box-shadow: 0 .5rem 1rem rgba(0,0,0,.08)!important; border-color: #0d6efd!important; transform: translateY(-3px); }

                .text-shadow { text-shadow: 1px 1px 3px rgba(0,0,0,0.5); }

                .custom-radio .form-check-input:checked { background-color: #0d6efd; border-color: #0d6efd; }

                .transition-all { transition: all 0.2s ease-in-out; }

            `}</style>

        </div>

    );

};



export default TrangCaNhan;
