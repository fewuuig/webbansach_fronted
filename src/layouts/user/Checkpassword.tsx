import { METHODS } from "http";
import React, { ChangeEvent, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import DangNhap from "./DangNhap";
interface Login {
    setIsLoggedIn: any;
}

const CheckPassword: React.FC = () => {
    const [thongBao , setThongBao] = useState<String>("") ; 
    const [password , setPassword] = useState<string>("") ; 
    const {state} = useLocation() ; 
    const {username} = state || null ; 
    const navigate = useNavigate() ; 
    const handleOnSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        fetch('http://localhost:8080/tai-khoan/dang-nhap', 
            { method: 'POST', headers: { 'Content-type': 'application/json' }, body: JSON.stringify({password : password , username : username}) })
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
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e) => (setPassword(e.target.value))} />
                </div>
                <div>{thongBao}</div>
                <button type="submit" className="btn btn-primary">Đăng nhập</button>
            </form>
        </div>
    );
}
export default CheckPassword; 