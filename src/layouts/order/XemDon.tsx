import React, { useEffect, useState } from "react";
import { layDonHangTheoTrangThai } from "../../api/TrangThaiDonHang";
import MotHinhAnhCuaSach from "../product/components/MotHinhAnhCuaSach";
import dinhDangSo from "../utils/DinhDangSo";
import "./XemDon.css";
import { jwtDecode } from "jwt-decode";

interface SachTrongDonDTOS {
    maSach: number;
    soLuong: number;
    giaBan: number;
    tongGia: number;
    tenSach: string;
}

interface donHang {
    soDienThoai: string;
    hoTen: string;
    tongGia: number; // ✅ đã bao gồm ship
    maDonHang: number;
    chiPhiGiaoHang: number;
    diaChiNhanHang: string;
    trangThai: string;
    sachTrongDonDTOS: SachTrongDonDTOS[];
}

interface props {
    trangThai: string;
}

interface Jwtpayload {
    isAdmin: boolean;
    isStaff: boolean;
    isUser: boolean;
}

const XemDon: React.FC<props> = ({ trangThai }) => {

    const [danhSachDonHang, setDanhSachDonHang] = useState<donHang[]>([]);
    const [reload, setReload] = useState<boolean>(false);

    const trangThaiDonChoXacNhan = "CHO_XAC_NHAN";
    const trangThaiDonDaHuy = "DA_HUY";

    // ================== LOAD ==================
    useEffect(() => {
        layDonHangTheoTrangThai(trangThai)
            .then(data => setDanhSachDonHang(data))
            .catch(error => console.error(error));
    }, [trangThai, reload]);

    // ================== ROLE ==================
    const accessToken = localStorage.getItem("accessToken");

    let isAdmin = false;
    let isStaff = false;

    if (accessToken) {
        const role = jwtDecode(accessToken) as Jwtpayload;
        if (role.isAdmin || role.isStaff) {
            isAdmin = true;
            isStaff = true;
        }
    }

    // ================== ACTION ==================
    const callApi = async (url: string, message: string) => {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.ok) {
            setReload(!reload);
            alert(message);
        }
    };

    const handleHuyDon = (maDonHang: number) => {
        callApi(`http://localhost:8080/don-hang/${maDonHang}/huy-don`, "Hủy đơn hàng thành công");
    };

    const handleDatLai = (maDonHang: number) => {
        callApi(`http://localhost:8080/don-hang/${maDonHang}/dat-lai`, "Đặt lại thành công");
    };

    const handleGiaoHang = (maDonHang: number) => {
        callApi(`http://localhost:8080/don-hang/${maDonHang}/trang-thai?trangThai=DANG_GIAO`, "Đang giao hàng");
    };

    const handleDaGiao = (maDonHang: number) => {
        callApi(`http://localhost:8080/don-hang/${maDonHang}/trang-thai?trangThai=DA_GIAO`, "Đã hoàn thành đơn");
    };

    // ================== UI ==================
    return (
        <div className="container mt-4">
            {danhSachDonHang.map(donHang => {

                // ✅ tính đúng (number)
                const tienHang = donHang.tongGia - donHang.chiPhiGiaoHang;
                const tongThanhToan = donHang.tongGia;

                return (
                    <div className="card order-card mb-4" key={donHang.maDonHang}>

                        {/* HEADER */}
                        <div className="card-header d-flex justify-content-between align-items-center bg-white border-0 pb-2">
                            <div>
                                <span className="text-muted small">Mã đơn</span><br />
                                <strong>{donHang.maDonHang}</strong>
                            </div>

                            <span className="badge status-badge">
                                {donHang.trangThai}
                            </span>
                        </div>

                        {/* BODY */}
                        <div className="card-body pt-2">

                            {donHang.sachTrongDonDTOS.map(sach => (
                                <div className="row align-items-center product-row" key={sach.maSach}>

                                    <div className="col-2 text-center">
                                        <div className="img-box">
                                            <MotHinhAnhCuaSach maSach={sach.maSach} />
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <p className="book-name">{sach.tenSach}</p>
                                        <p className="book-qty">x{sach.soLuong}</p>
                                    </div>

                                    <div className="col-4 text-end">
                                        <p>{dinhDangSo(sach.giaBan)} đ</p>
                                        <p>{dinhDangSo(sach.tongGia)} đ</p>
                                    </div>

                                </div>
                            ))}

                            {/* FOOTER */}
                            <div className="row mt-3 align-items-center">

                                {/* ADDRESS */}
                                <div className="col-7">
                                    <div className="address-box">
                                        <div>{donHang.hoTen}</div>
                                        <div>{donHang.soDienThoai}</div>
                                        <div>{donHang.diaChiNhanHang}</div>
                                    </div>
                                </div>

                                {/* PRICE */}
                                <div className="col-5 text-end">

                                    <div className="price-box">

                                        <div className="sub-price">
                                            Phí ship: {dinhDangSo(donHang.chiPhiGiaoHang)} đ
                                        </div>

                                        <div className="sub-price">
                                            Tiền hàng: {dinhDangSo(tienHang)} đ
                                        </div>

                                        <div className="total-price">
                                            Tổng: {dinhDangSo(tongThanhToan)} đ
                                        </div>

                                    </div>

                                    {/* BUTTON */}
                                    <div className="mt-3 d-flex justify-content-end gap-2">

                                        {trangThaiDonChoXacNhan === donHang.trangThai && (
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => handleHuyDon(donHang.maDonHang)}
                                            >
                                                Hủy đơn
                                            </button>
                                        )}

                                        {(isAdmin || isStaff) && donHang.trangThai === "DA_XAC_NHAN" && (
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => handleGiaoHang(donHang.maDonHang)}
                                            >
                                                Giao hàng
                                            </button>
                                        )}

                                        {(isAdmin || isStaff) && donHang.trangThai === "DANG_GIAO" && (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleDaGiao(donHang.maDonHang)}
                                            >
                                                Đã giao
                                            </button>
                                        )}

                                        {trangThaiDonDaHuy === donHang.trangThai && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleDatLai(donHang.maDonHang)}
                                            >
                                                Đặt lại
                                            </button>
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default XemDon;