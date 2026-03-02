import React, { useEffect, useState } from "react";
import BookModel from "../../../model/BookModel";
import HinhAnhModel from "../../../model/HinhAnhModel";
import { layAnhDauTienCuaMotQuyenSach } from "../../../api/HinhAnhApi";
import { error } from "console";
interface CarousellItem{
    sach:BookModel ; 
}

const CarousellItem: React.FC<CarousellItem>=(props)=>{
    const [danhSachHinhAnh , setDanhSachHinhAnh] = useState<HinhAnhModel[]|null>([]) ; 
    const [baoLoi , setBaoLoi] = useState(null) ; 
    const [layDuLieu , setLayDuLieu] = useState(true) ; 

    useEffect(()=>{
        layAnhDauTienCuaMotQuyenSach(props.sach.maSach).then(
            anhData =>{
                setDanhSachHinhAnh(anhData) ; 
                setLayDuLieu(false) ; 
            }
        ).catch(
            error=>{
                setBaoLoi(error.message) ; 
                setLayDuLieu(true) ; 
            }
        )
        
    },[]
    )
    if(layDuLieu){
        return(
            <div><h1>dang lay du lieu</h1></div>
        );
    }
    if(baoLoi){
        return (
            <div><h1>gap loi</h1></div>
        );
    }
    return (
         <div className="row align-items-center">
            <div className="col-5 text-right">
              {
                danhSachHinhAnh && <img src={ danhSachHinhAnh[0].duLieuAnh} style={{ width: '200px' , height:'220px' }} />
              }
            </div>
            <div className="col-7">
              <h5>{props.sach.tenSach}</h5>
              <p>{props.sach.moTa}</p>
            </div>
          </div>
    );
}
export default CarousellItem ; 