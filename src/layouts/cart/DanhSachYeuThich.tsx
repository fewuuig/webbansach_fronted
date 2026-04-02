import React, { useEffect, useState } from "react";
import { laySachTrongDanhSachYeuThich } from "../../api/DanhSachYeuThichApi";
import { NavLink } from "react-router-dom";
import MotHinhAnhCuaSach from "../product/components/MotHinhAnhCuaSach";
import "./DanhSachYeuThich.css";

interface SachYeuThich {
    tenSach: string;
    maSach: number;
}

const DanhSachYeuThich: React.FC = () => {
    const [danhSachYeuThich, setDanhSachYeuThich] = useState<SachYeuThich[]>([]);
    const [trangThai, setTrangThai] = useState(true);

    useEffect(() => {
        laySachTrongDanhSachYeuThich()
            .then((data) => {
                setDanhSachYeuThich(data);
                setTrangThai(false);
            })
            .catch((error) => {
                console.error("Lỗi " + error);
                setTrangThai(false);
            });
    }, []);

    if (trangThai) {
        return <div className="loading">⏳ Đang tải danh sách yêu thích...</div>;
    }

    if (danhSachYeuThich.length === 0) {
        return <div className="empty">😢 Bạn chưa có sách yêu thích nào</div>;
    }

    return (
        <div className="container mt-4">
            <h4 className="title">Danh sách yêu thích ❤️</h4>

            <div className="row g-4">
                {danhSachYeuThich.map((sach) => (
                    <div className="col-md-6 col-lg-4" key={sach.maSach}>
                        <div className="card sach-card h-100">
                            <NavLink to={`/sach/${sach.maSach}`}>
                                <div className="img-wrapper">
                                    <MotHinhAnhCuaSach maSach={sach.maSach} />
                                </div>
                            </NavLink>

                            <div className="card-body">
                                <p className="sach-title">{sach.tenSach}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DanhSachYeuThich;