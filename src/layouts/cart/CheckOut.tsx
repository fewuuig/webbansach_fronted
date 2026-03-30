import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MotHinhAnhCuaSach from "../product/components/MotHinhAnhCuaSach";
import dinhDangSo from "../utils/DinhDangSo";
import XemDiaChiGiaoHang from "./XemDiaChiGiaoHang";
import XemHinhThucThanhToan from "./XemHinhThucThanhToan";
import XemHinhThucGiaoHang from "./XemHinhThucGiaoHang";
import "./ChiTietSanPham.css";
import VoucherUser, { MaGiamGiaCuaUserResponeDTO } from "./MaGiamGia";

const CheckOut: React.FC = () => {
    const { state } = useLocation();
    const { sach, soLuong } = state || {};

    const [maDiaChi, setMaDiaChi] = useState<number | null>(null);
    const [maHinhThucThanhToan, setMaHinhThucThanhToan] = useState<number | null>(null);
    const [maHinhThucGiaoHang, setMaHinhThucGiaoHang] = useState<number | null>(null);

    const [voucher, setVoucher] = useState<MaGiamGiaCuaUserResponeDTO | null>(null);

    const navigate = useNavigate();

    // ================== TÍNH TIỀN ==================
    const tongTien = soLuong * sach.giaBan;

    let tienGiam = 0;

    if (voucher && tongTien >= voucher.donGiaTu) {
        if (voucher.loaiMaGiamGia === "PERCENT") {
            tienGiam = Math.min(
                tongTien * 0.1, // ví dụ 10%
                voucher.giamToiDa
            );
        } else {
            tienGiam = voucher.giamToiDa;
        }
    }

    const tongSauGiam = tongTien - tienGiam;

    // ================== ORDER ==================
    const handleDatHang = async () => {
        if (!maDiaChi) {
            alert("Vui lòng chọn địa chỉ giao hàng");
            return;
        }
        if (!maHinhThucThanhToan) {
            alert("Vui lòng chọn thanh toán");
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
                items: [{
                    maSach: sach.maSach,
                    soLuong: soLuong,
                }],
                maGiam: voucher?.maGiam ?? null,
                maDiaChiGiaoHang: maDiaChi,
                maHinhThucThanhToan: maHinhThucThanhToan,
                maHinhThucGiaoHang: maHinhThucGiaoHang
            }),
        });

        alert("Đặt hàng thành công");
        navigate("/don-hang");
    };

    return (
        <div className="checkout-container">
            <div className="checkout-card">
                <div className="row">

                    {/* LEFT */}
                    <div className="col-md-5 left-panel">
                        <MotHinhAnhCuaSach maSach={sach.maSach} />
                    </div>

                    {/* RIGHT */}
                    <div className="col-md-7 right-panel">

                        <XemDiaChiGiaoHang
                            maDiaChiDuocChon={maDiaChi}
                            setMaDiaChi={setMaDiaChi}
                        />

                        <div className="book-info">
                            <h4>{sach.tenSach}</h4>

                            <p>Giá: {dinhDangSo(sach.giaBan)}</p>

                            <p>Số lượng: x{soLuong}</p>

                            <p>Tổng gốc: {dinhDangSo(tongTien)}</p>

                            {
                                voucher && (
                                    <p style={{ color: "green" }}>
                                        Giảm: -{dinhDangSo(tienGiam)}
                                    </p>
                                )
                            }

                            <p style={{ color: "red", fontWeight: "bold" }}>
                                Thanh toán: {dinhDangSo(tongSauGiam)}
                            </p>
                        </div>

                        <VoucherUser setVoucher={setVoucher} />

                        <XemHinhThucGiaoHang
                            maHinhThucGiaoHang={maHinhThucGiaoHang}
                            setMaHinhThucGiaoHang={setMaHinhThucGiaoHang}
                        />

                        <XemHinhThucThanhToan
                            maHinhThucThanhToan={maHinhThucThanhToan}
                            setMaHinhThucThanhToan={setMaHinhThucThanhToan}
                        />

                        <button className="btn-order" onClick={handleDatHang}>
                            Đặt hàng
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckOut;