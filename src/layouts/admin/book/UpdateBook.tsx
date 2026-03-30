import React, { useEffect, useState } from "react";
import BookModel from "../../../model/BookModel";
import {
    layBookDeletde,
    layToanBoSachCategoryNotPage
} from "../../../api/BookApi";

interface BookUpdateDTO {
    maSach: number;
    tenSach: string;
    tenTacGia: string;
    isbn: string;
    moTa: string;
    giaNiemYet: number;
    giaBan: number;
    soLuong: number;
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

    const accessToken = localStorage.getItem("accessToken");

    // LOAD DATA
    useEffect(() => {
        layToanBoSachCategoryNotPage(maTheLoai).then(setDanhSachSach);
        layBookDeletde(maTheLoai).then(setSachDeleted); 
        setBook(null);
        setSelectedIds([]);
    }, [maTheLoai]);

    // SELECT BOOK
    const handleSelectBook = (sach: BookModel) => {
        if (isDeleteMode) return;

        setBook({
            maSach: sach.maSach,
            tenSach: sach.tenSach || "",
            tenTacGia: sach.tenTacGia || "",
            isbn: sach.isbn||"",
            moTa: sach.moTa || "",
            giaNiemYet: sach.giaNiemYet || 0,
            giaBan: sach.giaBan || 0,
            soLuong: sach.soLuong
        });
        console.log(sach);
    };

