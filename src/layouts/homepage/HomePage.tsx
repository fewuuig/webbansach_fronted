import React from "react";
import Bannerr from "./component/Bannerr";
import Carousell from "./component/Carousell";

import DanhSachSanPham from "../product/DanhSachSanPham";
import { useParams } from "react-router-dom";
interface HomePage {
    tuKhoaTimKiem: string;
    setTuKhoaTimKiem: any;
    filter: {
        giaMin: string;
        giaMax: string;
        theLoai: string;
        tacGia: string;
    };
}

const HomePage: React.FC<HomePage> = ({ tuKhoaTimKiem, setTuKhoaTimKiem ,filter}) => {
    const { maTheLoai } = useParams();
    let maTheLoaiNumber = 0;
    try {
        maTheLoaiNumber = parseInt(maTheLoai + ' ');
    } catch (error) {
        maTheLoaiNumber = 0;
        console.error(error);
    }

    if (Number.isNaN(maTheLoaiNumber)) {
        maTheLoaiNumber = 0;
    }
    return (
        <div>
            <Bannerr />
            <Carousell />
            <DanhSachSanPham tuKhoaTimKiem={tuKhoaTimKiem} maTheLoaiNumber={maTheLoaiNumber} setTuKhoaTimKiem={setTuKhoaTimKiem} filter ={filter}/>
        </div>
    );
}
export default HomePage; 