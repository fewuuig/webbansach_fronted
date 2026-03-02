import React, { useEffect, useState } from "react";
import { data, useLocation } from "react-router-dom";
import MotHinhAnhCuaSach from "../product/components/MotHinhAnhCuaSach";
import dinhDangSo from "../utils/DinhDangSo";
import { layDiaChiGiaoHangCuaNguoiDung } from "../../api/DiaChiGiaoHang";
import { error } from "console";
import XemDiaChiGiaoHang from "./XemDiaChiGiaoHang";
import { layTatCaHinhThucThanhToan } from "../../api/HinhThucThanhToanApi";
import XemHinhThucThanhToan from "./XemHinhThucThanhToan";
import XemHinhThucGiaoHang from "./XemHinhThucGiaoHang";

const CheckOut: React.FC = () => {
    const { state } = useLocation();
    const { sach, soLuong } = state || {};
    const [maDiaChi, setMaDiaChi] = useState<number | null>(null);
    const [maHinhThucThanhToan, setMaHinhThucThanhToan] = useState<number | null>(null);
    const [maHinhThucGiaoHang, setMaHinhThucGiaoHang] = useState<number | null>(null);
    const handleDatHang = async () => {
        if (!maDiaChi) {
            alert("Vui lòng chọn địa chỉ giao hàng");
            return;
        } else if (!maHinhThucThanhToan) {
            alert("vui long chọn địa chỉ giao hàng!");
            return;
        }
        const accessToken = localStorage.getItem("accessToken");

        await fetch("http://localhost:8080/order/place-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                maSach: sach.maSach,
                soLuong: soLuong,
                maDiaChiGiaoHang: maDiaChi,
                maHinhThucThanhToan: maHinhThucThanhToan,
                maHinhThucGiaoHang: maHinhThucGiaoHang
            }),
        });
        console.log({
            maSach: sach.maSach,
            soLuong: soLuong,
            maDiaChiGiaoHang: maDiaChi,
            maHinhThucThanhToan: maHinhThucThanhToan,
            maHinhThucGiaoHang: maHinhThucGiaoHang
        })
        alert("Đặt hàng thành công");
    }
    return (
        <div className="container">
            {
                <div className="row">

                    <div className="col-5"><MotHinhAnhCuaSach maSach={sach.maSach} /></div>
                    <div className="col-7">
                        <XemDiaChiGiaoHang maDiaChiDuocChon={maDiaChi} setMaDiaChi={setMaDiaChi} />
                        <p>Tên sách : {sach.tenSach}</p>
                        <p>Giá : {sach.giaBan}</p>
                        <p>SL :  x{soLuong}</p>
                        <p>Tổng giá : {dinhDangSo(soLuong * sach.giaBan)}</p>
                        <XemHinhThucGiaoHang maHinhThucGiaoHang={maHinhThucGiaoHang} setMaHinhThucGiaoHang={setMaHinhThucGiaoHang} />
                        <XemHinhThucThanhToan key={sach.maSach} maHinhThucThanhToan={maHinhThucThanhToan} setMaHinhThucThanhToan={setMaHinhThucThanhToan} />

                    </div>
                </div>
            }
            <button className="btn btn-success " onClick={handleDatHang}>Đặt hàng</button>
        </div>
    );
}
export default CheckOut; 