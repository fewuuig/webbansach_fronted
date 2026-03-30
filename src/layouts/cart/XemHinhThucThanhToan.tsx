import React, { useEffect, useState } from "react";
import { layDiaChiGiaoHangCuaNguoiDung } from "../../api/DiaChiGiaoHang";
import { NavLink } from "react-router-dom";
import { layTatCaHinhThucThanhToan } from "../../api/HinhThucThanhToanApi";
import "./ThanhToan.css";
interface HinhThucThanhToan {
    maHinhThucThanhToan: number,
    moTa: string,
    tenHinhThucThanhToan: string
}
interface Props {
    maHinhThucThanhToan: (number | null),
    setMaHinhThucThanhToan: any,
}
const XemHinhThucThanhToan: React.FC<Props> = ({ maHinhThucThanhToan, setMaHinhThucThanhToan }) => {
    const [danhSachHinhThucThanhToan, setDanhSachHinhThucThanhToan] = useState<HinhThucThanhToan[]>([]);
    const [hientatCa, setHienTatCa] = useState(false);
    useEffect(() => {
        layTatCaHinhThucThanhToan().then(
            data => {
                setDanhSachHinhThucThanhToan(data);
            }
        ).catch(
            error => {
                console.error(error);
            }
        )
    }, [])
    console.log(danhSachHinhThucThanhToan);
    const danhSachHienThi = hientatCa ? danhSachHinhThucThanhToan : danhSachHinhThucThanhToan.slice(0, 1);
    return (
        <div className="payment-container">

            {danhSachHienThi.map(thanhToan => (
                <div
                    key={thanhToan.maHinhThucThanhToan}
                    className={`payment-item ${maHinhThucThanhToan === thanhToan.maHinhThucThanhToan ? "active" : ""
                        }`}
                    onClick={() =>
                        setMaHinhThucThanhToan(thanhToan.maHinhThucThanhToan)
                    }
                >
                    <div className="payment-header">
                        <input
                            type="radio"
                            checked={
                                maHinhThucThanhToan === thanhToan.maHinhThucThanhToan
                            }
                            readOnly
                        />

                        <div className="payment-title">
                            <span className="name">
                                {thanhToan.tenHinhThucThanhToan}
                            </span>
                            <span className="desc">
                                {thanhToan.moTa}
                            </span>
                        </div>
                    </div>

                    {/* xổ xuống khi chọn */}
                    {maHinhThucThanhToan === thanhToan.maHinhThucThanhToan && (
                        <div className="payment-detail">
                            💳 Thanh toán an toàn & bảo mật <br />
                            🔒 Hỗ trợ nhiều phương thức tiện lợi
                        </div>
                    )}
                </div>
            ))}

            {danhSachHinhThucThanhToan.length > 1 && (
                <button
                    className="btn-toggle"
                    onClick={() => setHienTatCa(!hientatCa)}
                >
                    {hientatCa ? "Ẩn bớt ▲" : "Xem thêm ▼"}
                </button>
            )}
        </div>
    );
}
export default XemHinhThucThanhToan; 