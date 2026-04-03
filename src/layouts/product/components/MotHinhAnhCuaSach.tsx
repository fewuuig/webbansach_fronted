import React, { useEffect, useState } from "react";
import HinhAnhModel from "../../../model/HinhAnhModel";
import { layAnhDauTienCuaMotQuyenSach } from "../../../api/HinhAnhApi";
interface props{
    maSach : number ; 
}
const MotHinhAnhCuaSach : React.FC<props> = (props)=>{
    const [hinhAnh , setHinhAnh] = useState<HinhAnhModel[]|null>(null) ;
    useEffect(()=>{
        layAnhDauTienCuaMotQuyenSach(props.maSach , 1).then(
            data=>{
                setHinhAnh(data) ; 
            }
        )

    },[]) 
    return (
        <div>
            {

               hinhAnh && hinhAnh[0] && <img src={hinhAnh[0].duLieuAnh} alt="ảnh đại diện của quyển sách" style={{width:'200px'}}/>
            }
        </div>
    ) ; 
}
export default MotHinhAnhCuaSach ; 