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
import "./XemDon.css";
import { jwtDecode } from "jwt-decode";

interface SachTrongDonDTOS {
    maSach: number,
    soLuong: number,
    giaBan: number,
    tongGia: number,
    tenSach: string
}
interface donHang {
    soDienThoai: string,
    hoTen: string,
    tongGia: number,
    maDonHang: number,
    chiPhiGiaoHang: number,
    diaChiNhanHang: string,
    trangThai: string,
    sachTrongDonDTOS: SachTrongDonDTOS[];
}
interface props {
    trangThai: string;
}
interface Jwtpayload {
    isAdmin: boolean;
    isStaff: boolean;
    isUser: boolean;
} 

const XemDon: React.FC<props> = ({ trangThai }) => {
    const [danhSachDonHang, setDanhSachDonHang] = useState<donHang[]>([]);
    const [reload, setReload] = useState<boolean>(false);
    let trangThaiDonChoXacNHan = "CHO_XAC_NHAN";
    let trangThaiDonDaHuy = "DA_HUY";

    useEffect(() => {
        layDonHangTheoTrangThai(trangThai).then(
            data => {
                setDanhSachDonHang(data);
            }
        ).catch(error => {
            console.error(error);
        })
    }, [trangThai, reload])

    const handleHuyDon = async (maDonHang: number) => {
        const accessToken = localStorage.getItem("accessToken");
        await fetch(`http://localhost:8080/don-hang/${maDonHang}/huy-don`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }).then(respone => {
            if (respone.ok) {
                setReload(!reload);
            }
            alert("Hủy đơn hàng thành công");
        })
    }
    const handleDatLai = async (maDonHang: number) => {
        const accessToken = localStorage.getItem("accessToken");
        await fetch(`http://localhost:8080/don-hang/${maDonHang}/dat-lai`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }).then(respone => {
            if (respone.ok) {
                setReload(!reload);
            }
            alert("đặt hàng thành công");
        })

    }
     const accessToken = localStorage.getItem("accessToken");
    // decode 
    let isAdmin: boolean = false ; 
    let isStaff : boolean = false ; 
    if(accessToken){
        const role = jwtDecode(accessToken) as Jwtpayload ; 
        if(role.isAdmin == true || role.isStaff == true){
            isAdmin = true ; 
            isStaff = true ; 
        }
    }
    const handleGiaoHang = async (maDonHang : number , trangThai : string)=>{
         const accessToken = localStorage.getItem("accessToken");
        await fetch(`http://localhost:8080/don-hang/${maDonHang}/trang-thai?trangThai=${trangThai}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }).then(respone => {
            if (respone.ok) {
                setReload(!reload);
            }
            alert("Đang giao hàng");
        })
    }
        const handleDaGiao= async (maDonHang : number , trangThai : string)=>{
         const accessToken = localStorage.getItem("accessToken");
        await fetch(`http://localhost:8080/don-hang/${maDonHang}/trang-thai?trangThai=${trangThai}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }).then(respone => {
            if (respone.ok) {
                setReload(!reload);
            }
            alert("Đã hoàn thành đơn hàng");
        })
    }

    return (
        <div className="container mt-4">
            {danhSachDonHang.map(donHang => (

                <div className="card order-card mb-4" key={donHang.maDonHang}>

                    {/* HEADER */}
                    <div className="card-header d-flex justify-content-between align-items-center bg-white border-0 pb-2">
                        <div>
                            <span className="text-muted small">Mã đơn</span><br />
                            <strong className="text-dark">{donHang.maDonHang}</strong>
                        </div>

                        <span className="badge status-badge">
                            {donHang.trangThai}
                        </span>
                    </div>

                    {/* BODY */}
                    <div className="card-body pt-2">

                        {donHang.sachTrongDonDTOS.map(sach => (
                            <div className="row align-items-center product-row" key={sach.maSach}>

                                {/* ẢNH NHỎ LẠI */}
                                <div className="col-2 text-center">
                                    <div className="img-box">
                                        <MotHinhAnhCuaSach maSach={sach.maSach} />
                                    </div>
                                </div>

                                {/* INFO */}
                                <div className="col-6">
                                    <p className="book-name">
                                        {sach.tenSach}
                                    </p>
                                    <p className="book-qty">
                                        x{sach.soLuong}
                                    </p>
                                </div>

                                {/* GIÁ */}
                                <div className="col-4 text-end">
                                    <p className="book-price">
                                        {dinhDangSo(sach.giaBan)} đ
                                    </p>
                                    <p className="book-total">
                                        {dinhDangSo(sach.tongGia)} đ
                                    </p>
                                </div>

                            </div>
                        ))}

                        {/* FOOTER */}
                        <div className="row mt-3 align-items-center">

                            <div className="address-box">
                                <div className="receiver-name">
                                    {donHang.hoTen}
                                </div>

                                <div className="receiver-phone">
                                    {donHang.soDienThoai}
                                </div>

                                <div className="receiver-address">
                                    {donHang.diaChiNhanHang}
                                </div>
                            </div>

                            {/* TỔNG */}
                            <div className="col-5 text-end">

                                <div className="price-box">
                                    <div className="sub-price">
                                        Phí ship: {dinhDangSo(donHang.chiPhiGiaoHang)} đ
                                    </div>
                                    <div className="sub-price">
                                        Tiền hàng: {dinhDangSo(donHang.tongGia)} đ
                                    </div>

                                    <div className="total-price">
                                        Tổng: {dinhDangSo(donHang.chiPhiGiaoHang + donHang.tongGia)} đ
                                    </div>
                                </div>

                                {/* BUTTON */}
                                <div className="mt-3 d-flex justify-content-end gap-2">
                                    {trangThaiDonChoXacNHan === donHang.trangThai && (
                                        <button
                                            className="btn btn-outline-danger action-btn"
                                            onClick={() => handleHuyDon(donHang.maDonHang )}
                                        >
                                            Hủy đơn
                                        </button>
                                    )}
                                    {
                                        (isAdmin || isStaff ) && donHang.trangThai=='DA_XAC_NHAN' && (
                                            <button
                                            className="btn btn-outline-danger action-btn"
                                            onClick={() => handleGiaoHang(donHang.maDonHang ,"DANG_GIAO")}
                                        >
                                            Giao hàng
                                        </button>
                                        )
                                    }
                                    {
                                        (isAdmin || isStaff )&& donHang.trangThai =='DANG_GIAO' && (
                                            <button
                                            className="btn btn-outline-danger action-btn"
                                            onClick={() => handleDaGiao(donHang.maDonHang ,"DA_GIAO")}
                                        >
                                            Đã giao
                                        </button>
                                        )
                                    }
                                    {trangThaiDonDaHuy === donHang.trangThai && (
                                        <button
                                            className="btn btn-primary action-btn highlight-btn"
                                            onClick={() => handleDatLai(donHang.maDonHang)}
                                        >
                                            Đặt lại
                                        </button>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
}
export default XemDon; 