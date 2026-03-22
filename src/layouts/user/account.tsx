import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
interface props{
    username : string , 
    setUsername : any 
}
const CheckUsername : React.FC<props> = ({username, setUsername})=>{
    const [thongBao , setThongBao] = useState<string>("") ; 
    const navigate = useNavigate() ; 
    const handleOnSubmit = async (e : React.FormEvent)=>{
        const respone = await fetch("http://localhost:8080/tai-khoan/check-username" ,{
            method : 'GET' , 
            body:JSON.stringify({
                username : username 
            })
        })
        if(respone.ok){
            navigate("/account/password") ; 
        }else {
            setThongBao("tài khoản không tồn tại") ; 
            throw new Error("tài khoản không tồn tại") ; 
        }
        
    }
    return (

        <div className="container mt-5" style={{ width: '400px' }}>
            <form onSubmit={handleOnSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Username</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" onChange={(e) => (setUsername(e.target.value))} />
                    <div id="emailHelp" className="form-text"></div>
                </div>
                <div>{thongBao}</div>
                <button type="submit" className="btn btn-primary">Đăng nhập</button>
            </form>
        </div>
    ) ; 
}
export default CheckUsername ; 