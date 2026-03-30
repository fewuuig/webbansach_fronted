import React, { useState } from "react";
import "./ThemMaGiamGia.css";

const ThemMaGiamGia: React.FC = () => {

    const [form, setForm] = useState({
        tenMaGiamGia: "",
        ngayBatDau: "",
        ngayHetHan: "",
        soLuong: 0,
        soMaDaDung: 0,
        giamToiDa: 0,
        donGiaTu: 0,
        doiTuongApDungMa: "NGUOI_DUNG",
        phanTramGiam: "",
        tienGiam: "",
        trangThaiMaGiamGia: "DANG_HOAT_DONG",
        gioiHanSoLuongDungUser: 1,
        loaiMaGiamGia: ""
    });

    // ================= HANDLE CHANGE =================
    const handleChange = (e: any) => {
        const { name, value } = e.target;

        // đổi loại mã → reset field
        if (name === "loaiMaGiamGia") {
            setForm({
                ...form,
                loaiMaGiamGia: value,
                phanTramGiam: "",
                tienGiam: ""
            });
            return;
        }

        // xử lý số
        if (
            name.includes("so") ||
            name.includes("gia") ||
            name.includes("gioiHan")
        ) {
            const numberValue = Number(value);

            // ❌ chặn âm
            if (numberValue < 0) return;

            // ❌ chặn % > 100
            if (name === "phanTramGiam" && numberValue > 100) return;

            setForm({
                ...form,
                [name]: numberValue
            });
            return;
        }

        // text
        setForm({
            ...form,
            [name]: value
        });
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const accessToken = localStorage.getItem("accessToken");

        let payload: any = { ...form };

        // xử lý loại mã
        if (payload.loaiMaGiamGia === "PHAN_TRAM") {
            payload.tienGiam = "";
        } else if (payload.loaiMaGiamGia === "TIEN") {
            payload.phanTramGiam = "";
        }

        try {
            const response = await fetch("http://localhost:8080/vouchers/add-voucher", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const err = await response.text();
                alert("Lỗi: " + err);
                return;
            }

            alert("Thêm mã giảm giá thành công!");
        } catch (error) {
            console.error(error);
            alert("Lỗi hệ thống");
        }
    };

    return (
        <div className="voucher-form">
            <h3>Thêm mã giảm giá</h3>

            <form onSubmit={handleSubmit}>

                <input
                    name="tenMaGiamGia"
                    placeholder="Tên mã"
                    onChange={handleChange}
                    className="form-control mb-2"
                />

                <label>Ngày bắt đầu</label>
                <input
                    type="datetime-local"
                    name="ngayBatDau"
                    onChange={handleChange}
                    className="form-control mb-2"
                />

                <label>Ngày hết hạn</label>
                <input
                    type="datetime-local"
                    name="ngayHetHan"
                    onChange={handleChange}
                    className="form-control mb-2"
                />

                <input
                    type="number"
                    name="soLuong"
                    min="0"
                    placeholder="Số lượng"
                    onChange={handleChange}
                    className="form-control mb-2"
                />

                <input
                    type="number"
                    name="giamToiDa"
                    min="0"
                    placeholder="Giảm tối đa"
                    onChange={handleChange}
                    className="form-control mb-2"
                />

                <input
                    type="number"
                    name="donGiaTu"
                    min="0"
                    placeholder="Đơn tối thiểu"
                    onChange={handleChange}
                    className="form-control mb-2"
                />

                {/* LOẠI MÃ */}
                <select
                    name="loaiMaGiamGia"
                    value={form.loaiMaGiamGia}
                    onChange={handleChange}
                    className="form-select mb-2"
                >
                    <option value="">-- Chọn loại mã --</option>
                    <option value="TIEN">Giảm theo tiền</option>
                    <option value="PHAN_TRAM">Giảm theo %</option>
                </select>

                {/* % */}
                <input
                    name="phanTramGiam"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="% giảm"
                    onChange={handleChange}
                    disabled={form.loaiMaGiamGia === "TIEN"}
                    className="form-control mb-2"
                />

                {/* tiền */}
                <input
                    name="tienGiam"
                    type="number"
                    min="0"
                    placeholder="Tiền giảm"
                    onChange={handleChange}
                    disabled={form.loaiMaGiamGia === "PHAN_TRAM"}
                    className="form-control mb-2"
                />

                <input
                    name="gioiHanSoLuongDungUser"
                    type="number"
                    min="0"
                    placeholder="Giới hạn/user"
                    onChange={handleChange}
                    className="form-control mb-2"
                />

                <select
                    name="doiTuongApDungMa"
                    onChange={handleChange}
                    className="form-select mb-2"
                >
                    <option value="NGUOI_DUNG">Người dùng</option>
                </select>

                <select
                    name="trangThaiMaGiamGia"
                    onChange={handleChange}
                    className="form-select mb-2"
                >
                    <option value="DANG_HOAT_DONG">Hoạt động</option>
                    <option value="KHOA">Khóa</option>
                </select>

                <button className="btn btn-primary w-100">
                    Thêm mã
                </button>

            </form>
        </div>
    );
};

export default ThemMaGiamGia;