import React, { useEffect, useState } from "react";
import BookModel from "../../../model/BookModel";
import { layToanBoAnh } from "../../../api/HinhAnhApi";
import {
    layBookDeletde,
    layToanBoSachCategoryNotPage,
  // Đảm bảo hàm này được import đúng từ file API của bạn
} from "../../../api/BookApi"; 
import HinhAnhModel from "../../../model/HinhAnhModel";

interface hinhAnhDTOS {
    duLieuAnh: string,
    tenHinhAnh: string
}

interface BookUpdateDTO {
    maSach: number;
    tenSach: string;
    tenTacGia: string;
    isbn: string;
    moTa: string;
    giaNiemYet: number;
    giaBan: number;
    soLuong: number;
    hinhAnhDTOS: hinhAnhDTOS[];
    idImgDelete: number[]; // Để gửi list ID ảnh cần xóa về Backend
}

const UpdateBook: React.FC = () => {
    const [danhSachSach, setDanhSachSach] = useState<BookModel[]>([]);
    const [sachDeleted, setSachDeleted] = useState<BookModel[]>([]);
    const [book, setBook] = useState<BookUpdateDTO | null>(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [viewDeleted, setViewDeleted] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [maTheLoai, setMaTheLoai] = useState<number>(0);
    
    const [imgOriginal, setImgOriginal] = useState<HinhAnhModel[]>([]); 
    const accessToken = localStorage.getItem("accessToken");

    // 1. LOAD DATA (Giữ nguyên logic cũ của bạn)
    useEffect(() => {
        layToanBoSachCategoryNotPage(maTheLoai).then(setDanhSachSach);
        layBookDeletde(maTheLoai).then(setSachDeleted);
        setBook(null);
        setSelectedIds([]);
        setImgOriginal([]);
    }, [maTheLoai]);

    console.log("Danh sách sách: ", danhSachSach);
    // 2. SELECT BOOK (Thêm logic lấy ảnh cũ)
    const handleSelectBook = async (sach: BookModel) => {
        if (isDeleteMode) return;

        // Lấy ảnh cũ từ database hiện lên
        try {
            const anhCuaSach = await layToanBoAnh(sach.maSach, -1);
            setImgOriginal(anhCuaSach || []);
        } catch (error) {
            setImgOriginal([]);
        }

        setBook({
            maSach: sach.maSach,
            tenSach: sach.tenSach || "",
            tenTacGia: sach.tenTacGia || "",
            isbn: sach.isbn || "",
            moTa: sach.moTa || "",
            giaNiemYet: sach.giaNiemYet || 0,
            giaBan: sach.giaBan || 0,
            soLuong: sach.soLuong,
            hinhAnhDTOS: [], // Ảnh mới thêm (để trống)
            idImgDelete: []  // Danh sách ID ảnh cũ muốn xóa (để trống)
        });
    };

    // 3. CHECKBOX XÓA SÁCH
    const handleCheck = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // 4. LOGIC XỬ LÝ ẢNH CŨ (Chọn ID để xóa)
    const handleToggleDeleteImage = (idHinhAnh: number) => {
        if (!book) return;
        const isMarked = book.idImgDelete.includes(idHinhAnh);
        const newIds = isMarked
            ? book.idImgDelete.filter(id => id !== idHinhAnh)
            : [...book.idImgDelete, idHinhAnh];
        setBook({ ...book, idImgDelete: newIds });
    };

    // 5. LOGIC THÊM ẢNH MỚI (DTO)
    const addImage = () => {
        if (!book) return;
        setBook({
            ...book,
            hinhAnhDTOS: [...(book.hinhAnhDTOS || []), { tenHinhAnh: '', duLieuAnh: '' }]
        });
    };

    const handleImageChange = (index: number, field: string, value: string) => {
        if (!book) return;
        const newImages = [...book.hinhAnhDTOS];
        newImages[index] = { ...newImages[index], [field]: value };
        setBook({ ...book, hinhAnhDTOS: newImages });
    };

    const removeImage = (index: number) => {
        if (!book) return;
        setBook({ ...book, hinhAnhDTOS: book.hinhAnhDTOS.filter((_, i) => i !== index) });
    };

    // 6. UPDATE
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            await fetch(`http://localhost:8080/book/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(book)
            });
            setMessage("✅ Cập nhật thành công");
            layToanBoSachCategoryNotPage(maTheLoai).then(setDanhSachSach);
            setBook(null); // Đóng form sau khi update
        } catch {
            setMessage("Lỗi update");
        } finally {
            setLoading(false);
        }
        console.log("Dữ liệu gửi về Backend: ", book);
    };

    // 7. DELETE & RESTORE (Giữ nguyên logic của bạn)
    const handleDelete = async () => {
        if (selectedIds.length === 0) return alert("Chọn sách");
        try {
            setLoading(true);
            await fetch(`http://localhost:8080/book/delete?maTheLoai=${maTheLoai}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
                body: JSON.stringify(selectedIds)
            });
            setMessage("🗑️ Đã xóa");
            layToanBoSachCategoryNotPage(maTheLoai).then(setDanhSachSach);
            layBookDeletde(maTheLoai).then(setSachDeleted);
            setSelectedIds([]);
        } catch { setMessage("Lỗi xóa"); } finally { setLoading(false); }
    };

    const handleRestore = async () => {
        if (selectedIds.length === 0) return alert("Chọn sách");
        try {
            setLoading(true);
            await fetch(`http://localhost:8080/book/restore?maTheLoai=${maTheLoai}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
                body: JSON.stringify(selectedIds)
            });
            setMessage("♻️ Khôi phục thành công");
            layToanBoSachCategoryNotPage(maTheLoai).then(setDanhSachSach);
            layBookDeletde(maTheLoai).then(setSachDeleted);
            setSelectedIds([]);
        } catch { setMessage("Lỗi restore"); } finally { setLoading(false); }
    };

    const list = viewDeleted ? sachDeleted : danhSachSach;

    return (
        <div className="container mt-4">
            <h3 className="fw-bold mb-3">📚 Quản lý sách</h3>

            <div className="d-flex flex-wrap gap-2 mb-3">
                <select
                    className="form-select w-auto"
                    value={maTheLoai}
                    onChange={(e) => setMaTheLoai(Number(e.target.value))}
                >
                    <option value={0}>Tất cả</option>
                    <option value={1}>Tiểu thuyết</option>
                    <option value={2}>Kinh tế</option>
                    <option value={3}>CNTT</option>
                    <option value={4}>Truyện tranh</option>
                </select>

                <button className="btn btn-outline-secondary" onClick={() => setViewDeleted(!viewDeleted)}>
                    {viewDeleted ? "📖 Sách hoạt động" : "🗑️ Sách đã xóa"}
                </button>

                {!viewDeleted && (
                    <button className="btn btn-outline-danger" onClick={() => setIsDeleteMode(!isDeleteMode)}>
                        {isDeleteMode ? "❌ Hủy xóa" : "🗑️ Xóa sách"}
                    </button>
                )}

                {isDeleteMode && !viewDeleted && (
                    <button className="btn btn-danger" onClick={handleDelete}>⚠️ Xác nhận xóa</button>
                )}

                {viewDeleted && (
                    <button className="btn btn-success" onClick={handleRestore}>♻️ Khôi phục</button>
                )}
            </div>

            <div className="row g-3">
                {/* DANH SÁCH BÊN TRÁI */}
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-header">{viewDeleted ? "Sách đã xóa" : "Sách đang bán"}</div>
                        <div className="list-group list-group-flush" style={{ maxHeight: 600, overflowY: "auto" }}>
                            {list.map((sach) => (
                                <div key={sach.maSach} className={`list-group-item d-flex justify-content-between ${book?.maSach === sach.maSach ? "active" : ""}`}>
                                    <div style={{ cursor: "pointer", flex: 1 }} onClick={() => handleSelectBook(sach)}>
                                        {sach.tenSach}
                                    </div>
                                    {(isDeleteMode || viewDeleted) && (
                                        <input type="checkbox" checked={selectedIds.includes(sach.maSach)} onChange={() => handleCheck(sach.maSach)} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FORM BÊN PHẢI */}
                <div className="col-md-7">
                    {book && (
                        <div className="card p-3 shadow-sm">
                            <h5>{viewDeleted ? "📦 Chi tiết" : "✏️ Chỉnh sửa"}</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <label>Tên sách</label>
                                        <input className="form-control" value={book.tenSach} disabled={viewDeleted} onChange={(e) => setBook({ ...book, tenSach: e.target.value })} />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label>Tác giả</label>
                                        <input className="form-control" value={book.tenTacGia} disabled={viewDeleted} onChange={(e) => setBook({ ...book, tenTacGia: e.target.value })} />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label>Số lượng</label>
                                        <input type="number" className="form-control" value={book.soLuong} disabled={viewDeleted} onChange={(e) => setBook({ ...book, soLuong: Number(e.target.value) })} />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label>Giá bán</label>
                                        <input type="number" className="form-control" value={book.giaBan} disabled={viewDeleted} onChange={(e) => setBook({ ...book, giaBan: Number(e.target.value) })} />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label>Mô tả</label>
                                        <textarea className="form-control" rows={3} value={book.moTa} disabled={viewDeleted} onChange={(e) => setBook({ ...book, moTa: e.target.value })} />
                                    </div>

                                    {/* PHẦN QUẢN LÝ ẢNH */}
                                    <div className="col-12">
                                        <hr />
                                        <h6>🖼️ Ảnh hiện tại (Tích để xóa)</h6>
                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            {imgOriginal.map((img) => (
                                                <div key={img.maHinhAnh} className="text-center border p-1" style={{ width: "100px" }}>
                                                    <img src={img.duLieuAnh || img.link} style={{ width: "100%", height: "80px", objectFit: "cover" }} />
                                                    <input type="checkbox" className="mt-1" checked={book.idImgDelete.includes(img.maHinhAnh)} onChange={() => handleToggleDeleteImage(img.maHinhAnh)} />
                                                </div>
                                            ))}
                                        </div>

                                        <h6>📷 Thêm ảnh mới</h6>
                                        {book.hinhAnhDTOS.map((img, index) => (
                                            <div key={index} className="border p-2 mb-2">
                                                <input className="form-control form-control-sm mb-1" placeholder="Tên ảnh" value={img.tenHinhAnh} onChange={(e) => handleImageChange(index, "tenHinhAnh", e.target.value)} />
                                                <input className="form-control form-control-sm mb-1" placeholder="Link ảnh/Base64" value={img.duLieuAnh} onChange={(e) => handleImageChange(index, "duLieuAnh", e.target.value)} />
                                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeImage(index)}>Xóa</button>
                                            </div>
                                        ))}
                                        {!viewDeleted && <button type="button" className="btn btn-sm btn-success" onClick={addImage}>+ Thêm ảnh</button>}
                                    </div>
                                </div>
                                {!viewDeleted && !isDeleteMode && (
                                    <button className="btn btn-primary w-100 mt-3" disabled={loading}>
                                        {loading ? "Đang xử lý..." : "Lưu thay đổi"}
                                    </button>
                                )}
                            </form>
                        </div>
                    )}
                </div>
            </div>
            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
};

export default UpdateBook;