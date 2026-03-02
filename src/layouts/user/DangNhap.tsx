import { METHODS } from "http";
import React, { ChangeEvent, useState } from "react";
import HomePage from "../homepage/HomePage";
import { useNavigate } from "react-router-dom";
interface Login {
    setIsLoggedIn: any;
}
const DangNhap: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [thongBao, setThongBao] = useState("");

    const handle = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const account = {
        username: username,
        password: password
    }
    const navigate = useNavigate() ; 
    const handleOnSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        fetch('http://localhost:8080/tai-khoan/dang-nhap', { method: 'POST', headers: { 'Content-type': 'application/json' }, body: JSON.stringify(account) })
            .then(
                (respone) => {
                    if (respone.ok) {
                        setThongBao("Đăng nhập thành công");
                      
                        return respone.json();

                    } else {
                        setThongBao("Đăng nhập thất bại");
                        throw new Error("Đăng nhập thát bại");
                    }
                }
            ).then(
                (data) => {
                    const { accessToken, refreshToken } = data;
                    // lưu token vào localStorage
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    
                    // điều hướng đến trang chính  hoặc trang nào đó sau khi đăng nhập thành công 
                    navigate("/") ; 
                }
            ).catch(error => {
                console.error("đăng nhập thất bại", error);
                setThongBao("Đăng nhập thất bại , vui lông kiểm tra lại tài khoản hoặc mật khẩu");
            })
    }
    return (
        <div className="container mt-5" style={{ width: '400px' }}>
            <form onSubmit={handleOnSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Username</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" onChange={(e) => (setUsername(e.target.value))} />
                    <div id="emailHelp" className="form-text"></div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e) => (setPassword(e.target.value))} />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                </div>
                <div>{thongBao}</div>
                <button type="submit" className="btn btn-primary">Đăng nhập</button>
            </form>
        </div>
    );
}
export default DangNhap; 