    // CHECKBOX
    const handleCheck = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    };

    // UPDATE
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
            setDanhSachSach(await layToanBoSachCategoryNotPage(maTheLoai));

        } catch {
            setMessage("Lỗi update");
        } finally {
            setLoading(false);
        }
    };

    // DELETE
    const handleDelete = async () => {
        if (selectedIds.length === 0) return alert("Chọn sách");

        try {
            setLoading(true);

            await fetch(`http://localhost:8080/book/delete?maTheLoai=${maTheLoai}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(selectedIds)
            });

            setMessage("🗑️ Đã xóa");

            setDanhSachSach(await layToanBoSachCategoryNotPage(maTheLoai));
            setSachDeleted(await layBookDeletde(maTheLoai));
            setSelectedIds([]);

        } catch {
            setMessage(" Lỗi xóa");
        } finally {
            setLoading(false);
        }
    };

    // RESTORE
    const handleRestore = async () => {
        if (selectedIds.length === 0) return alert("Chọn sách");

        try {
            setLoading(true);

            await fetch(`http://localhost:8080/book/restore?maTheLoai=${maTheLoai}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(selectedIds)
            });

            setMessage("♻️ Khôi phục thành công");

            setDanhSachSach(await layToanBoSachCategoryNotPage(maTheLoai));
            setSachDeleted(await layBookDeletde(maTheLoai));
            setSelectedIds([]);

        } catch {
            setMessage(" Lỗi restore");
        } finally {
            setLoading(false);
        }
    };

    const list = viewDeleted ? sachDeleted : danhSachSach;

    return (
        <div className="container mt-4">
            <h3 className="fw-bold mb-3">📚 Quản lý sách</h3>

            {/* TOOLBAR */}
            <div className="d-flex flex-wrap gap-2 mb-3">

                <select
                    className="form-select w-auto shadow-sm"
                    value={maTheLoai}
                    onChange={(e) => setMaTheLoai(Number(e.target.value))}
                >
                    <option value={0}>Tất cả</option>
                    <option value={1}>Tiểu thuyết</option>
                    <option value={2}>Kinh tế</option>
                    <option value={3}>CNTT</option>
                    <option value={4}>Truyện tranh</option>
                </select>

                <button
                    className={`btn ${viewDeleted ? "btn-secondary" : "btn-outline-secondary"}`}
                    onClick={() => {
                        setViewDeleted(!viewDeleted);
                        setSelectedIds([]);
                        setIsDeleteMode(false);
                    }}
                >
                    {viewDeleted ? "📖 Sách hoạt động" : "🗑️ Sách đã xóa"}
                </button>

                {!viewDeleted && (
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => setIsDeleteMode(!isDeleteMode)}
                    >
                        {isDeleteMode ? "❌ Hủy xóa" : "🗑️ Xóa sách"}
                    </button>
                )}

                {isDeleteMode && !viewDeleted && (
                    <button className="btn btn-danger" onClick={handleDelete}>
                        ⚠️ Xác nhận xóa
                    </button>
                )}

                {viewDeleted && (
                    <button className="btn btn-success" onClick={handleRestore}>
                        ♻️ Khôi phục
                    </button>
                )}
            </div>

            <div className="row g-3">

                {/* LIST */}
                <div className="col-md-5">
                    <div className="card shadow-sm">
                        <div className="card-header fw-semibold">
                            {viewDeleted ? "🗑️ Sách đã xóa" : "📖 Sách đang bán"}
                        </div>

                        <div className="list-group list-group-flush" style={{ maxHeight: 400, overflowY: "auto" }}>
                            {list.map((sach) => (
                                <div
                                    key={sach.maSach}
                                    className={`list-group-item d-flex justify-content-between align-items-center
                                    ${book?.maSach === sach.maSach ? "active" : ""}`}
                                >
                                    <div
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleSelectBook(sach)}
                                    >
                                        {sach.tenSach}
                                    </div>

                                    {(isDeleteMode || viewDeleted) && (
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(sach.maSach)}
                                            onChange={() => handleCheck(sach.maSach)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FORM FULL */}
                <div className="col-md-7">
                    {book && (
                        <div className="card shadow-sm p-3">
                            <h5 className="mb-3">
                                {viewDeleted ? "📦 Thông tin sách đã xóa" : "✏️ Chỉnh sửa sách"}
                            </h5>

                            <form onSubmit={handleSubmit}>
                                <div className="row">

                                    <div className="col-md-6">
                                        <label className="form-label">Tên sách</label>
                                        <input
                                            className="form-control mb-2"
                                            value={book.tenSach}
                                            disabled={viewDeleted}
                                            onChange={(e) => setBook({ ...book, tenSach: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Tác giả</label>
                                        <input
                                            className="form-control mb-2"
                                            value={book.tenTacGia}
                                            disabled={viewDeleted}
                                            onChange={(e) => setBook({ ...book, tenTacGia: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">ISBN</label>
                                        <input
                                            className="form-control mb-2"
                                            value={book.isbn}
                                            disabled={viewDeleted}
                                            onChange={(e) => setBook({ ...book, isbn: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Số lượng</label>
                                        <input
                                            type="number"
                                            className="form-control mb-2"
                                            value={book.soLuong}
                                            disabled={viewDeleted}
                                            onChange={(e) => setBook({ ...book, soLuong: Number(e.target.value) })}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Giá niêm yết</label>
                                        <input
                                            type="number"
                                            className="form-control mb-2"
                                            value={book.giaNiemYet}
                                            disabled={viewDeleted}
                                            onChange={(e) => setBook({ ...book, giaNiemYet: Number(e.target.value) })}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Giá bán</label>
                                        <input
                                            type="number"
                                            className="form-control mb-2"
                                            value={book.giaBan}
                                            disabled={viewDeleted}
                                            onChange={(e) => setBook({ ...book, giaBan: Number(e.target.value) })}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Mô tả</label>
                                        <textarea
                                            className="form-control mb-2"
                                            rows={3}
                                            value={book.moTa}
                                            disabled={viewDeleted}
                                            onChange={(e) => setBook({ ...book, moTa: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {!viewDeleted && !isDeleteMode && (
                                    <button className="btn btn-primary w-100 mt-2">
                                        {loading ? "Đang cập nhật..." : "💾 Lưu thay đổi"}
                                    </button>
                                )}
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {message && (
                <div className="alert alert-info mt-3 shadow-sm">
                    {message}
                </div>
            )}
        </div>
    );
};

export default UpdateBook;