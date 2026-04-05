import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import RequireAdmin from "./RequireAdmin";

const SachForm: React.FC = () => {
    const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [pendingFilePickerIndex, setPendingFilePickerIndex] = useState<number | null>(null);

    const [sach, setSach] = useState({
        tenSach: "",
        tenTacGia: "",
        isbn: "",
        moTa: "",
        giaNiemYet: 0,
        giaBan: 0,
        soLuong: 0,
        maTheLoai: 0,
        hinhAnhDTOS: [
            { tenHinhAnh: "", duLieuAnh: "" }
        ]
    });

    useEffect(() => {
        if (pendingFilePickerIndex === null) return;

        fileInputRefs.current[pendingFilePickerIndex]?.click();
        setPendingFilePickerIndex(null);
    }, [pendingFilePickerIndex, sach.hinhAnhDTOS.length]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("accessToken");

        fetch("http://localhost:8080/book/add-new-book", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(sach)
        }).then(res => {
            if (res.ok) {
                alert("Thêm sách thành công");
            } else {
                alert("Lỗi khi thêm sách");
            }
            console.log(sach);
        });
    };

    const addImage = () => {
        const nextIndex = sach.hinhAnhDTOS.length;

        setSach({
            ...sach,
            hinhAnhDTOS: [
                ...sach.hinhAnhDTOS,
                { tenHinhAnh: "", duLieuAnh: "" }
            ]
        });

        setPendingFilePickerIndex(nextIndex);
    };

    const handleImageFileChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const newImages = [...sach.hinhAnhDTOS];
            newImages[index] = {
                tenHinhAnh: file.name,
                duLieuAnh: typeof reader.result === "string" ? reader.result : ""
            };

            setSach({ ...sach, hinhAnhDTOS: newImages });
        };
        reader.readAsDataURL(file);
    };

    const removeImage = (index: number) => {
        const newImages = sach.hinhAnhDTOS.filter((_, i) => i !== index);
        setSach({ ...sach, hinhAnhDTOS: newImages });
    };

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "900px" }}>
                <h3 className="text-center mb-4">Thêm sách</h3>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Tên sách</label>
                            <input
                                className="form-control"
                                value={sach.tenSach}
                                onChange={(e) => setSach({ ...sach, tenSach: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Tác giả</label>
                            <input
                                className="form-control"
                                value={sach.tenTacGia}
                                onChange={(e) => setSach({ ...sach, tenTacGia: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label>ISBN</label>
                        <input
                            className="form-control"
                            value={sach.isbn}
                            onChange={(e) => setSach({ ...sach, isbn: e.target.value })}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Mô tả</label>
                        <textarea
                            className="form-control"
                            value={sach.moTa}
                            onChange={(e) => setSach({ ...sach, moTa: e.target.value })}
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label>Giá niêm yết</label>
                            <input
                                type="number"
                                className="form-control"
                                onChange={(e) => setSach({ ...sach, giaNiemYet: parseFloat(e.target.value) })}
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Giá bán</label>
                            <input
                                type="number"
                                className="form-control"
                                onChange={(e) => setSach({ ...sach, giaBan: parseFloat(e.target.value) })}
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Số lượng</label>
                            <input
                                type="number"
                                className="form-control"
                                onChange={(e) => setSach({ ...sach, soLuong: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label>Thể loại</label>
                        <select
                            className="form-select"
                            onChange={(e) => setSach({ ...sach, maTheLoai: parseInt(e.target.value) })}
                        >
                            <option value="">-- chọn --</option>
                            <option value="1">Tiểu thuyết</option>
                            <option value="2">Kinh tế</option>
                            <option value="3">Công nghệ thông tin</option>
                            <option value="4">Truyện tranh</option>
                            <option value="5">Tâm lý kỹ năng</option>
                        </select>
                    </div>

                    <hr />
                    <h5>Danh sách ảnh</h5>

                    {sach.hinhAnhDTOS.map((img, index) => (
                        <div key={index} className="border p-3 mb-3 rounded">
                            <input
                                ref={(element) => {
                                    fileInputRefs.current[index] = element;
                                }}
                                type="file"
                                accept="image/*"
                                className="d-none"
                                onChange={(e) => handleImageFileChange(index, e)}
                            />

                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm mb-2"
                                onClick={() => fileInputRefs.current[index]?.click()}
                            >
                                {img.duLieuAnh ? "Đổi ảnh khác" : "Chọn ảnh từ máy"}
                            </button>

                            {img.duLieuAnh && (
                                <>
                                    <div className="mb-2">
                                        <img
                                            src={img.duLieuAnh}
                                            alt={img.tenHinhAnh || `ảnh ${index + 1}`}
                                            style={{ width: "120px", marginBottom: "10px" }}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeImage(index)}
                                    >
                                        Xóa ảnh
                                    </button>
                                </>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-success mb-3"
                        onClick={addImage}
                    >
                        + Thêm ảnh
                    </button>

                    <button className="btn btn-primary w-100">
                        Thêm sách
                    </button>
                </form>
            </div>
        </div>
    );
};

const SachForm_Admin = RequireAdmin(SachForm);
export default SachForm_Admin;
