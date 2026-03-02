import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
interface Jwtpayload {
    isAdmin: boolean;
    isStaff: boolean;
    isUser: boolean;
}
const RequireAdmin = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const WithAdminCheck: React.FC<P> = (props) => {

        const navigate = useNavigate();

        useEffect(() => {
             const token = localStorage.getItem('accessToken');
            // trong trươnmgf hợp chưa đăngn hập 
            if (!token) {
                navigate("/dang-nhap");
                return;
            } else {
                // giải ma token 
                const decodeToken = jwtDecode(token) as Jwtpayload;
                // lấy thông tin của thể 
                const isAdmin = decodeToken.isAdmin;
                console.log(decodeToken);
                if (!isAdmin) {
                    navigate("/Fobbiden-403");
                    return;
                }
            }
            
        }, [navigate] ) ; 
        return <WrappedComponent {...props} />
    }
    return WithAdminCheck ; 

}
export default RequireAdmin; 