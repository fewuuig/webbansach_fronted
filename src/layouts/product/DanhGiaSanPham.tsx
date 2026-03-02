import React, { useEffect, useState } from "react";
import DanhGiaModel from "../../model/DanhGiaModel";
import { layToanBoDanhGiaCuaMotQuyenSach } from "../../api/DanhGiaApi";
import { error } from "console";
import starRating from "../utils/Rating";
interface DanhGiaSanPham{
    maSach : number , 
    reloadDanhGia : boolean , 
    setReloadDanhGia : any
}
const DanhGiaSanPham: React.FC<DanhGiaSanPham> = ({maSach ,reloadDanhGia }) => {


    const [danhSacDangGia, setDanhSachDanhGia] = useState<DanhGiaModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState<Boolean>(true);
    const [baoLoi, setBaoLoi] = useState(null);
    useEffect(()=>{
        layToanBoDanhGiaCuaMotQuyenSach(maSach).then(
            danhGiaData =>{
                setDanhSachDanhGia(danhGiaData) ; 
                setDangTaiDuLieu(false) ; 
            }
        ).catch(
            error=>{
                setBaoLoi(error.message) ; 

            }
        )
    },[reloadDanhGia])
    if (dangTaiDuLieu) {
        return (
            <div>
                <h1>Đang tải dữ liệu</h1>
            </div>
        );
    }

    if (baoLoi) {
        return (
            <div>
                <h1>gặp lỗi: {baoLoi}</h1>
            </div>
        );
    }

return (
    <div className="container mt-4">
        {
            danhSacDangGia.map((danhGia) => (
                <div
                    key={danhGia.maDanhGia}
                    className="d-flex align-items-start mb-4"
                >
                    {/* AVATAR */}
                    <div className="me-3">
                        <img
                            src={danhGia.anhDaiDien}
                            alt="avatar"
                            className="rounded-circle border"
                            style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover"
                            }}
                        />
                    </div>

                    {/* NỘI DUNG ĐÁNH GIÁ */}
                    <div className="text-start">
                        <div className="mb-1 text-warning">
                            {starRating(danhGia.diemXepHang ?? 0)}
                        </div>

                        <p className="mb-0">
                            {danhGia.nhanXet}
                        </p>
                    </div>
                </div>
            ))
        }
    </div>
);


}
export default DanhGiaSanPham; 