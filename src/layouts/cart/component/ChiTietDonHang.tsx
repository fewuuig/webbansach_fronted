import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MotHinhAnhCuaSach from "../../product/components/MotHinhAnhCuaSach";
import XemDiaChiGiaoHang from "../XemDiaChiGiaoHang";
import XemHinhThucGiaoHang from "../XemHinhThucGiaoHang";
import XemHinhThucThanhToan from "../XemHinhThucThanhToan";
import dinhDangSo from "../../utils/DinhDangSo";
import "./ChiTietDon.css";
import { layDanhSachSanPhamDatHang } from "../../../api/SachTrongKho";
import VoucherUser, { MaGiamGiaCuaUserResponeDTO } from "../MaGiamGia";

interface ViewCart {
    maGioHangSach: number;
    maSach: number;
    soLuong: number;
    tenSach: string;
    giaBan: number;
    tongGia: number;
}

interface kq {
    soLuong: number;
    maSach: number;
}

const ChiTietDon: React.FC = () => {

    const { state } = useLocation();
    const { danhSachSanPhamChon } = state || {};

    const [maDiaChi, setMaDiaChi] = useState<number | null>(null);
    const [maHinhThucThanhToan, setMaHinhThucThanhToan] = useState<number | null>(null);
    const [maHinhThucGiaoHang, setMaHinhThucGiaoHang] = useState<number | null>(null);

    const [danhSachSanPhamDatHang, setDanhSachSanPhamDatHang] = useState<ViewCart[]>([]);
    const [voucher, setVoucher] = useState<MaGiamGiaCuaUserResponeDTO | null>(null);

    const navigate = useNavigate();

    // ================== LOAD DATA ==================
    useEffect(() => {
        layDanhSachSanPhamDatHang(danhSachSanPhamChon)
            .then(data => setDanhSachSanPhamDatHang(data))
            .catch(error => console.error(error));
    }, []);

    // ================== BUILD ITEMS ==================
    const items: kq[] = danhSachSanPhamDatHang.map(item => ({
        maSach: item.maSach,
        soLuong: item.soLuong
    }));

    // ================== TÍNH TIỀN ==================
    const tongTien = danhSachSanPhamDatHang.reduce(
        (sum, item) => sum + item.tongGia,
        0
    );

    let tienGiam = 0;

    if (voucher && tongTien >= voucher.donGiaTu) {
        if (voucher.loaiMaGiamGia === "PERCENT") {
            tienGiam = Math.min(
                tongTien * 0.1, // ⚠️ tạm hardcode 10%
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
            alert("Vui lòng chọn hình thức thanh toán!");
            return;
        }
        if (!maHinhThucGiaoHang) {
            alert("Vui lòng chọn hình thức giao hàng!");
            return;
        }

        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch("http://localhost:8080/order/place-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                items: items,
                maGiam: voucher?.maGiam ?? null,
                danhSachSanPhamChon: danhSachSanPhamChon,
                maDiaChiGiaoHang: maDiaChi,
                maHinhThucThanhToan: maHinhThucThanhToan,
                maHinhThucGiaoHang: maHinhThucGiaoHang
            }),
        });

        if (!response.ok) {
            const data = await response.json();
            alert(data.error);
            return;
        }

        alert("Đặt hàng thành công");
        navigate("/don-hang");
    };

    // ================== UI ==================
    return (
        <div className="checkout-container">
            <div className="checkout-card">
                <div className="row">

                    {/* LEFT */}
                    <div className="col-md-5 left-panel">
                        {
                            danhSachSanPhamDatHang.length > 0 && (
                                <MotHinhAnhCuaSach
                                    maSach={danhSachSanPhamDatHang[0].maSach}
                                />
                            )
                        }
                    </div>

                    {/* RIGHT */}
                    <div className="col-md-7 right-panel">

                        <XemDiaChiGiaoHang
                            maDiaChiDuocChon={maDiaChi}
                            setMaDiaChi={setMaDiaChi}
                        />

                        {/* DANH SÁCH SẢN PHẨM */}
                        <div className="book-info">
                            {
                                danhSachSanPhamDatHang.map(item => (
                                    <div key={item.maSach} style={{ marginBottom: "12px" }}>
                                        <h4>{item.tenSach}</h4>

                                        <p>Giá: {dinhDangSo(item.giaBan)}</p>

                                        <p>Số lượng: x{item.soLuong}</p>

                                        <p>Tổng: {dinhDangSo(item.tongGia)}</p>

                                        <hr />
                                    </div>
                                ))
                            }

                            {/* ===== TỔNG ĐƠN ===== */}
                            <p><b>Tổng gốc:</b> {dinhDangSo(tongTien)}</p>

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

                        {/* VOUCHER */}
                        <VoucherUser setVoucher={setVoucher} />

                        {/* SHIPPING */}
                        <XemHinhThucGiaoHang
                            maHinhThucGiaoHang={maHinhThucGiaoHang}
                            setMaHinhThucGiaoHang={setMaHinhThucGiaoHang}
                        />

                        {/* PAYMENT */}
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

export default ChiTietDon;