import { stringify } from "querystring";
import React, { ChangeEvent, useState } from "react";

function DangKyNguoiDung() {
    const [tenDangNhap, setTenDangNhap] = useState("");
    const [email, setEmail] = useState("");
    const [hoDem, setHoDem] = useState("");
    const [ten, setTen] = useState("");
    const [soDienThoai, setSoDienThoai] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [gioiTinh, setGioiTinh] = useState("");
    const [matKhaulapLai, setMatKhauLapLai] = useState("");
    const [thongBao, setThongBao] = useState("");
    // các bién luuw cảnh báo lỗi 
    const [errolTenDangNhap, setErrolTenDangNhap] = useState("");
    const [errolEmail, setErrolEmail] = useState("");
    const [errolMatKhau, setErrolmatKhau] = useState("");
    const [errolMatKhauLapLai, setErrolmatKhaulapLai] = useState("");
    const [errolHoDem, setErrolHoDem] = useState("");
    const [errolTen, setErrolTen] = useState("");
    const [errolSdt, setErrolSdt] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrolTenDangNhap("");
        setErrolEmail('');
        setErrolmatKhau('');
        setErrolmatKhaulapLai('');
        setErrolHoDem('');
        setErrolTen('');
        setErrolSdt('');

        const validTenDangNhap = await kiemTraTenDangNhap(tenDangNhap);
        const validEmail = await kiemTraEmail(email);
        const validMatKhau = kiemTraMatKhau(matKhau);
        const validMatKhauLapLai = kiemTraMatKhauLapLai(matKhaulapLai, matKhau);
        const validKiemTraHoDem = kiemTraHoDem(hoDem);
        const validKiemTraTen = kiemTraTen(ten);
        const validKiemTraSdt = kiemTraSdt(soDienThoai);
        if (validTenDangNhap && validEmail && validMatKhau && validMatKhauLapLai && validKiemTraHoDem && validKiemTraTen && validKiemTraSdt) {
            try {
                const url = `http://localhost:8080/tai-khoan/dang-ky`;
                const respone = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        tenDangNhap: tenDangNhap,
                        email: email,
                        matKhau: matKhau,
                        hoDem: hoDem,
                        ten: ten,
                        soDienThoai: soDienThoai,
                        gioiTinh: gioiTinh
                    })
                });
                if (respone.ok) {
                    setThongBao("Dang ký thành công vui long kiểm tra email để kích hoạt tài khoản");
                   
                } else {
                    setThongBao("Đã xảy ra lỗi vui long kiểm tra lại các thông tin đc báo lỗi...!");
                    
                }

            } catch (error) {
                setThongBao("Đã xảy ra lỗi vui long kiểm tra lại các thông tin đc báo lỗi!");
               
            }
        }else {
            setThongBao("Đăng ký thất bại!") ;
            
        }
    }
    const kiemTraTenDangNhap = async (trenDangNhap: string) => {
        const url = `http://localhost:8080/nguoi-dung/search/existsByTenDangNhap?tenDangNhap=${trenDangNhap}`;
        // call api 
        try {
            const respone = await fetch(url);
            const data = await respone.text();
            if (data === "true") {
                setErrolTenDangNhap("ten dang nhap da ton tai!");
                return false;
            }
            return true;
        } catch (error) {
            return false;
            console.error(error);
        }
    }
    const kiemTraEmail = async (email: string) => {
        const url = `http://localhost:8080/nguoi-dung/search/existsByEmail?email=${email}`;
        // call api 
        try {
            const respone = await fetch(url);
            const data = await respone.text();
            if (data === "true") {
                setErrolEmail("Email da ton tai!");
                return false;
            }
            return true;
        } catch (error) {
            return false;
            console.error(error);
        }
    }
    const handleTenDangNhapChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setTenDangNhap(value);

        // kiểm tra trùng lặp 
        setErrolTenDangNhap("");

        // endpoint 
        kiemTraTenDangNhap(value);
    }

    const handleEmailChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value);

        // kiểm tra trùng lặp 
        setErrolEmail("");

        // viet 
        // endpoint 
        kiemTraEmail(value);
    }

    const kiemTraMatKhau = (matKhau: string) => {
        const regularPasswork = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{2,16}$/;
        if (matKhau === '') {
            setErrolmatKhau("");
            return false;
        } else
            if (!regularPasswork.test(matKhau)) {
                setErrolmatKhau("mật khẩu phải có ít nhất 1 ký tự số , 1 ký tự đặc biệt và phải có 8 chữ số trở lên ");
                return false;
            } else {
                setErrolmatKhau("hợp lệ.");
                return true;
            }
    }
    const kiemTraMatKhauLapLai = (matKhauLapLai: string, matKhau: string) => {
        if (matKhauLapLai === '') {
            setErrolmatKhaulapLai("");
            return false;
        } else
            if (matKhauLapLai === matKhau) {
                setErrolmatKhaulapLai("");
                return true;
            } else {
                setErrolmatKhaulapLai("Mật khẩu không khớp!");
                return false;
            }
    }
    const handleMatKhauChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMatKhau(value);
        kiemTraMatKhau(value);
        kiemTraMatKhauLapLai(matKhaulapLai, value);
    }

    const handleMatKhauLapLaiChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMatKhauLapLai(e.target.value);
        kiemTraMatKhauLapLai(e.target.value, matKhau);
    }

    // họ tên 
    const kiemTraHoDem = (hoDem: string) => {
        const regular = /^(?=.*[a-zA-ZÃ-Ỹã-ỹ])[a-zA-ZÃ-Ỹã-ỹ\s]{1,20}$/;
        if (hoDem === '') {
            setErrolHoDem("tên không được bỏ trống");
            return false;
        } else if (!regular.test(hoDem)) {
            setErrolHoDem("tên chỉ được chứa kỹ tự chữ cái!");
            return false;
        } else {
            setErrolHoDem("");
            return true;
        }
    }
    const kiemTraTen = (ten: string) => {
        const regular = /^(?=.*[a-zA-ZÃ-Ỹã-ỹ])[a-zA-ZÃ-Ỹã-ỹ\s]{1,20}$/;
        if (ten === '') {
            setErrolTen("tên không được bỏ trống");
            return false;
        } else if (!regular.test(ten)) {
            setErrolTen("tên chỉ được chứa kỹ tự chữ cái!");
            return false;
        } else {
            setErrolTen("");
            return true;
        }
    }
    const kiemTraSdt = (sdt: string) => {
        const regular = /^[0-9]{10}$/;
        if (!regular.test(sdt)) {
            setErrolSdt("Sdt không hợp lệ");
            return false;
        } else {
            setErrolSdt("");
            return true;
        }
    }
    const handleHoDemChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHoDem(value);
        kiemTraHoDem(value);
    }
    const handleTenChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTen(value);
        kiemTraTen(value);
    }
    const handleSdtChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSoDienThoai(value);
        kiemTraSdt(value);
    }
    const handleGioiTinhChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGioiTinh(value);
    }
    return (
        <div className="container">
            <h1 className="mt-5 text-center" > Đăng ký</h1>
            <div className="mb-3 col-md-6 col-12 mx-auto">
                <form onSubmit={handleSubmit} className="form">
                    <div className="mb-3">
                        <label htmlFor="tenDangNhap" className="form-label">Tên đăng nhập</label>
                        <input
                            id="tenDangNhap"
                            type="text"
                            className="form-control"
                            value={tenDangNhap}
                            onChange={handleTenDangNhapChange}
                        />
                        <div className="text-left " style={{ color: 'red' }}>{errolTenDangNhap}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            type="text"
                            className="form-control"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <div className="text-left " style={{ color: 'red' }}>{errolEmail}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="matKhau" className="form-label">Mat khau</label>
                        <input
                            id="matKhau"
                            type="password"
                            className="form-control"
                            value={matKhau}
                            onChange={handleMatKhauChange}
                        />
                        <div className="text-left " style={{ color: 'red' }}>{errolMatKhau}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="matKhaulapLai" className="form-label">Nhap lai mat khau</label>
                        <input
                            id="matKhaulapLai"
                            type="password"
                            className="form-control"
                            value={matKhaulapLai}
                            onChange={handleMatKhauLapLaiChange}
                        />
                        <div className="text-left " style={{ color: 'red' }}>{errolMatKhauLapLai}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="hoDem" className="form-label">Họ đệm</label>
                        <input
                            id="hoDem"
                            type="text"
                            className="form-control"
                            value={hoDem}
                            onChange={handleHoDemChange}
                        />
                        <div className="text-left " style={{ color: 'red' }}>{errolHoDem}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="ten" className="form-label">Tên</label>
                        <input
                            id="ten"
                            type="text"
                            className="form-control"
                            value={ten}
                            onChange={handleTenChange}
                        />
                        <div className="text-left " style={{ color: 'red' }}>{errolTen}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="sdt" className="form-label">Số điện thoại</label>
                        <input
                            id="sdt"
                            type="text"
                            className="form-control"
                            value={soDienThoai}
                            onChange={handleSdtChange}
                        />
                        <div className="text-left " style={{ color: 'red' }}>{errolSdt}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="gioiTinh" className="form-label">Giới tính</label>
                        <input
                            id="gioiTinh"
                            type="text"
                            className="form-control"
                            value={gioiTinh}
                            onChange={handleGioiTinhChange}
                        />
                        <div className="text-left " style={{ color: 'red' }}>{ }</div>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Đăng ký</button>
                        <div style={{ color: 'green' }}>{thongBao  } </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default DangKyNguoiDung;  