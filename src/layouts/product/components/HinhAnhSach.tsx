import React, { useEffect, useState } from "react";
import HinhAnhModel from "../../../model/HinhAnhModel";
import { layToanBoAnh } from "../../../api/HinhAnhApi";
import { error } from "console";
import { NavLink } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css'
interface HinhAnhSach {
    maSach: number;
}
const HinhAnhSach: React.FC<HinhAnhSach> = ({ maSach }) => {

    const [danhSachHinhAnh, setDanhSachHinhAnh] = useState<HinhAnhModel[]>([]);
    const [layDuLieu, setLayDuLieu] = useState<boolean>(true);
    const [baoLoi, setBaoLoi] = useState(null);
    useEffect(() => {

        layToanBoAnh(maSach).then(
            anhData => {
                setDanhSachHinhAnh(anhData);
                setLayDuLieu(false);
            }

        ).catch(
            (error) => {
                setBaoLoi(error.message);
                setLayDuLieu(false);
            }
        )

    }, []
    )

    return (
        <div className="row">
            <div className="col-12">
                <Carousel showArrows={true} showThumbs={true}>
                    {
                       danhSachHinhAnh&& danhSachHinhAnh.map((hinhAnh)=>(
                            <div key={hinhAnh.maHinhAnh}>
                                <img title={`${hinhAnh.tenHinhAnh}`} src={hinhAnh.duLieuAnh} style={{maxWidth:'250px'}}/>
                            </div>
                        )
                        )
                    }
                </Carousel>
            </div>
        </div>
    );

}
export default HinhAnhSach;