import React, { useEffect, useState } from "react";
import { data, useLocation } from "react-router-dom";
import MotHinhAnhCuaSach from "../../product/components/MotHinhAnhCuaSach";
import XemDiaChiGiaoHang from "../XemDiaChiGiaoHang";
import XemHinhThucGiaoHang from "../XemHinhThucGiaoHang";
import XemHinhThucThanhToan from "../XemHinhThucThanhToan";
import dinhDangSo from "../../utils/DinhDangSo";
import { stat } from "fs";
import { Google } from "react-bootstrap-icons";
import { error } from "console";
import { layDanhSachSanPhamDatHang } from "../../../api/SachTrongKho";

interface ViewCart {
    maGioHangSach: number,
    maSach: number,
    soLuong: number,
    tenSach: string,
    giaBan: number,
    tongGia: number
}

const ChiTietDon: React.FC = (props) => {
    const { state } = useLocation();
    const { danhSachSanPhamChon } = state || {};
    const [maDiaChi, setMaDiaChi] = useState<number | null>(null);
    const [maHinhThucThanhToan, setMaHinhThucThanhToan] = useState<number | null>(null);
    const [maHinhThucGiaoHang, setMaHinhThucGiaoHang] = useState<number | null>(null);
    const [danhSachSanPhamDatHang, setDanhSachSanPhamDatHang] = useState<ViewCart[]>([])
    useEffect(() => {
        layDanhSachSanPhamDatHang(danhSachSanPhamChon).then(
            data => {
                setDanhSachSanPhamDatHang(data);
            }
        )
            .catch(
                error => {
                    console.error(error);
                }
            )
    }, [])
    const handleDatHang = async () => {
        if (!maDiaChi) {
            alert("Vui lòng chọn địa chỉ giao hàng");
            return;
        } else if (!maHinhThucThanhToan) {
            alert("vui long chọn hình thức thanh toán!");
            return;
        } else if (!maHinhThucGiaoHang) {
            alert("vui lòng chọn hình thức giao hàng");
        }
        const accessToken = localStorage.getItem("accessToken");

        const respone = await fetch("http://localhost:8080/order/place-order-from-cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                danhSachSanPhamDatHang: danhSachSanPhamChon,
                maDiaChiGiaoHang: maDiaChi,
                maHinhThucThanhToan: maHinhThucThanhToan,
                maHinhThucGiaoHang: maHinhThucGiaoHang
            }),
        }) ; 
        if(!respone.ok){
            const responeData =await respone.json() ; 
            alert(responeData.error) ; 
            return ;
        }
        alert("Đặt hàng thành công");
    }
    return (
        <div className="container">
            <XemDiaChiGiaoHang maDiaChiDuocChon={maDiaChi} setMaDiaChi={setMaDiaChi} />
            {

                danhSachSanPhamChon && danhSachSanPhamDatHang.map(gioHangSach => (
                    <div className="row">

                        <div className="col-5"><MotHinhAnhCuaSach maSach={gioHangSach.maSach} /></div>
                        <div className="col-7">
                            <p>Tên sách : {gioHangSach.tenSach}</p>
                            <p>Giá : {gioHangSach.giaBan}</p>
                            <p>SL :  x{gioHangSach.soLuong}</p>
                            <p>Tổng giá : {dinhDangSo(gioHangSach.tongGia)}</p>



                        </div>
                    </div>
                ))

            }
            <XemHinhThucGiaoHang maHinhThucGiaoHang={maHinhThucGiaoHang} setMaHinhThucGiaoHang={setMaHinhThucGiaoHang} />
            <XemHinhThucThanhToan maHinhThucThanhToan={maHinhThucThanhToan} setMaHinhThucThanhToan={setMaHinhThucThanhToan} />
            <button className="btn btn-success " onClick={handleDatHang}>Đặt hàng</button>
        </div>
    );
}
export default ChiTietDon; 