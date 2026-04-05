import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { layThongTinCaNhan } from "../../api/ThongTinCaNhanApi";
import { authFetch } from "../../api/authFetch";

const TrangCaNhan: React.FC = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<"profile" | "address" | "orders" | "wishlist" | "settings">("profile");
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Profile States
    const [hoDem, setHoDem] = useState("");
    const [ten, setTen] = useState("");
    const [soDienThoai, setSoDienThoai] = useState("");
    const [gioiTinh, setGioiTinh] = useState("M"); 
    const [ngaySinh, setNgaySinh] = useState("");
    const [anhDaiDien, setAnhDaiDien] = useState(""); 
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Settings States
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [twoFA, setTwoFA] = useState(false);
    const [emailNoti, setEmailNoti] = useState(true);
    const [smsNoti, setSmsNoti] = useState(false);
    const [adsNoti, setAdsNoti] = useState(true);
    const [theme, setTheme] = useState("light");
    const [language, setLanguage] = useState("vi");
    
    const [noti, setNoti] = useState({ message: "", type: "" }); 

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

                // Có thể thêm xử lý ngày sinh nếu API trả về, ví dụ: setNgaySinh(data.ngaySinh || ""); --- IGNORE ---
                // setNgaySinh(data.ngaySinh || ""); 

                setAnhDaiDien(data.anhDaiDien || "");
            }
            setLoading(false);
        });
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) return setNoti({ message: "Ảnh tối đa 1MB", type: "warning" });
            const reader = new FileReader();
            reader.onloadend = () => setAnhDaiDien(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const res = await authFetch("http://localhost:8080/profile/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" ,
                    'Authorization' : `Bearer ${localStorage.getItem("accessToken")}` ,
                },
                body: JSON.stringify({ hoDem, ten, soDienThoai, anhDaiDien, gioiTinh, ngaySinh }) 
            });
            const text = await res.text();
            if (res.ok) {
                alert("Cập nhật thành công!") ;
                setNoti({ message: text, type: "success" });
                setUser({ ...user, hoDem, ten, soDienThoai, anhDaiDien, gioiTinh, ngaySinh });
                setTimeout(() => setNoti({ message: "", type: "" }), 3000);
            } else setNoti({ message: text, type: "danger" });
        } catch (error) { setNoti({ message: "Lỗi kết nối máy chủ!", type: "danger" }); }
        window.scrollTo(0, 0); 
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) return setNoti({ message: "Mật khẩu không khớp!", type: "warning" });
        try {
            const res = await authFetch("http://localhost:8080/tai-khoan/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" ,
                    'Authorization' : `Bearer ${localStorage.getItem("accessToken")}` ,
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });
            const text = await res.text();
            if (res.ok) {
                setNoti({ message: text, type: "success" });
                setOldPassword(""); setNewPassword(""); setConfirmPassword("");
            } else setNoti({ message: text, type: "danger" });
        } catch (error) { setNoti({ message: "Lỗi mạng!", type: "danger" }); }
    };

    if (loading) return <div className="text-center mt-5 spinner-border text-primary"></div>;
    if (!user) return <div className="text-center mt-5 text-danger"><h4>Vui lòng đăng nhập!</h4></div>;

    return (
        <div className="container mt-4 mb-5" style={{ maxWidth: "1200px" }}>
            {noti.message && (
                <div className={`alert alert-${noti.type} alert-dismissible fade show shadow-sm`} role="alert">
                    <strong>Thông báo: </strong> {noti.message}
                    <button type="button" className="btn-close" onClick={() => setNoti({message:"", type:""})}></button>
                </div>
            )}

            {/* BÌA PROFILE */}
            <div className="rounded-4 shadow-sm mb-4 position-relative" style={{ height: "220px", background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" }}>
                <div className="position-absolute d-flex align-items-end" style={{ bottom: "40px", left: "40px" }}>
                    <div className="position-relative">
                        <img src={anhDaiDien || user.anhDaiDien || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="rounded-circle border border-4 border-white shadow bg-white" style={{ width: "140px", height: "140px", objectFit: "cover" }} alt="Avatar"/>
                        <button className="btn btn-light btn-sm position-absolute rounded-circle shadow border" style={{ bottom: "5px", right: "5px", width:"35px", height:"35px" }} onClick={() => fileInputRef.current?.click()}>📷</button>
                    </div>
                    <div className="ms-4 mb-4 text-white d-none d-md-block">
                        <h3 className="fw-bold mb-0 text-shadow">{hoDem} {ten}</h3>
                    </div>
                </div>
                <input type="file" hidden ref={fileInputRef} accept="image/jpeg, image/png" onChange={handleImageChange} />
            </div>

            <div className="row mt-5 pt-3">
                {/* ================= MENU BÊN TRÁI ================= */}
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 rounded-4 sticky-top" style={{ top: "20px" }}>
                        <div className="card-body p-3">
                            <h6 className="text-muted fw-bold mb-3 ms-2 text-uppercase" style={{fontSize: '12px'}}>Quản lý tài khoản</h6>
                            <div className="list-group list-group-flush gap-1 mb-4">
                                <button className={`list-group-item list-group-item-action border-0 rounded-3 fw-semibold py-2 ${activeTab === "profile" ? "bg-primary text-white shadow-sm" : "bg-light text-secondary"}`} onClick={() => setActiveTab("profile")}> 👤 Hồ sơ của tôi </button>
                            </div>
                            <h6 className="text-muted fw-bold mb-3 ms-2 text-uppercase" style={{fontSize: '12px'}}>Thiết lập</h6>
                            <div className="list-group list-group-flush gap-1">
                                <button className={`list-group-item list-group-item-action border-0 rounded-3 fw-semibold py-2 ${activeTab === "settings" ? "bg-primary text-white shadow-sm" : "bg-light text-secondary"}`} onClick={() => setActiveTab("settings")}> ⚙️ Cài đặt & Hệ thống </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= NỘI DUNG BÊN PHẢI ================= */}
                <div className="col-md-9">
                    <div className="card shadow-sm border-0 rounded-4" style={{ minHeight: "600px" }}>
                        <div className="card-body p-4 p-md-5">
                            
                            {/* TAB 1: THÔNG TIN TÀI KHOẢN */}
                            {activeTab === "profile" && (
                                <div className="fade-in">
                                    <h4 className="fw-bold text-dark mb-4 pb-3 border-bottom">Hồ Sơ Của Tôi</h4>
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <div className="mb-3 row align-items-center"><label className="col-sm-3 col-form-label text-muted small">Tên đăng nhập</label><div className="col-sm-9"><input type="text" className="form-control bg-light border-0" value={user.tenDangNhap} disabled /></div></div>
                                            <div className="mb-3 row align-items-center"><label className="col-sm-3 col-form-label text-muted small">Email</label><div className="col-sm-9"><input type="email" className="form-control bg-light border-0" value={user.email} disabled /></div></div>
                                            <div className="mb-3 row align-items-center">
                                                <label className="col-sm-3 col-form-label text-muted small">Họ & Tên</label>
                                                <div className="col-sm-4 mb-2 mb-sm-0"><input type="text" className="form-control" placeholder="Họ đệm" value={hoDem} onChange={(e) => setHoDem(e.target.value)} /></div>
                                                <div className="col-sm-5"><input type="text" className="form-control" placeholder="Tên" value={ten} onChange={(e) => setTen(e.target.value)} /></div>
                                            </div>
                                            <div className="mb-3 row align-items-center"><label className="col-sm-3 col-form-label text-muted small">Số điện thoại</label><div className="col-sm-9"><input type="text" className="form-control" value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)} /></div></div>
                                            
                                            {/* Thêm Ngày Sinh */}
                                            <div className="mb-3 row align-items-center">
                                                <label className="col-sm-3 col-form-label text-muted small">Ngày sinh</label>
                                                <div className="col-sm-9">
                                                    <input type="datetime-local" className="form-control" value={ngaySinh} onChange={(e) => setNgaySinh(e.target.value)} />
                                                </div>
                                            </div>

                                            {/* Thêm Giới Tính */}
                                            <div className="mb-4 row align-items-center">
                                                <label className="col-sm-3 col-form-label text-muted small">Giới tính</label>
                                                <div className="col-sm-9 d-flex gap-4 mt-2">
                                                    <div className="form-check custom-radio"><input className="form-check-input" type="radio" id="male" checked={gioiTinh === "M"} onChange={() => setGioiTinh("M")} /><label htmlFor="male">Nam</label></div>
                                                    <div className="form-check custom-radio"><input className="form-check-input" type="radio" id="female" checked={gioiTinh === "F"} onChange={() => setGioiTinh("F")} /><label htmlFor="female">Nữ</label></div>
                                                </div>
                                            </div>

                                            <div className="row"><div className="col-sm-3"></div><div className="col-sm-9"><button type="button" className="btn btn-primary px-5 shadow-sm rounded-3 fw-bold" onClick={handleUpdateProfile}>LƯU HỒ SƠ</button></div></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: CÀI ĐẶT HỆ THỐNG */}
                            {activeTab === "settings" && (
                                <div className="fade-in">
                                    <h4 className="fw-bold text-dark mb-4 pb-3 border-bottom">Cài Đặt Hệ Thống</h4>

                                    <div className="row">
                                        {/* CỘT TRÁI: BẢO MẬT & THÔNG BÁO */}
                                        <div className="col-lg-6 pe-lg-4 border-end">
                                            {/* PHẦN 1: BẢO MẬT */}
                                            <h6 className="fw-bold mb-3 text-dark"><span className="text-warning">🔒</span> Bảo Mật</h6>
                                            <div className="accordion mb-4" id="securityAccordion">
                                                <div className="accordion-item border rounded-3 mb-2 overflow-hidden shadow-sm">
                                                    <h2 className="accordion-header"><button className="accordion-button collapsed fw-semibold bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePwd">Đổi mật khẩu</button></h2>
                                                    <div id="collapsePwd" className="accordion-collapse collapse" data-bs-parent="#securityAccordion">
                                                        <div className="accordion-body bg-white">
                                                            <input type="password" className="form-control mb-2" placeholder="MK hiện tại" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} />
                                                            <input type="password" className="form-control mb-2" placeholder="MK mới" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
                                                            <input type="password" className="form-control mb-3" placeholder="Xác nhận MK mới" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
                                                            <button className="btn btn-dark btn-sm w-100" onClick={handleChangePassword}>Cập nhật</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div><h6 className="mb-0 fw-semibold text-dark small">Bật xác thực 2 lớp (2FA)</h6></div>
                                                <div className="form-check form-switch fs-5 m-0"><input className="form-check-input" type="checkbox" checked={twoFA} onChange={()=>setTwoFA(!twoFA)} /></div>
                                            </div>
                                            <div className="mb-5">
                                                <button className="btn btn-outline-danger btn-sm w-100 fw-bold">Đăng xuất khỏi tất cả thiết bị</button>
                                            </div>

                                            {/* PHẦN 2: THÔNG BÁO */}
                                            <h6 className="fw-bold mb-3 text-dark"><span className="text-info">🔔</span> Thông Báo</h6>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div><h6 className="mb-0 fw-semibold text-dark small">Email thông báo đơn hàng</h6></div>
                                                <div className="form-check form-switch fs-5 m-0"><input className="form-check-input" type="checkbox" checked={emailNoti} onChange={()=>setEmailNoti(!emailNoti)} /></div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div><h6 className="mb-0 fw-semibold text-dark small">SMS / Push Notification</h6></div>
                                                <div className="form-check form-switch fs-5 m-0"><input className="form-check-input" type="checkbox" checked={smsNoti} onChange={()=>setSmsNoti(!smsNoti)} /></div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <div><h6 className="mb-0 fw-semibold text-dark small">Bật/Tắt quảng cáo</h6></div>
                                                <div className="form-check form-switch fs-5 m-0"><input className="form-check-input" type="checkbox" checked={adsNoti} onChange={()=>setAdsNoti(!adsNoti)} /></div>
                                            </div>
                                        </div>

                                        {/* CỘT PHẢI: TÙY CHỈNH & KHÁC */}
                                        <div className="col-lg-6 ps-lg-4 mt-4 mt-lg-0">
                                            {/* PHẦN 3: TÙY CHỈNH */}
                                            <h6 className="fw-bold mb-3 text-dark"><span className="text-primary">🌐</span> Tùy Chỉnh</h6>
                                            <div className="mb-3">
                                                <label className="form-label small fw-semibold text-muted mb-1">Ngôn ngữ</label>
                                                <select className="form-select bg-light border-0 shadow-sm" value={language} onChange={(e)=>setLanguage(e.target.value)}>
                                                    <option value="vi">Tiếng Việt</option>
                                                    <option value="en">English</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label small fw-semibold text-muted mb-1">Đơn vị tiền tệ</label>
                                                <select className="form-select bg-light border-0 shadow-sm" disabled>
                                                    <option value="vnd">VND (đ)</option>
                                                </select>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-5 p-2 rounded bg-light border">
                                                <div><h6 className="mb-0 fw-semibold text-dark small">Giao diện (Dark Mode)</h6></div>
                                                <div className="form-check form-switch fs-5 m-0"><input className="form-check-input" type="checkbox" checked={theme==='dark'} onChange={()=>setTheme(theme==='dark'?'light':'dark')} /></div>
                                            </div>

                                            {/* PHẦN 4: KHÁC */}
                                            <h6 className="fw-bold mb-3 text-dark"><span className="text-secondary">⚙️</span> Khác</h6>
                                            <div className="d-flex gap-2 mb-4">
                                                <button className="btn btn-outline-primary btn-sm flex-fill d-flex align-items-center justify-content-center"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="16" className="me-2"/> Liên kết</button>
                                                <button className="btn btn-outline-primary btn-sm flex-fill d-flex align-items-center justify-content-center"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" width="16" className="me-2"/> Liên kết</button>
                                            </div>
                                            <div className="border border-danger rounded-3 p-3 bg-danger-subtle">
                                                <h6 className="fw-bold text-danger mb-1">Xóa Tài Khoản</h6>
                                                <p className="text-danger small mb-2 opacity-75">Dữ liệu sẽ bị xóa vĩnh viễn.</p>
                                                <button className="btn btn-danger btn-sm w-100 fw-bold shadow-sm">Yêu Cầu Xóa</button>
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