import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookModel from "../../model/BookModel";
import { layChiTietMotQuyenSach } from "../../api/BookApi";
import { error } from "console";
import HinhAnhSach from "./components/HinhAnhSach";
import DanhGiaSanPham from "./DanhGiaSanPham";
import starRating from "../utils/Rating";
import dinhDangSo from "../utils/DinhDangSo";
import { getDefaultLibFilePath } from "typescript";
import { layThongTinCaNhan } from "../../api/ThongTinCaNhanApi";
interface ThongTinTaiKhoan{
  ten : string , 
  hoDem : string , 
  gioiTinh :string , 
  anhDaiDien : string ,
  email : string
}
const ChiTietSanPham: React.FC = () => {
    const { maSach } = useParams();
    let maSachNumber = 0;
    try {
        maSachNumber = parseInt(maSach + ' ');
        if (Number.isNaN(maSachNumber)) {
            maSachNumber = 0;
        }
    } catch (error) {
        maSachNumber = 0;
        console.error(error);
    }
    const [sach, setSach] = useState<BookModel | null>(null);
    const [baoLoi, setBaoLoi] = useState(null);
    const [layDuLieu, setLayDuLieu] = useState<Boolean>(true);
    const [soLuongHienTai, setSoLuongHienTai] = useState(1);
    const [trangThaiMua, setTrangThaiMua] = useState(false);
    const [noiDungDanhGia , setNoiDungDanhGia ] = useState("") ; 
    const [soSaoDanhGia, setSoSaoDanhGia] = useState(5);
    const [thongTinNguoiDung, setThongTinNguoiDung] = useState<ThongTinTaiKhoan | null>(null);
    const [reloadDanhGia , setReloadDanhGia] = useState(true) ;
    const navigate = useNavigate();
     useEffect(() => {
        layThongTinCaNhan().then(
          data => {
            setThongTinNguoiDung(data);
          }
        )
      }, [])
    useEffect(() => {
        setLayDuLieu(true);
        layChiTietMotQuyenSach(maSachNumber).then(
            sachData => {
                setSach(sachData);
                setLayDuLieu(false);
            }
        ).catch(
            error => {
                setBaoLoi(error.message);
                setLayDuLieu(false);
            }
        )
    }, [maSachNumber]
    )
    const giamSoLuongMua = () => {
        if (soLuongHienTai >= 2) {
            setSoLuongHienTai(soLuongHienTai - 1);
        }
    }
    const tangSoLuongMua = () => {
        const soLuongTonKho = (sach && sach.soLuong ? sach.soLuong : 0);
        if (soLuongHienTai < soLuongTonKho) {
            setSoLuongHienTai(soLuongHienTai + 1);
        }
    }
    const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
        const soLuongMuonMua = parseInt(e.target.value);
        const soLuongTonKho = (sach && sach.soLuong ? sach.soLuong : 0);
        if (!isNaN(soLuongMuonMua) && soLuongMuonMua <= soLuongTonKho && soLuongMuonMua >= 1) {
            setSoLuongHienTai(soLuongMuonMua);
        }
    }
    const muaNgay = async () => {

        navigate("/checkout", {
            state: {
                sach,
                soLuong: soLuongHienTai,
            }
        })

    }
    const themVaoGioHang = async () => {
        const accessToken = localStorage.getItem("accessToken");
        await fetch("http://localhost:8080/cart/add-to-cart", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(
                {
                    maSach: maSachNumber,
                    soLuong: soLuongHienTai

                }
            )
        }).then(respone => {
            if (respone.ok) {
                alert("đã thêm vào giỏ hàng");
            }
        });
    }
    if (layDuLieu) {
        return (
            <div><h1>dang tai du lieu</h1></div>
        );
    }
    if (baoLoi) {
        return (
            <div><h1>gap loi</h1></div>
        );
    }
    if (!sach) {
        return (
            <div>sáchk hông tồn tại</div>
        );
    }
    const guiDanhGia =async ()=>{
        
        const accessToken = localStorage.getItem("accessToken") ; 
        await fetch(`http://localhost:8080/danh-gia/${sach.maSach}/${noiDungDanhGia}`,{
            method : 'POST' , 
            headers:{
                'content-type' : 'application/json' , 
                'Authorization' : `Bearer ${accessToken}`
            },
        })
        setNoiDungDanhGia("") ;
        setReloadDanhGia(!reloadDanhGia) ; 
    }
    return (
        <div className="container mt-5 mb-5">

            {/* ====== THÔNG TIN SẢN PHẨM ====== */}
            <div className="row g-4">

                {/* ẢNH SÁCH */}
                <div className="col-md-4">
                    <div className="border rounded p-3 bg-light">
                        <HinhAnhSach maSach={maSachNumber} />
                    </div>
                </div>

                {/* THÔNG TIN CHÍNH */}
                <div className="col-md-5">
                    <h3 className="fw-bold">{sach.tenSach}</h3>

                    <div className="mb-2 text-warning">
                        {starRating(sach.trungBinhXepHang ?? 0)}
                    </div>

                    <h4 className="text-danger fw-bold">
                        {dinhDangSo(sach.giaBan)} đ
                    </h4>

                    <hr />

                    <p className="text-muted">
                        ✔ Sách chính hãng<br />
                        ✔ Giao hàng nhanh<br />
                        ✔ Đổi trả trong 7 ngày
                    </p>
                </div>

                {/* BOX MUA HÀNG */}
                <div className="col-md-3">
                    <div className="border rounded p-3 shadow-sm">

                        <h6 className="fw-bold">Số lượng</h6>
                        <div className="d-flex align-items-center mb-3">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={giamSoLuongMua}
                            >−</button>

                            <input
                                type="number"
                                className="form-control mx-2 text-center"
                                style={{ width: "70px" }}
                                min={1}
                                value={soLuongHienTai}
                                onChange={handleOnchange}
                            />

                            <button
                                className="btn btn-outline-secondary"
                                onClick={tangSoLuongMua}
                            >+</button>
                        </div>

                        <div className="mb-3">
                            <small className="text-muted">Tạm tính</small>
                            <h5 className="text-danger fw-bold">
                                {dinhDangSo((sach.giaBan ?? 0) * soLuongHienTai)} đ
                            </h5>
                        </div>

                        <div className="d-grid gap-2">
                            <button
                                className="btn btn-danger"
                                onClick={muaNgay}
                            >
                                Mua ngay
                            </button>
                            <button
                                className="btn btn-outline-danger"
                                onClick={themVaoGioHang}
                            >
                                Thêm vào giỏ hàng
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* ====== ĐÁNH GIÁ ====== */}
            <div className="mt-5">

                <h4 className="fw-bold mb-4">Đánh giá sản phẩm</h4>

                {/* FORM VIẾT ĐÁNH GIÁ */}
                <div className="border rounded p-4 mb-4 bg-light">

                    <h6 className="fw-bold mb-3">Viết đánh giá của bạn</h6>

                    <div className="d-flex align-items-start">

                        {/* AVATAR */}
                        <img
                            src={thongTinNguoiDung?.anhDaiDien}
                            alt="avatar"
                            className="rounded-circle border me-3"
                            style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover"
                            }}
                        />

                        {/* FORM */}
                        <div className="flex-grow-1">

                            {/* CHỌN SAO */}
                            <div className="mb-2 text-warning">
                                {starRating(soSaoDanhGia)}
                            </div>

                            {/* NHẬN XÉT */}
                            <textarea
                                className="form-control mb-3"
                                rows={3}
                                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
                                value={noiDungDanhGia}
                                onChange={(e) => setNoiDungDanhGia(e.target.value)}
                            />

                            <div className="text-end">
                                <button
                                    className="btn btn-danger"
                                    onClick={guiDanhGia}
                                    disabled={!noiDungDanhGia}
                                >
                                    Gửi đánh giá
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* DANH SÁCH ĐÁNH GIÁ */}
                <DanhGiaSanPham maSach={maSachNumber} reloadDanhGia={reloadDanhGia} setReloadDanhGia = {setReloadDanhGia}/>

            </div>

        </div>
    );


}
export default ChiTietSanPham;  