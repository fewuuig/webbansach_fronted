import { stringify } from "node:querystring";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
const Logout: React.FC = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        await fetch('http://localhost:8080/tai-khoan/logout',
            {
                method: 'POST',
                headers: {
                    'content-type': "application/json"
                },
                body: JSON.stringify(
                    { refreshToken: refreshToken }
                )
            }
        )
        localStorage.clear();
        
        navigate("/");
    }
    return (
        <div>
            <button className="btn btn-primary" onClick={handleLogout}>Đăng xuất</button>
        </div>
    );
}
export default Logout;