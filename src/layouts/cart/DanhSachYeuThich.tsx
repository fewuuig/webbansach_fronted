import React, { useEffect, useState } from "react";
import { laySachTrongDanhSachYeuThich } from "../../api/DanhSachYeuThichApi";
import { error } from "console";
import { NavLink } from "react-router-dom";
import MotHinhAnhCuaSach from "../product/components/MotHinhAnhCuaSach";
interface SachYeuThich {
    tenSach: string,
    maSach: number
}
const DanhSachYeuThich: React.FC = () => {
    const [danhSachYeuThich, setDanhSachYeuThich] = useState<SachYeuThich[]>([]);
    const [trangThai, setTrangThai] = useState(true);
    useEffect(() => {
        laySachTrongDanhSachYeuThich().then(
            data => {
                setDanhSachYeuThich(data);
                setTrangThai(false);
            }
        ).catch(error => {
            console.error("Lỗi " + error);
        })
    }, [])
    if (trangThai) {
        return (
            <div>đang tải dữ liệu</div>
        )
    }
    return (
        <div className="container">
            <div className="row">
                {danhSachYeuThich.map(sach => (
                    <div>
                        <div className="col-1">

                        </div>

                        <div className="col-4">
                            <NavLink to={`/sach/${sach.maSach}`}>
                                <MotHinhAnhCuaSach maSach={sach.maSach} />
                            </NavLink>
                        </div>

                        <div className="col-7">
                            <p>{sach.tenSach}</p>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
}
export default DanhSachYeuThich; 