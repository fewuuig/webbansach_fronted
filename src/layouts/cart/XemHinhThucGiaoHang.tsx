import React, { useEffect, useState } from "react";
import { layDiaChiGiaoHangCuaNguoiDung } from "../../api/DiaChiGiaoHang";
import { NavLink } from "react-router-dom";
import { layTatCaHinhThucGiaoHang } from "../../api/HinhThucGiaoHang";
interface HinhThucGiaoHang{
      maHinhThucGiaoHang : number, 
      moTa : string , 
      tenHinhThucGiaoHang : string
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
        <div>
            {
                danhSachHienThi.map(giaoHang => (
                    <label key={giaoHang.maHinhThucGiaoHang}>
                        <input
                            type="radio"
                            name={`${giaoHang.maHinhThucGiaoHang}`}
                            checked={maHinhThucGiaoHang === giaoHang.maHinhThucGiaoHang}
                            onChange={() => setMaHinhThucGiaoHang(giaoHang.maHinhThucGiaoHang)}
                        />
                        <span className="ms-2">
                            <p>{giaoHang.tenHinhThucGiaoHang} ({giaoHang.moTa})</p>
                        </span>
                    </label>

                ))
            }
            {
                danhSachHinhThucGiaoHang.length > 1 && (
                    <button type="button" className="btn btn-link p-0" onClick={()=>setHienTatCa(!hientatCa)}>{hientatCa ? "Ẩm bớt" : "Xem thêm"}</button>
                )
            }
        </div>
    );
}
export default XemHinhThucGiaoHang; 