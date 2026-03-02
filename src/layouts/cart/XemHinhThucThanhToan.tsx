import React, { useEffect, useState } from "react";
import { layDiaChiGiaoHangCuaNguoiDung } from "../../api/DiaChiGiaoHang";
import { NavLink } from "react-router-dom";
import { layTatCaHinhThucThanhToan } from "../../api/HinhThucThanhToanApi";
interface HinhThucThanhToan {
    maHinhThucThanhToan : number , 
    moTa : string , 
    tenHinhThucThanhToan : string 
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
    const danhSachHienThi =hientatCa? danhSachHinhThucThanhToan : danhSachHinhThucThanhToan.slice(0,1) ; 
    return (
        <div>
            {
                danhSachHienThi.map(thanhToan => (
                    <label key={thanhToan.maHinhThucThanhToan}>
                        <input
                            type="radio"
                            name="thanhToan"
                            checked={maHinhThucThanhToan === thanhToan.maHinhThucThanhToan}
                            onChange={() => setMaHinhThucThanhToan(thanhToan.maHinhThucThanhToan)}
                        />
                        <span className="ms-2">
                            {thanhToan.tenHinhThucThanhToan} ({thanhToan.moTa} )
                        </span>
                        <br></br>
                    </label>
                    

                ))
            }
           
            {
                danhSachHinhThucThanhToan.length > 1 && (
                    <button type="button" className="btn btn-link p-0" onClick={()=>setHienTatCa(!hientatCa)}>{hientatCa ? "Ẩn bớt" : "Xem thêm"}</button>
                )
            }
        </div>
    );
}
export default XemHinhThucThanhToan; 