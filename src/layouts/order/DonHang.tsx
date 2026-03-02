import React, { useState } from "react";
import XemDon from "./XemDon";
const DonHang : React.FC = ()=>{
    const [trangThai , setTrangThai] = useState<string>("") ; 

    return (
        <div className="container">
            <div>
                <button onClick={()=>setTrangThai("CHO_XAC_NHAN")}>Chờ xác nhận</button>

                <button onClick={()=>setTrangThai("DA_XAC_NHAN")}>Đã xác nhận</button>

                <button onClick={()=>setTrangThai("DANG_GIAO")}>Đang giao</button>

                <button onClick={()=>setTrangThai("DA_GIAO")}>Đã giao</button>

                <button onClick={()=>setTrangThai("DA_HUY")}>Đã hủy</button>
                {trangThai && <XemDon trangThai={trangThai}/>}
            </div>
        </div>
    ) ; 
}
export default DonHang ; 