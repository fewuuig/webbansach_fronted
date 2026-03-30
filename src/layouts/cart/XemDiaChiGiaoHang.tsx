import React, { useEffect, useState } from "react";
import { layDiaChiGiaoHangCuaNguoiDung } from "../../api/DiaChiGiaoHang";
import { NavLink } from "react-router-dom";
import "./DiaChiGiaoHang.css" ;
interface diaChiGiaoHang {
    maDiaChi: number,
    tinhOrCity: string,
    quanOrHuyen: string,
    phuongOrXa: string,
    soNha: string
}
interface Props {
    maDiaChiDuocChon: (number | null),
    setMaDiaChi: any
}
const XemDiaChiGiaoHang: React.FC<Props> = ({ maDiaChiDuocChon, setMaDiaChi }) => {
    const [danhSachDiaChiGiaoHang, setDanhSachDiaChiGiaoHang] = useState<diaChiGiaoHang[]>([]);
    const [hientatCa, setHienTatCa] = useState(false);
    useEffect(() => {
        layDiaChiGiaoHangCuaNguoiDung().then(
            data => {
                setDanhSachDiaChiGiaoHang(data);
            }
        ).catch(
            error => {
                console.error(error);
            }
        )
    }, [])
    const danhSachHienThi = hientatCa ? danhSachDiaChiGiaoHang : danhSachDiaChiGiaoHang.slice(0, 1); // chỉ hiện 1 cái 
    return (
        <div className="address-container">

            {danhSachHienThi.map(diaChi => (
                <div
                    key={diaChi.maDiaChi}
                    className={`address-item ${maDiaChiDuocChon === diaChi.maDiaChi ? "active" : ""
                        }`}
                    onClick={() => setMaDiaChi(diaChi.maDiaChi)}
                >
                    <div className="address-header">
                        <input
                            type="radio"
                            checked={maDiaChiDuocChon === diaChi.maDiaChi}
                            readOnly
                        />

                        <div className="address-text">
                            <span className="main">
                                {diaChi.soNha}, {diaChi.phuongOrXa}
                            </span>
                            <span className="sub">
                                {diaChi.quanOrHuyen}, {diaChi.tinhOrCity}
                            </span>
                        </div>
                    </div>

                    {/* xổ xuống khi chọn */}
                    {maDiaChiDuocChon === diaChi.maDiaChi && (
                        <div className="address-detail">
                            📦 Địa chỉ mặc định giao hàng <br />
                            🚚 Có thể nhận hàng trong giờ hành chính
                        </div>
                    )}
                </div>
            ))}

            {/* toggle */}
            {danhSachDiaChiGiaoHang.length > 1 && (
                <button
                    className="btn-toggle"
                    onClick={() => setHienTatCa(!hientatCa)}
                >
                    {hientatCa ? "Ẩn bớt ▲" : "Xem thêm ▼"}
                </button>
            )}

            {/* thêm địa chỉ */}
            {hientatCa && (
                <NavLink to="/them-dia-chi-giao-hang" className="add-address">
                    + Thêm địa chỉ giao hàng
                </NavLink>
            )}
        </div>
    );
}
export default XemDiaChiGiaoHang; 