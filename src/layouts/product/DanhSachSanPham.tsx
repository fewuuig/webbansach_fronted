import React, { useEffect, useState } from "react";

import BookModel from "../../model/BookModel";
import SachProps from "./components/SachProps";
import {
    layBookFilter,
    layToanBoSach,
    timKiemSachTheoTen
} from "../../api/BookApi";
import { PhanTrang } from "../utils/PhanTrang";

interface DanhSachSanPhamProps {
    tuKhoaTimKiem: string;
    maTheLoaiNumber: number;
    setTuKhoaTimKiem: any;
    filter: {
        giaMin: string;
        giaMax: string;
        theLoai: string;
        tacGia: string;
    };
}

const DanhSachSanPham: React.FC<DanhSachSanPhamProps> = ({
    tuKhoaTimKiem,
    maTheLoaiNumber,
    setTuKhoaTimKiem,
    filter
}) => {
    const [danhSachQuyenSach, setDanhSachQuyenSach] = useState<BookModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState<boolean>(true);
    const [baoLoi, setBaoLoi] = useState<any>(null);
    const [trangHienTai, setTrangHienTai] = useState<number>(1);
    const [tongSoTrang, setTongSoTrang] = useState<number>(0);

    useEffect(() => {
        setTrangHienTai(1);
    }, [tuKhoaTimKiem, maTheLoaiNumber, filter]);

    useEffect(() => {
        setTuKhoaTimKiem("");
    }, [maTheLoaiNumber]);


    useEffect(() => {
        setDangTaiDuLieu(true);
        setBaoLoi(null);

        const isFiltering =
            filter.giaMin ||
            filter.giaMax ||
            filter.theLoai ||
            filter.tacGia;


        if (isFiltering) {
            layBookFilter(
                filter.giaMin,
                filter.giaMax,
                filter.theLoai,
                filter.tacGia,
                trangHienTai - 1,
                8
            )
                .then((data) => {
                    setDanhSachQuyenSach(data.ketQua);
                    setTongSoTrang(data.tongTrang);
                    setDangTaiDuLieu(false);
                })
                .catch((error) => {
                    setBaoLoi(error.message);
                    setDangTaiDuLieu(false);
                });
        }

        else if (tuKhoaTimKiem !== "" || maTheLoaiNumber !== 0) {
            timKiemSachTheoTen(
                tuKhoaTimKiem,
                trangHienTai - 1,
                maTheLoaiNumber
            )
                .then((data) => {
                    setDanhSachQuyenSach(data.ketQua);
                    setTongSoTrang(data.tongTrang);
                    setDangTaiDuLieu(false);
                })
                .catch((error) => {
                    setBaoLoi(error.message);
                    setDangTaiDuLieu(false);
                });
        }

        else {
            layToanBoSach(trangHienTai - 1)
                .then((data) => {
                    setDanhSachQuyenSach(data.ketQua);
                    setTongSoTrang(data.tongTrang);
                    setDangTaiDuLieu(false);
                })
                .catch((error) => {
                    setBaoLoi(error.message);
                    setDangTaiDuLieu(false);
                });
        }
    }, [trangHienTai, tuKhoaTimKiem, maTheLoaiNumber, filter]);


    const phanTrang = (trang: number) => {
        setTrangHienTai(trang);
    };

    
    if (dangTaiDuLieu) {
        return (
            <div>
                <h1>Đang tải dữ liệu...</h1>
            </div>
        );
    }

    if (baoLoi) {
        return (
            <div>
                <h1>{baoLoi}</h1>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row mt-4">
                {danhSachQuyenSach.map((sach) => (
                    <SachProps sach={sach} key={sach.maSach} />
                ))}
            </div>

            <PhanTrang
                phanTrang={phanTrang}
                trangHienTai={trangHienTai}
                tongSoTrang={tongSoTrang}
            />
        </div>
    );
};

export default DanhSachSanPham;