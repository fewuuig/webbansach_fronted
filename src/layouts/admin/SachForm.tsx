import React, { FormEvent, useState } from "react";
import RequireAdmin from "./RequireAdmin";
const SachForm: React.FC = () => {
    const [sach, setSach] = useState({
        id: 0,
        isbn: '',//
        giaBan: 0,//
        giaNiemYet: 0,//
        moTa: '', // 
        soLuong: 0,
        tenSach: '', // 
        tenTacGia: '', // 
        trungBinhXepHang: 0
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            fetch('http://localhost:8080/them-sach', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(sach)
            }).then((respone) => {
                if (respone.ok) {
                    alert("Thêm sách thành công");
                    setSach({
                        id: 0,
                        isbn: '',//
                        giaBan: 0,//
                        giaNiemYet: 0,//
                        moTa: '', // 
                        soLuong: 0,
                        tenSach: '', // 
                        tenTacGia: '', // 
                        trungBinhXepHang: 0
                    })
                }else {
                    alert("gặp lỗi trong quá trình thêm sách") ; 

                }
            })

        }
    }
    return (
        <div className="container" style={{ width: '400px' }}>
            <form onSubmit={handleSubmit}>

                <input id="maSach" type="hidden" value={sach.id}></input>
                <div>
                    <label htmlFor="ts" className="form-label" >Tên sách</label>
                    <input className="form-control" type="text" value={sach.tenSach} id="ts" required onChange={(e) => (setSach({ ...sach, tenSach: e.target.value }))}></input>
                </div>
                <div>
                    <label>Tên tác giả</label>
                    <input className="form-control" type="text" value={sach.tenTacGia} required onChange={(e) => (setSach({ ...sach, tenTacGia: e.target.value }))}></input>
                </div>
                <div>
                    <label>Mô tả</label>
                    <input className="form-control" type="text" value={sach.moTa} onChange={(e) => (setSach({ ...sach, moTa: e.target.value }))}></input>
                </div>
                <div>
                    <label>Giá niêm yết</label>
                    <input className="form-control" type="number" value={sach.giaNiemYet} required onChange={(e) => (setSach({ ...sach, giaNiemYet: parseFloat(e.target.value) }))}></input>
                </div>
                <div>
                    <label>Giá bán</label>
                    <input className="form-control" type="number" value={sach.giaBan} required onChange={(e) => (setSach({ ...sach, giaBan: parseFloat(e.target.value) }))}></input>
                </div>
                <div>
                    <label>ISBN</label>
                    <input className="form-control" type="text" value={sach.isbn} required onChange={(e) => (setSach({ ...sach, isbn: e.target.value }))}></input>
                </div>
                <div>
                    <label>Trung bình đánh giá</label>
                    <input className="form-control" type="number" value={sach.trungBinhXepHang} required onChange={(e) => (setSach({ ...sach, trungBinhXepHang: parseFloat(e.target.value) }))}></input>
                </div>
                <button type="submit" className="btn btn-primary">Lưu</button>
            </form>
        </div>
    );
}
const SachForm_Admin = RequireAdmin(SachForm) ; 
export default SachForm_Admin; 