import React, { useEffect, useState } from "react";
import { layDiaChiGiaoHangCuaNguoiDung } from "../../api/DiaChiGiaoHang";
import { NavLink } from "react-router-dom";
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
        <div>
            {
                danhSachHienThi.map(diaChi => (
                    <label>
                        <input
                            type="radio"
                            name="diaChi"
                            checked={maDiaChiDuocChon === diaChi.maDiaChi}
                            onChange={() => setMaDiaChi(diaChi.maDiaChi)}
                        />
                        <span className="ms-2">
                            {diaChi.soNha}, {diaChi.phuongOrXa}, {diaChi.quanOrHuyen}, {diaChi.tinhOrCity}
                        </span>
                    </label>

                ))
            }
            {
                danhSachDiaChiGiaoHang.length > 1 && (
                    <button type="button" className="btn btn-link p-0" onClick={()=>setHienTatCa(!hientatCa)}>{hientatCa ? "Ẩm bớt" : "Xem thêm"}</button>
                )
            }
            {hientatCa &&  <NavLink to='/them-dia-chi-giao-hang'>+ địa chỉ giao hàng</NavLink>}
        </div>
    );
}
export default XemDiaChiGiaoHang; 