import React, { useEffect, useState } from "react";
import { layDiaChiGiaoHangCuaNguoiDung } from "../../api/DiaChiGiaoHang";
import { NavLink } from "react-router-dom";
import { layTatCaHinhThucGiaoHang } from "../../api/HinhThucGiaoHang";
import "./GiaoHang.css" ;
interface HinhThucGiaoHang {
    maHinhThucGiaoHang: number,
    moTa: string,
    tenHinhThucGiaoHang: string
}
interface Props {
    maHinhThucGiaoHang: (number | null),
    setMaHinhThucGiaoHang: any
}
const XemHinhThucGiaoHang: React.FC<Props> = ({ maHinhThucGiaoHang, setMaHinhThucGiaoHang }) => {
    const [danhSachHinhThucGiaoHang, setDanhSachHinhThucGiaoHang] = useState<HinhThucGiaoHang[]>([]);
    const [hientatCa, setHienTatCa] = useState(false);
    useEffect(() => {
        layTatCaHinhThucGiaoHang().then(
            data => {
                setDanhSachHinhThucGiaoHang(data);
            }
        ).catch(
            error => {
                console.error(error);
            }
        )
    }, [])
    const danhSachHienThi = hientatCa ? danhSachHinhThucGiaoHang : danhSachHinhThucGiaoHang.slice(0, 1); // chỉ hiện 1 cái 
    return (
        <div className="shipping-container">

            {danhSachHienThi.map(giaoHang => (
                <div
                    key={giaoHang.maHinhThucGiaoHang}
                    className={`shipping-item ${maHinhThucGiaoHang === giaoHang.maHinhThucGiaoHang ? "active" : ""
                        }`}
                    onClick={() => setMaHinhThucGiaoHang(giaoHang.maHinhThucGiaoHang)}
                >
                    <div className="shipping-header">
                        <input
                            type="radio"
                            checked={maHinhThucGiaoHang === giaoHang.maHinhThucGiaoHang}
                            readOnly
                        />

                        <div className="shipping-title">
                            <span className="name">{giaoHang.tenHinhThucGiaoHang}</span>
                            <span className="desc">{giaoHang.moTa}</span>
                        </div>
                    </div>

                    {/* xổ xuống khi chọn */}
                    {maHinhThucGiaoHang === giaoHang.maHinhThucGiaoHang && (
                        <div className="shipping-detail">
                            🚚 Giao hàng dự kiến trong 2-5 ngày <br />
                            💰 Phí ship sẽ được tính ở bước thanh toán
                        </div>
                    )}
                </div>
            ))}

            {danhSachHinhThucGiaoHang.length > 1 && (
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
export default XemHinhThucGiaoHang; 