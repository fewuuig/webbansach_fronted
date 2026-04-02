import React, { useEffect, useState } from "react";
import "./ThemMaGiamGia.css";
import { layTatCaVoucher } from "../../../api/MaGiamGia";

export interface MaGiamGiaCuaUserResponeDTO {
    maGiam: number;
    tenMaGiamGia: string;
    soMaDaDung: number;
    soLuong: number;
    ngayHetHan: any; 
    ngayBatDau: any; 
    loaiMaGiamGia: string;
    giamToiDa: number;
    donGiaTu: number;
    trangThaiMaGiamGia: string;
    doiTuongApDungMa: string;
    phanTramGiam?: number | string | null;
    tienGiam?: number | string | null;
    gioiHanSoLuongDungUser?: number;
    maGiamNguoiDung?: number; 
    daDung?: number; 
}

const initialFormState = {
    maGiam: 0,
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
};

// ================= HÀM HỖ TRỢ FORMAT NGÀY THÁNG =================
const formatDateTimeArrayToString = (dateArray: any) => {
    if (!dateArray || !Array.isArray(dateArray)) return dateArray; 
    const [year, month, day, hour, minute] = dateArray;
    const pad = (num: number) => String(num || 0).padStart(2, '0');
    return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
};

const ThemMaGiamGia: React.FC = () => {
    const [form, setForm] = useState<any>(initialFormState);
    const [maGiamGiaList, setMaGiamGiaList] = useState<MaGiamGiaCuaUserResponeDTO[]>([]);
    
    // State để nhận biết đang ở chế độ Thêm hay Sửa
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Lấy dữ liệu 
    useEffect(() => {
        layTatCaVoucher().then(data => {
            setMaGiamGiaList(data);
        });
    }, []);

    // ================= XỬ LÝ CHUYỂN ĐỔI CHẾ ĐỘ =================
    const handleAddNewClick = () => {
        setIsEditMode(false);
        setSelectedId(null);
        setForm(initialFormState);
    };

    const handleEditClick = (voucher: MaGiamGiaCuaUserResponeDTO) => {
        setIsEditMode(true);
        setSelectedId(voucher.maGiam);
        
        // Xử lý triệt để các trường tiền/phần trăm bị null từ Backend
        let anToanPhanTram = voucher.phanTramGiam ?? "";
        let anToanTienGiam = voucher.tienGiam ?? "";

        if (voucher.loaiMaGiamGia === "PHAN_TRAM") {
            anToanTienGiam = "";
        } else if (voucher.loaiMaGiamGia === "TIEN") {
            anToanPhanTram = "";
        }

        setForm({ 
            ...initialFormState, 
            ...voucher,
            ngayBatDau: formatDateTimeArrayToString(voucher.ngayBatDau),
            ngayHetHan: formatDateTimeArrayToString(voucher.ngayHetHan),
            phanTramGiam: anToanPhanTram,
            tienGiam: anToanTienGiam
        });
    };

    // ================= HANDLE CHANGE =================
    const handleChange = (e: any) => {
        const { name, value } = e.target;

        if (name === "loaiMaGiamGia") {
            setForm({
                ...form,
                loaiMaGiamGia: value,
                phanTramGiam: "",
                tienGiam: ""
            });
            return;
        }

        if (name.includes("so") || name.includes("gia") || name.includes("gioiHan")) {
            const numberValue = Number(value);
            if (numberValue < 0) return; 
            if (name === "phanTramGiam" && numberValue > 100) return; 

            setForm({ ...form, [name]: numberValue });
            return;
        }

        setForm({ ...form, [name]: value });
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("accessToken");

  
        const payload = {
            tenMaGiamGia: form.tenMaGiamGia,
            ngayBatDau: form.ngayBatDau,
            ngayHetHan: form.ngayHetHan,
            soLuong: form.soLuong,
            soMaDaDung: form.soMaDaDung,
            giamToiDa: form.giamToiDa,
            donGiaTu: form.donGiaTu,
            doiTuongApDungMa: form.doiTuongApDungMa,
            trangThaiMaGiamGia: form.trangThaiMaGiamGia,
            gioiHanSoLuongDungUser: form.gioiHanSoLuongDungUser,
            loaiMaGiamGia: form.loaiMaGiamGia,
            
            // Ép giá trị không dùng thành null để SpringBoot không bị lỗi ép kiểu (Type Mismatch)
            phanTramGiam: form.loaiMaGiamGia === "PHAN_TRAM" ? Number(form.phanTramGiam) : null,
            tienGiam: form.loaiMaGiamGia === "TIEN" ? Number(form.tienGiam) : null,
        };

        const url = isEditMode 
            ? `http://localhost:8080/vouchers/update-voucher/${form.maGiam}` 
            : "http://localhost:8080/vouchers/add-voucher";
        const method = isEditMode ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload), // Gửi payload siêu sạch đi
            });

            if (!response.ok) {
                const err = await response.text();
                alert("Lỗi: " + err);
                return;
            }

            alert(isEditMode ? "Cập nhật mã giảm giá thành công!" : "Thêm mã giảm giá thành công!");
            
            // Tải lại danh sách
            const newData = await layTatCaVoucher();
            setMaGiamGiaList(newData);
            if (!isEditMode) handleAddNewClick(); 

        } catch (error) {
            console.error(error);
            alert("Lỗi hệ thống");
        }
    };

    return (
        <div className="container-fluid mt-4" style={{ backgroundColor: "#f8f9fa", padding: "20px", minHeight: "100vh" }}>
            <div className="d-flex align-items-center mb-4">
                <h2 className="m-0">📚 Quản lý Mã Giảm Giá</h2>
            </div>

            <div className="row">
                {/* =========== CỘT TRÁI: MENU =========== */}
                <div className="col-md-3">
                    <button 
                        className={`btn w-100 mb-3 ${!isEditMode ? 'btn-primary' : 'btn-outline-primary'}`} 
                        onClick={handleAddNewClick}
                    >
                        + Thêm mã giảm giá
                    </button>

                    <div className="card">
                        <div className="card-header text-center font-weight-bold" style={{ backgroundColor: "#f1f3f5" }}>
                            📖 Danh sách mã
                        </div>
                        <ul className="list-group list-group-flush" style={{ maxHeight: "600px", overflowY: "auto" }}>
                            {maGiamGiaList.map((v) => (
                                <li 
                                    key={v.maGiam}
                                    className={`list-group-item list-group-item-action ${selectedId === v.maGiam ? 'active text-white bg-primary' : ''}`}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleEditClick(v)}
                                >
                                    {v.tenMaGiamGia}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* =========== CỘT PHẢI: FORM =========== */}
                <div className="col-md-9">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-5">
                            <h4 className="text-center mb-4">
                                {isEditMode ? '✏️ Chỉnh sửa mã giảm giá' : '➕ Thêm mã giảm giá mới'}
                            </h4>

                            <form onSubmit={handleSubmit}>
                                {/* Dòng 1 */}
                                <div className="row mb-3">
                                    <div className="col-md-6 text-center">
                                        <label className="text-muted small">Tên mã giảm giá</label>
                                        <input name="tenMaGiamGia" value={form.tenMaGiamGia} placeholder="Tên mã" onChange={handleChange} className="form-control" required />
                                    </div>
                                    <div className="col-md-6 text-center">
                                        <label className="text-muted small">Loại mã giảm giá</label>
                                        <select name="loaiMaGiamGia" value={form.loaiMaGiamGia} onChange={handleChange} className="form-select" required>
                                            <option value="">-- Chọn loại mã --</option>
                                            <option value="TIEN">Giảm theo tiền</option>
                                            <option value="PHAN_TRAM">Giảm theo %</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Dòng 2 */}
                                <div className="row mb-3">
                                    <div className="col-md-6 text-center">
                                        <label className="text-muted small">Ngày bắt đầu</label>
                                        <input type="datetime-local" name="ngayBatDau" value={form.ngayBatDau} onChange={handleChange} className="form-control" required />
                                    </div>
                                    <div className="col-md-6 text-center">
                                        <label className="text-muted small">Ngày hết hạn</label>
                                        <input type="datetime-local" name="ngayHetHan" value={form.ngayHetHan} onChange={handleChange} className="form-control" required />
                                    </div>
                                </div>

                                {/* Dòng 3 */}
                                <div className="row mb-3">
                                    <div className="col-md-6 text-center">
                                        <label className="text-muted small">Số lượng phát hành</label>
                                        <input type="number" name="soLuong" value={form.soLuong} min="0" placeholder="Số lượng" onChange={handleChange} className="form-control" required />
                                    </div>
                                    <div className="col-md-6 text-center">
                                        <label className="text-muted small">Giới hạn / User</label>
                                        <input name="gioiHanSoLuongDungUser" value={form.gioiHanSoLuongDungUser} type="number" min="0" placeholder="Giới hạn/user" onChange={handleChange} className="form-control" required />
                                    </div>
                                </div>

                                {/* Dòng 4 */}
                                <div className="row mb-3">
                                    <div className="col-md-6 text-center">
                                        <label className="text-muted small">Giảm tối đa</label>
                                        <input type="number" name="giamToiDa" value={form.giamToiDa} min="0" placeholder="Giảm tối đa" onChange={handleChange} className="form-control" required />
                                    </div>
                                    <div className="col-md-6 text-center">
                                        <label className="text-muted small">Đơn tối thiểu (Đơn giá từ)</label>
                                        <input type="number" name="donGiaTu" value={form.donGiaTu} min="0" placeholder="Đơn tối thiểu" onChange={handleChange} className="form-control" required />
                                    </div>
                                </div>

                                {/* Dòng 5 */}
                                <div className="row mb-3">
                                    <div className="col-md-6 text-center">
                                        <label className="text-muted small">% Giảm</label>
                                        <input name="phanTramGiam" value={form.phanTramGiam} type="number" min="0" max="100" placeholder="% giảm" onChange={handleChange} disabled={form.loaiMaGiamGia === "TIEN"} className="form-control" />
                                    </div>
                                    <div className="col-md-6 text-center">
                                        <label className="text-muted small">Tiền giảm</label>
                                        <input name="tienGiam" value={form.tienGiam} type="number" min="0" placeholder="Tiền giảm" onChange={handleChange} disabled={form.loaiMaGiamGia === "PHAN_TRAM"} className="form-control" />
                                    </div>
                                </div>

                                {/* Dòng 6 */}
                                <div className="row mb-4">
                                    <div className="col-md-6 text-center">
                                        <label className="text-muted small">Đối tượng áp dụng</label>
                                        <select name="doiTuongApDungMa" value={form.doiTuongApDungMa} onChange={handleChange} className="form-select">
                                            <option value="NGUOI_DUNG">Người dùng</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 text-center">
                                        <label className="text-muted small">Trạng thái</label>
                                        <select name="trangThaiMaGiamGia" value={form.trangThaiMaGiamGia} onChange={handleChange} className="form-select">
                                            <option value="DANG_HOAT_DONG">Hoạt động</option>
                                            <option value="KHOA">Khóa</option>
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-100 py-2 font-weight-bold">
                                    {isEditMode ? '💾 Lưu thay đổi' : '💾 Thêm mã mới'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemMaGiamGia;