import React, { useEffect, useState } from "react";
import { layDonHangTheoTrangThai } from "../../api/TrangThaiDonHang";
import { useParams } from "react-router-dom";
import { error } from "console";
import MotHinhAnhCuaSach from "../product/components/MotHinhAnhCuaSach";
import ChiTietDon from "../cart/component/ChiTietDonHang";
import DonHang from "./DonHang";
import XemDiaChiGiaoHang from "../cart/XemDiaChiGiaoHang";
import HinhAnhSach from "../product/components/HinhAnhSach";
import dinhDangSo from "../utils/DinhDangSo";
interface SachTrongDonDTOS {
    maSach: number,
    soLuong: number,
    giaBan: number,
    tongGia: number,
    tenSach: string
}
interface donHang {
    maDonHang: number,
    chiPhiGiaoHang: number,
    diaChiNhanHang: string,
    trangThai: string,
    sachTrongDonDTOS: SachTrongDonDTOS[];
}
interface props {
    trangThai: string;
}
const XemDon: React.FC<props> = ({ trangThai }) => {
    const [danhSachDonHang, setDanhSachDonHang] = useState<donHang[]>([]);
    const [reload , setReload] = useState<boolean>(false) ; 
    let trangThaiDonChoXacNHan ="CHO_XAC_NHAN" ; 
    let trangThaiDonDaHuy = "DA_HUY" ; 
    useEffect(() => {
        layDonHangTheoTrangThai(trangThai).then(
            data => {
                setDanhSachDonHang(data);
            }
        ).catch(error => {
            console.error(error);
        })
    }, [trangThai,reload] )
    
    const handleHuyDon =async (maDonHang : number)=>{
        const accessToken = localStorage.getItem("accessToken") ; 
        await fetch(`http://localhost:8080/don-hang/${maDonHang}/huy-don`,{
            method : 'PUT' , 
            headers : {
                'Authorization' : `Bearer ${accessToken}`
            },
        }).then(respone=>{
            if(respone.ok){
                setReload(!reload) ; 
            }
            alert("Hủy đơn hàng thành công") ; 
        })
    }
    const handleDatLai = async(maDonHang : number)=>{
         const accessToken = localStorage.getItem("accessToken") ; 
        await fetch(`http://localhost:8080/don-hang/${maDonHang}/dat-lai`,{
            method : 'PUT' , 
            headers : {
                'Authorization' : `Bearer ${accessToken}`
            },
        }).then(respone=>{
            if(respone.ok){
                setReload(!reload) ; 
            }
            alert("đặt hàng thành công") ; 
        })

    }
    return (
        <div className="container mt-3">
            {danhSachDonHang.map(donHang => (
                
                <div className="card mb-4 shadow-sm" key={donHang.maDonHang}>
                    
                    {/* Header đơn hàng */}
                    <div className="card-header d-flex justify-content-between">
                        <span>Mã đơn: <strong>{donHang.maDonHang}</strong></span>
                        <span className="badge bg-primary">{donHang.trangThai}</span>
                    </div>

                    {/* Body đơn hàng */}
                    <div className="card-body">

                        {/* Danh sách sách */}
                        {donHang.sachTrongDonDTOS.map(sach => (
                            <div className="row align-items-center mb-3 border-bottom pb-2" key={sach.maSach}>

                                {/* Ảnh sách */}
                                <div className="col-2 text-center">
                                    <MotHinhAnhCuaSach maSach={sach.maSach} />
                                </div>

                                {/* Thông tin sách */}
                                <div className="col-6">
                                    <p className="fw-bold mb-1">{sach.tenSach}</p>
                                    
                                    <p className="mb-1">Số lượng: {sach.soLuong}</p>
                                </div>

                                {/* Giá */}
                                <div className="col-4 text-end">
                                    <p className="mb-1">Giá bán: {dinhDangSo(sach.giaBan)} đ</p>
                                    <p className="fw-bold text-danger">
                                        Tổng: {dinhDangSo(sach.tongGia)} đ
                                    </p>
                                </div>

                            </div>
                        ))}

                        {/* Footer đơn */}
                        <div className="row mt-3">
                            <div className="col-8">
                                <p className="mb-1">
                                    <strong>Địa chỉ:</strong> {donHang.diaChiNhanHang}
                                </p>
                            </div>
                            <div className="col-4 text-end">
                                <p className="fw-bold">
                                    Phí ship: {dinhDangSo(donHang.chiPhiGiaoHang)} đ    
                                    {trangThaiDonChoXacNHan===donHang.trangThai  && <button className="btn btn-danger" onClick={()=>handleHuyDon(donHang.maDonHang)} >Hủy đơn</button>}
                                     {trangThaiDonDaHuy===donHang.trangThai  && <button className="btn btn-success" onClick={()=>handleDatLai(donHang.maDonHang)} >Đặt lại</button>}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
}
export default XemDon; 