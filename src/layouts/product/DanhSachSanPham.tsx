import React, { useEffect, useState } from "react";

import BookModel from "../../model/BookModel";
import SachProps from "./components/SachProps";
import { layToanBoSach, timKiemSachTheoTen } from "../../api/BookApi";
import { PhanTrang } from "../utils/PhanTrang";

interface DanhSachSanPham {
    tuKhoaTimKiem: string;
    maTheLoaiNumber: number;
    setTuKhoaTimKiem:any ; 
}
const DanhSachSanPham: React.FC<DanhSachSanPham> = ({ tuKhoaTimKiem, maTheLoaiNumber ,setTuKhoaTimKiem}) => {
    const [danhSachQuyenSach, setDanhSachQuyenSach] = useState<BookModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState<Boolean>(true);
    const [baoLoi, setBaoLoi] = useState(null);
    const [trangHienTai, setTrangHienTai] = useState<number>(1);
    const [tongSoTrang, setTongSoTrang] = useState<number>(0);
   
    useEffect(() => {
        setTrangHienTai(1);
    }, [tuKhoaTimKiem, maTheLoaiNumber]
    )
    useEffect(()=>{
       setTuKhoaTimKiem("") ; 
    },[maTheLoaiNumber])
    useEffect(() => {
        setDangTaiDuLieu(true);
        if (tuKhoaTimKiem === '' && maTheLoaiNumber == 0) {
            layToanBoSach(trangHienTai - 1).then(
                sachData => {
                    setDanhSachQuyenSach(sachData.ketQua);
                    setDangTaiDuLieu(false);
                    setTongSoTrang(sachData.tongTrang);
                }
            ).catch(
                error => {
                    setBaoLoi(error.message);
                }
            );
        } else {

            timKiemSachTheoTen(tuKhoaTimKiem, trangHienTai - 1, maTheLoaiNumber).then(
                sachData => {
                    setDanhSachQuyenSach(sachData.ketQua);
                    setDangTaiDuLieu(false);
                    setTongSoTrang(sachData.tongTrang);
                }
            ).catch(
                error => {
                    setBaoLoi(error.message);
                }
            )
        }
    }, [trangHienTai, tuKhoaTimKiem, maTheLoaiNumber]
    )

    const phanTrang = (trang: number) => {
        setTrangHienTai(trang);
    }
    

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


        <div className="container">
            <div className="row mt-4">
                {

                    danhSachQuyenSach.map((sach) => (
                        <SachProps sach={sach} key={sach.maSach} />
                    )
                    )
                }
                <PhanTrang phanTrang={phanTrang} trangHienTai={trangHienTai} tongSoTrang={tongSoTrang} />
            </div>

        </div>
    );
}
export default DanhSachSanPham; 