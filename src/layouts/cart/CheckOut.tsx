import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MotHinhAnhCuaSach from "../product/components/MotHinhAnhCuaSach";
import dinhDangSo from "../utils/DinhDangSo";
import XemDiaChiGiaoHang from "./XemDiaChiGiaoHang";
import XemHinhThucThanhToan from "./XemHinhThucThanhToan";
import XemHinhThucGiaoHang from "./XemHinhThucGiaoHang";
import "./CheckOut.css";
import VoucherUser, { MaGiamGiaCuaUserResponeDTO } from "./MaGiamGia";

const CheckOut: React.FC = () => {
  const { state } = useLocation();
  const { sach, soLuong } = state || {};

  const [maDiaChi, setMaDiaChi] = useState<number | null>(null);
  const [maHinhThucThanhToan, setMaHinhThucThanhToan] = useState<number | null>(null);
  const [maHinhThucGiaoHang, setMaHinhThucGiaoHang] = useState<number | null>(null);

  const [voucher, setVoucher] = useState<MaGiamGiaCuaUserResponeDTO | null>(null);

  const navigate = useNavigate();

  // Bắt lỗi nếu người dùng vào thẳng trang checkout mà không có dữ liệu sách (tránh crash web)
  if (!sach) {
    return (
      <div className="container mt-5 text-center">
        <h2>Không tìm thấy thông tin sản phẩm!</h2>
      </div>
    );
  }

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
    if (!maHinhThucGiaoHang) {
      alert("Vui lòng chọn hình thức giao hàng");
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
        items: [
          {
            maSach: sach.maSach,
            soLuong: soLuong,
          },
        ],
        maGiam: voucher?.maGiam ?? null,
        maDiaChiGiaoHang: maDiaChi,
        maHinhThucThanhToan: maHinhThucThanhToan,
        maHinhThucGiaoHang: maHinhThucGiaoHang,
      }),
    });

    alert("Đặt hàng thành công");
    navigate("/don-hang");
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container-custom">
        <div className="checkout-card-custom row g-0">
          {/* LEFT PANEL */}
          <div className="col-lg-4 checkout-left-panel">
            <div className="checkout-book-preview">
              <MotHinhAnhCuaSach maSach={sach.maSach} />
              <h4 className="checkout-book-title mt-3 mb-2">{sach.tenSach}</h4>
              <p className="checkout-book-price mb-1">
                Giá: {dinhDangSo(sach.giaBan)}
              </p>
              <p className="checkout-book-qty mb-0">Số lượng: x{soLuong}</p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="col-lg-8 checkout-right-panel">
            <h3 className="checkout-title">Xác nhận đơn hàng</h3>

            
            <div className="checkout-address-compact">
              <XemDiaChiGiaoHang
                maDiaChiDuocChon={maDiaChi}
                setMaDiaChi={setMaDiaChi}
              />
            </div>

            <div className="checkout-summary-card">
              <h5 className="mb-3">Tóm tắt thanh toán</h5>

              <p className="mb-2">
                Tổng gốc: <strong>{dinhDangSo(tongTien)}</strong>
              </p>

              {voucher && (
                <p className="checkout-discount mb-2">
                  Giảm: -{dinhDangSo(tienGiam)}
                </p>
              )}

              <p className="checkout-final-price mb-0">
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

            <button className="checkout-btn-order" onClick={handleDatHang}>
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;