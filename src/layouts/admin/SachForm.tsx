import React, { FormEvent, useState } from "react";
import RequireAdmin from "./RequireAdmin";

const SachForm: React.FC = () => {

    const [sach, setSach] = useState({
        tenSach: '',
        tenTacGia: '',
        isbn: '',
        moTa: '',
        giaNiemYet: 0,
        giaBan: 0,
        soLuong: 0,
        maTheLoai: 0,
        hinhAnhDTOS: [
            { tenHinhAnh: '', duLieuAnh: '' }
        ]
    });

    // ===== submit =====
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('accessToken');

        fetch('http://localhost:8080/book/add-new-book', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(sach)
        }).then(res => {
            if (res.ok) {
                alert("Thêm sách thành công");
            } else {
                alert("Lỗi khi thêm sách");
            }
            console.log(sach) ;
        });
    };

    // ===== thêm ảnh =====
    const addImage = () => {
        setSach({
            ...sach,
            hinhAnhDTOS: [
                ...sach.hinhAnhDTOS,
                { tenHinhAnh: '', duLieuAnh: '' }
            ]
        });
    };

    // ===== sửa ảnh =====
    const handleImageChange = (index: number, field: string, value: string) => {
        const newImages = [...sach.hinhAnhDTOS];
        newImages[index] = {
            ...newImages[index],
            [field]: value
        };

        setSach({ ...sach, hinhAnhDTOS: newImages });
    };

    // ===== xoá ảnh =====
    const removeImage = (index: number) => {
        const newImages = sach.hinhAnhDTOS.filter((_, i) => i !== index);
        setSach({ ...sach, hinhAnhDTOS: newImages });
    };

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "900px" }}>

                <h3 className="text-center mb-4">📚 Thêm sách</h3>

                <form onSubmit={handleSubmit}>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Tên sách</label>
                            <input className="form-control"
                                value={sach.tenSach}
                                onChange={(e) => setSach({ ...sach, tenSach: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Tác giả</label>
                            <input className="form-control"
                                value={sach.tenTacGia}
                                onChange={(e) => setSach({ ...sach, tenTacGia: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label>ISBN</label>
                        <input className="form-control"
                            value={sach.isbn}
                            onChange={(e) => setSach({ ...sach, isbn: e.target.value })}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Mô tả</label>
                        <textarea className="form-control"
                            value={sach.moTa}
                            onChange={(e) => setSach({ ...sach, moTa: e.target.value })}
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label>Giá niêm yết</label>
                            <input type="number" className="form-control"
                                onChange={(e) => setSach({ ...sach, giaNiemYet: parseFloat(e.target.value) })}
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Giá bán</label>
                            <input type="number" className="form-control"
                                onChange={(e) => setSach({ ...sach, giaBan: parseFloat(e.target.value) })}
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Số lượng</label>
                            <input type="number" className="form-control"
                                onChange={(e) => setSach({ ...sach, soLuong: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label>Thể loại</label>
                        <select className="form-select"
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
                    <h5>📷 Danh sách ảnh</h5>

                    {sach.hinhAnhDTOS.map((img, index) => (
                        <div key={index} className="border p-3 mb-3 rounded">

                            <input
                                className="form-control mb-2"
                                placeholder="Tên hình ảnh"
                                value={img.tenHinhAnh}
                                onChange={(e) =>
                                    handleImageChange(index, "tenHinhAnh", e.target.value)
                                }
                            />

                            <input
                                className="form-control mb-2"
                                placeholder="URL ảnh"
                                value={img.duLieuAnh}
                                onChange={(e) =>
                                    handleImageChange(index, "duLieuAnh", e.target.value)
                                }
                            />

                            {img.duLieuAnh && (
                                <img
                                    src={img.duLieuAnh}
                                    style={{ width: "120px", marginBottom: "10px" }}
                                />
                            )}

                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => removeImage(index)}
                            >
                                Xoá ảnh
                            </button>
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
                        💾 Thêm sách
                    </button>
                </form>
            </div>
        </div>
    );
};

const SachForm_Admin = RequireAdmin(SachForm);
export default SachForm_Admin;