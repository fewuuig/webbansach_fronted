import React, { ChangeEvent, useEffect, useState } from "react";
import "./DangKyNguoiDung.css";

function DangKyNguoiDung() {
    const [tenDangNhap, setTenDangNhap] = useState("");
    const [email, setEmail] = useState("");
    const [hoDem, setHoDem] = useState("");
    const [ten, setTen] = useState("");
    const [soDienThoai, setSoDienThoai] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [gioiTinh, setGioiTinh] = useState("");
    const [matKhauLapLai, setMatKhauLapLai] = useState("");
    const [thongBao, setThongBao] = useState("");

    // error state
    const [errolTenDangNhap, setErrolTenDangNhap] = useState("");
    const [errolEmail, setErrolEmail] = useState("");
    const [errolMatKhau, setErrolmatKhau] = useState("");
    const [errolMatKhauLapLai, setErrolmatKhaulapLai] = useState("");
    const [errolHoDem, setErrolHoDem] = useState("");
    const [errolTen, setErrolTen] = useState("");
    const [errolSdt, setErrolSdt] = useState("");

    // ================= API CHECK =================
    const kiemTraTenDangNhap = async (value: string) => {
        try {
            const res = await fetch(`http://localhost:8080/tai-khoan/check-username?username=${value}`);
            const data = await res.text();

            if (data === "true") {
                setErrolTenDangNhap("Tên đăng nhập đã tồn tại!");
                return false;
            }
            setErrolTenDangNhap("");
            return true;
        } catch {
            return false;
        }
    };

    const kiemTraEmail = async (value: string) => {
        try {
            const res = await fetch(`http://localhost:8080/tai-khoan/check-email?email=${value}`);
            const data = await res.text();

            if (data === "true") {
                setErrolEmail("Email đã tồn tại!");
                return false;
            }
            setErrolEmail("");
            return true;
        } catch {
            return false;
        }
    };

    // ================= DEBOUNCE =================
    useEffect(() => {
        if (!tenDangNhap) return;

        const timeout = setTimeout(() => {
            kiemTraTenDangNhap(tenDangNhap);
        }, 300);

        return () => clearTimeout(timeout);
    }, [tenDangNhap]);

    useEffect(() => {
        if (!email) return;

        const timeout = setTimeout(() => {
            kiemTraEmail(email);
        }, 300);

        return () => clearTimeout(timeout);
    }, [email]);

    // ================= VALIDATE =================
    const kiemTraMatKhau = (value: string) => {
        const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

        if (!regex.test(value)) {
            setErrolmatKhau("Mật khẩu >=8 ký tự, có số & ký tự đặc biệt");
            return false;
        }
        setErrolmatKhau("");
        return true;
    };

    const kiemTraMatKhauLapLai = (value: string, pass: string) => {
        if (value !== pass) {
            setErrolmatKhaulapLai("Mật khẩu không khớp!");
            return false;
        }
        setErrolmatKhaulapLai("");
        return true;
    };

    const kiemTraHoDem = (value: string) => {
        const regex = /^[a-zA-ZÀ-ỹ\s]{1,20}$/;

        if (!regex.test(value)) {
            setErrolHoDem("Chỉ chứa chữ cái");
            return false;
        }
        setErrolHoDem("");
        return true;
    };

    const kiemTraTen = (value: string) => {
        const regex = /^[a-zA-ZÀ-ỹ\s]{1,20}$/;

        if (!regex.test(value)) {
            setErrolTen("Chỉ chứa chữ cái");
            return false;
        }
        setErrolTen("");
        return true;
    };

    const kiemTraSdt = (value: string) => {
        const regex = /^[0-9]{10}$/;

        if (!regex.test(value)) {
            setErrolSdt("SĐT không hợp lệ");
            return false;
        }
        setErrolSdt("");
        return true;
    };

    // ================= HANDLE CHANGE =================
    const handleTenDangNhapChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTenDangNhap(e.target.value);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleMatKhauChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMatKhau(value);
        kiemTraMatKhau(value);
        kiemTraMatKhauLapLai(matKhauLapLai, value);
    };

    const handleMatKhauLapLaiChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMatKhauLapLai(value);
        kiemTraMatKhauLapLai(value, matKhau);
    };

    const handleHoDemChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHoDem(value);
        kiemTraHoDem(value);
    };

    const handleTenChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTen(value);
        kiemTraTen(value);
    };

    const handleSdtChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSoDienThoai(value);
        kiemTraSdt(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const valid =
            await kiemTraTenDangNhap(tenDangNhap) &&
            await kiemTraEmail(email) &&
            kiemTraMatKhau(matKhau) &&
            kiemTraMatKhauLapLai(matKhauLapLai, matKhau) &&
            kiemTraHoDem(hoDem) &&
            kiemTraTen(ten) &&
            kiemTraSdt(soDienThoai);

        if (!valid) {
            setThongBao("Đăng ký thất bại!");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/tai-khoan/dang-ky", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tenDangNhap,
                    email,
                    matKhau,
                    hoDem,
                    ten,
                    soDienThoai,
                    gioiTinh
                })
            });

            if (res.ok) {
                setThongBao("Đăng ký thành công! Kiểm tra email để kích hoạt.");
            } else {
                setThongBao("Lỗi đăng ký!");
            }
        } catch {
            setThongBao("Server lỗi!");
        }
    };

    return (
        <div className="register-container">
            <div className="register-form-wrapper">
                <h1>Đăng ký</h1>

                <form onSubmit={handleSubmit}>
                    <input placeholder="Tên đăng nhập" value={tenDangNhap} onChange={handleTenDangNhapChange} />
                    <div className="error-message">{errolTenDangNhap}</div>

                    <input placeholder="Email" value={email} onChange={handleEmailChange} />
                    <div className="error-message">{errolEmail}</div>

                    <input type="password" placeholder="Mật khẩu" value={matKhau} onChange={handleMatKhauChange} />
                    <div className="error-message">{errolMatKhau}</div>

                    <input type="password" placeholder="Nhập lại mật khẩu" value={matKhauLapLai} onChange={handleMatKhauLapLaiChange} />
                    <div className="error-message">{errolMatKhauLapLai}</div>

                    <input placeholder="Họ đệm" value={hoDem} onChange={handleHoDemChange} />
                    <div className="error-message">{errolHoDem}</div>

                    <input placeholder="Tên" value={ten} onChange={handleTenChange} />
                    <div className="error-message">{errolTen}</div>

                    <input placeholder="SĐT" value={soDienThoai} onChange={handleSdtChange} />
                    <div className="error-message">{errolSdt}</div>

                    <input placeholder="Giới tính" value={gioiTinh} onChange={(e) => setGioiTinh(e.target.value)} />

                    <button type="submit">Đăng ký</button>

                    {thongBao && <div className="success-message">{thongBao}</div>}
                </form>
            </div>
        </div>
    );
}

export default DangKyNguoiDung;