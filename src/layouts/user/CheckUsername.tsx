import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckUsername : React.FC = ()=>{
    const [thongBao , setThongBao] = useState<string>("") ; 
    const navigate = useNavigate() ; 
    const [username , setUsername] = useState<string>("") ; 
    const handleOnSubmit = async (e : React.FormEvent)=>{
        e.preventDefault() ; 
        console.log(username) ; 
        if(!username) {
            setUsername("") ; 
            return ;
        }  
        const respone = await fetch(`http://localhost:8080/tai-khoan/check-username?username=${username}` ,{
            method : 'GET' , 
        })
        if(respone.ok){
             
            const data =await respone.json() ; 
            console.log(data) ;
            if(data === false){
                setThongBao("tài khoản không tồn tại") ; 
                return ;
            }
            navigate("/account/password" ,{
                state:{
                    username,
                }
            }) ; 
            setUsername("") ; 
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
                <button type="submit" className="btn btn-primary">Tiếp tục</button>
            </form>
        </div>
    ) ; 
}
export default CheckUsername ; 