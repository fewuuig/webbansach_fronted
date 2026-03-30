import React, { useEffect, useState } from "react";
import BookModel from "../../../model/BookModel";
import HinhAnhModel from "../../../model/HinhAnhModel";
import { layAnhDauTienCuaMotQuyenSach } from "../../../api/HinhAnhApi";
import { error } from "console";
import "./CarousellItem.css";
import { NavLink } from "react-router-dom";
interface CarousellItem {
    sach: BookModel;
}

const CarousellItem: React.FC<CarousellItem> = (props) => {
    const [danhSachHinhAnh, setDanhSachHinhAnh] = useState<HinhAnhModel[] | null>([]);
    const [baoLoi, setBaoLoi] = useState(null);
    const [layDuLieu, setLayDuLieu] = useState(true);

    useEffect(() => {
        layAnhDauTienCuaMotQuyenSach(props.sach.maSach).then(
            anhData => {
                setDanhSachHinhAnh(anhData);
                setLayDuLieu(false);
            }
        ).catch(
            error => {
                setBaoLoi(error.message);
                setLayDuLieu(true);
            }
        )

    }, []
    )
    if (layDuLieu) {
        return (
            <div><h1>dang lay du lieu</h1></div>
        );
    }
    if (baoLoi) {
        return (
            <div><h1>gap loi</h1></div>
        );
    }
    return (
        <div className="carousel-item-custom">
            <div className="row align-items-center">

                {/* IMAGE */}
                <NavLink to={`/sach/${props.sach.maSach}`} className="col-md-5 image-wrapper">
                    {danhSachHinhAnh && danhSachHinhAnh.length > 0 && (
                        <img
                            src={danhSachHinhAnh[0].duLieuAnh}
                            className="carousel-img"
                        />
                    )}
                </NavLink>

                {/* INFO */}
                <div className="col-md-7 info-wrapper">

                    <h4 className="book-title">{props.sach.tenSach}</h4>

                    <p className="book-author">
                        ✍️ {props.sach.tenTacGia}
                    </p>

                    {/* rating */}
                    <div className="book-rating">
                        ⭐ {props.sach.trungBinhXepHang || 0}
                    </div>

                    {/* price */}
                    <div className="book-price">
                        <span className="gia-ban">
                            {props.sach.giaBan?.toLocaleString()} đ
                        </span>
                        <span className="gia-niem-yet">
                            {props.sach.giaNiemYet?.toLocaleString()} đ
                        </span>

                        {/* badge giảm giá */}
                        {props.sach.giaBan && props.sach.giaNiemYet && (
                            <span className="discount-badge">
                                -{Math.round(
                                    100 - (props.sach.giaBan / props.sach.giaNiemYet) * 100
                                )}%
                            </span>
                        )}
                    </div>

                    {/* description */}
                    <p className="book-desc">
                        {props.sach.moTa}
                    </p>

                    

                </div>
            </div>
        </div>
    );
}
export default CarousellItem; 