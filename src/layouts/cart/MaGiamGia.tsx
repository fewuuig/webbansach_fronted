import React, { useEffect, useState } from "react";
import { layVoucherCuaUser } from "../../api/MaGiamGia";
import "./MaGiamGia.css";

export interface MaGiamGiaCuaUserResponeDTO {
    maGiamNguoiDung: number;
    maGiam: number;
    daDung: number;
    tenMaGiamGia: string;
    soMaDaDung: number;
    soLuong: number;
    ngayHetHan: string;
    ngayBatDau: string;
    loaiMaGiamGia: string; // "PERCENT" | "FIXED"
    giamToiDa: number;
    donGiaTu: number;
    trangThaiMaGiamGia: string;
    doiTuongApDungMa: string;
}

interface Props {
    setVoucher: (voucher: MaGiamGiaCuaUserResponeDTO | null) => void;
}

const VoucherUser: React.FC<Props> = ({ setVoucher }) => {

    const [dsVoucher, setDsVoucher] = useState<MaGiamGiaCuaUserResponeDTO[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<MaGiamGiaCuaUserResponeDTO | null>(null);

    useEffect(() => {
        layVoucherCuaUser()
            .then(res => {
                setDsVoucher(res.maGiamGiaCuaUserResponeDTOS);
                setVoucher(null); // mặc định không chọn
            })
            .catch(err => console.error(err));
    }, []);

    const handleSelect = (v: MaGiamGiaCuaUserResponeDTO) => {
        if (v.daDung) return;

        const isSame = selectedVoucher?.maGiam === v.maGiam;
        const newValue = isSame ? null : v;

        setSelectedVoucher(newValue);
        setVoucher(newValue);
    };

    return (
        <div className="voucher-container">

            {/* HEADER */}
            <div
                className="voucher-header"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3>Mã giảm giá</h3>

                <span>
                    {
                        selectedVoucher
                            ? `Đã chọn: ${selectedVoucher.tenMaGiamGia}`
                            : "Chọn voucher"
                    }
                </span>

                <span>{isOpen ? "▲" : "▼"}</span>
            </div>

            {/* BODY */}
            {
                isOpen && (
                    <div className="voucher-body">
                        {
                            dsVoucher.length === 0
                                ? <p>Không có mã giảm giá</p>
                                : dsVoucher.map(v => {

                                    const isSelected =
                                        selectedVoucher?.maGiam === v.maGiam;

                                    return (
                                        <div
                                            key={v.maGiam}
                                            className={`
                                                voucher-card 
                                                ${isSelected ? "selected" : ""} 
                                                ${v.daDung ? "disabled" : ""}
                                            `}
                                            onClick={() => handleSelect(v)}
                                        >
                                            <h4>{v.tenMaGiamGia}</h4>

                                            <p>Giảm tối đa: <b>{v.giamToiDa}</b></p>
                                            <p>Đơn tối thiểu: {v.donGiaTu}</p>
                                            <p>Đã dùng: {v.soMaDaDung} / {v.soLuong}</p>

                                            <p>
                                                HSD: {new Date(v.ngayHetHan).toLocaleDateString()}
                                            </p>

                                            <span className={v.daDung ? "used" : "available"}>
                                                {v.daDung ? "Đã dùng" : "Chưa dùng"}
                                            </span>
                                        </div>
                                    );
                                })
                        }
                    </div>
                )
            }
        </div>
    );
};

export default VoucherUser;
