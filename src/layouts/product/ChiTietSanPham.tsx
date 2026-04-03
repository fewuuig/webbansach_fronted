import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../cart/ChiTietSanPham.css";
import BookModel from "../../model/BookModel";
import { layChiTietMotQuyenSach } from "../../api/BookApi";
import { layToanBoAnh } from "../../api/HinhAnhApi";
import HinhAnhModel from "../../model/HinhAnhModel";
import DanhGiaSanPham from "./DanhGiaSanPham";
import starRating from "../utils/Rating";
import dinhDangSo from "../utils/DinhDangSo";
import { layThongTinCaNhan } from "../../api/ThongTinCaNhanApi";

interface ThongTinTaiKhoan {
  ten: string;
  hoDem: string;
  gioiTinh: string;
  anhDaiDien: string;
  email: string;
}

const ChiTietSanPham: React.FC = () => {
  const { maSach } = useParams();
  let maSachNumber = 0;
  
  try {
    maSachNumber = parseInt(maSach + " ");
    if (Number.isNaN(maSachNumber)) {
      maSachNumber = 0;
    }
  } catch (error) {
    maSachNumber = 0;
    console.error(error);
  }

  const [sach, setSach] = useState<BookModel | null>(null);
  const [danhSachHinhAnh, setDanhSachHinhAnh] = useState<HinhAnhModel[]>([]);
  const [anhDangXem, setAnhDangXem] = useState(0);
  const [baoLoi, setBaoLoi] = useState<string | null>(null);
  const [layDuLieu, setLayDuLieu] = useState<boolean>(true);
  const [soLuongHienTai, setSoLuongHienTai] = useState(1);
  const [noiDungDanhGia, setNoiDungDanhGia] = useState("");
  const [soSaoDanhGia, setSoSaoDanhGia] = useState(5);
  const [thongTinNguoiDung, setThongTinNguoiDung] = useState<ThongTinTaiKhoan | null>(null);
  const [reloadDanhGia, setReloadDanhGia] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    layThongTinCaNhan().then((data) => {
      setThongTinNguoiDung(data);
    });
  }, []);

  useEffect(() => {
    setLayDuLieu(true);
    layChiTietMotQuyenSach(maSachNumber)
      .then((sachData) => {
        setSach(sachData);
        setLayDuLieu(false);
      })
      .catch((error) => {
        setBaoLoi(error.message);
        setLayDuLieu(false);
      });
  }, [maSachNumber]);

  useEffect(() => {
    layToanBoAnh(maSachNumber, 20)
      .then((anhData) => {
        setDanhSachHinhAnh(anhData || []);
        setAnhDangXem(0);
      })
      .catch(() => {
        setDanhSachHinhAnh([]);
      });
  }, [maSachNumber]);

  const giamSoLuongMua = () => {
    if (soLuongHienTai >= 2) {
      setSoLuongHienTai(soLuongHienTai - 1);
    }
  };

  const tangSoLuongMua = () => {
    const soLuongTonKho = sach && sach.soLuong ? sach.soLuong : 0;
    if (soLuongHienTai < soLuongTonKho) {
      setSoLuongHienTai(soLuongHienTai + 1);
    }
  };

  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    const soLuongMuonMua = parseInt(e.target.value);
    const soLuongTonKho = sach && sach.soLuong ? sach.soLuong : 0;
    if (
      !isNaN(soLuongMuonMua) &&
      soLuongMuonMua <= soLuongTonKho &&
      soLuongMuonMua >= 1
    ) {
      setSoLuongHienTai(soLuongMuonMua);
    }
  };

  const muaNgay = async () => {
    navigate("/checkout", {
      state: {
        sach,
        soLuong: soLuongHienTai,
      },
    });
  };

  const themVaoGioHang = async () => {
    const accessToken = localStorage.getItem("accessToken");
    await fetch("http://localhost:8080/cart/add-to-cart", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        maSach: maSachNumber,
        soLuong: soLuongHienTai,
      }),
    }).then((response) => {
      if (response.ok) {
        alert("Đã thêm vào giỏ hàng");
      }
    });
  };

  const guiDanhGia = async () => {
    if (!sach) return;
    const accessToken = localStorage.getItem("accessToken");
    await fetch(
      `http://localhost:8080/danh-gia/${sach.maSach}/${noiDungDanhGia}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    setNoiDungDanhGia("");
    setReloadDanhGia(!reloadDanhGia);
  };

  if (layDuLieu) {
    return (
      <div className="container mt-5 text-center">
        <h1>Đang tải dữ liệu...</h1>
      </div>
    );
  }

  if (baoLoi) {
    return (
      <div className="container mt-5 text-center text-danger">
        <h1>Gặp lỗi: {baoLoi}</h1>
      </div>
    );
  }

  if (!sach) {
    return (
      <div className="container mt-5 text-center">
        <h1>Sách không tồn tại</h1>
      </div>
    );
  }

  const tongTienTamTinh = (sach.giaBan ?? 0) * soLuongHienTai;
  const hinhLon = danhSachHinhAnh[anhDangXem]?.duLieuAnh;
  const soThumbnailCanCo = Math.max(7, danhSachHinhAnh.length);
  const danhSachThumbnail: (HinhAnhModel | null)[] = Array.from(
    { length: soThumbnailCanCo },
    (_, index) => danhSachHinhAnh[index] ?? null
  );

  return (
    <div className="book-detail-page py-5">
      <div className="container">
        <div className="book-detail-shell">
          {/* SẢN PHẨM */}
          <div className="row g-4 align-items-start">
            <div className="col-lg-5">
              <div className="left-detail-panel">
                <div className="main-book-image-wrap">
                  {hinhLon ? (
                    <img
                      src={hinhLon}
                      alt={sach.tenSach}
                      className="main-book-image"
                    />
                  ) : (
                    <div className="main-book-image placeholder-image d-flex align-items-center justify-content-center">
                      Không có ảnh
                    </div>
                  )}
                </div>

                <div className="thumb-grid">
                  {danhSachThumbnail.map((anh, index) => (
                    <button
                      key={`thumb-${index}`}
                      type="button"
                      className={`thumb-item ${index === anhDangXem ? "active" : ""} ${!anh ? "empty" : ""}`}
                      disabled={!anh}
                      onClick={() => setAnhDangXem(index)}
                    >
                      {anh ? (
                        <img
                          src={anh.duLieuAnh}
                          alt={`Ảnh ${index + 1}`}
                          className="thumb-image"
                        />
                      ) : (
                        <span className="thumb-empty-text d-flex align-items-center justify-content-center h-100">Ảnh</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="left-action-buttons">
                  <button
                    className="btn btn-outline-danger btn-lg"
                    onClick={themVaoGioHang}
                  >
                    Thêm vào giỏ hàng
                  </button>
                  <button className="btn btn-danger btn-lg" onClick={muaNgay}>
                    Mua ngay
                  </button>
                </div>

                <div className="left-policy-card">
                  <h6 className="policy-title">Chính sách ưu đãi</h6>
                  <ul className="policy-list mb-0">
                    <li>Giao nhanh, đóng gói kỹ</li>
                    <li>Hỗ trợ đổi trả trong 7 ngày</li>
                    <li>Ưu đãi khi mua số lượng lớn</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="right-detail-panel">
                <p className="detail-tagline mb-1">Thông tin sách</p>
                <h1 className="detail-title mb-2">{sach.tenSach}</h1>

                <div className="meta-row mb-3">
                  <span className="meta-item">
                    Tác giả: {sach.tenTacGia || "Đang cập nhật"}
                  </span>
                  <span className="meta-item">
                    ISBN: {sach.isbn || "Đang cập nhật"}
                  </span>
                </div>

                <div className="detail-rating text-warning mb-3">
                  {starRating(sach.trungBinhXepHang ?? 0)}
                </div>

                <div className="price-box mb-3">
                  <h2 className="detail-price mb-0">
                    {dinhDangSo(sach.giaBan)} đ
                  </h2>
                  <span className="stock-badge">
                    Còn lại: {sach.soLuong ?? 0} quyển
                  </span>
                </div>

                <div className="quantity-line mb-3">
                  <span className="quantity-label">Số lượng:</span>
                  <div className="quantity-wrap">
                    <button className="quantity-btn" onClick={giamSoLuongMua}>
                      -
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      min={1}
                      value={soLuongHienTai}
                      onChange={handleOnchange}
                    />
                    <button className="quantity-btn" onClick={tangSoLuongMua}>
                      +
                    </button>
                  </div>
                </div>

                <div className="price-preview mb-4">
                  <span className="price-label">Tạm tính</span>
                  <h5 className="price-value">
                    {dinhDangSo(tongTienTamTinh)} đ
                  </h5>
                </div>

                <div className="shipping-card mb-3">
                  <h6 className="mb-1">Thông tin vận chuyển</h6>
                  <p className="mb-0 text-muted">
                    Giao hàng tiêu chuẩn 2-4 ngày, có theo dõi đơn hàng.
                  </p>
                </div>

                <div className="detail-description">
                  <h6 className="mb-2">Mô tả ngắn</h6>
                  <p className="mb-0 text-muted">
                    {sach.moTa || "Đang cập nhật mô tả cho cuốn sách này."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ĐÁNH GIÁ SẢN PHẨM */}
        <div className="review-section mt-5">
          <h4 className="fw-bold mb-4">Đánh giá sản phẩm</h4>

          <div className="review-form-card mb-4">
            <h6 className="fw-bold mb-3">Viết đánh giá của bạn</h6>

            <div className="d-flex align-items-start gap-3">
              <img
                src={thongTinNguoiDung?.anhDaiDien || "https://via.placeholder.com/54"}
                alt="avatar"
                className="rounded-circle border"
                style={{
                  width: "54px",
                  height: "54px",
                  objectFit: "cover",
                }}
              />

              <div className="flex-grow-1">
                <div className="mb-2 text-warning">
                  {starRating(soSaoDanhGia)}
                </div>

                <div className="rating-picker mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`rating-dot ${soSaoDanhGia === star ? "active" : ""}`}
                      onClick={() => setSoSaoDanhGia(star)}
                    >
                      {star}
                    </button>
                  ))}
                </div>

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

          <DanhGiaSanPham
            maSach={maSachNumber}
            reloadDanhGia={reloadDanhGia}
            setReloadDanhGia={setReloadDanhGia}
          />
        </div>
      </div>
    </div>
  );
};

export default ChiTietSanPham;