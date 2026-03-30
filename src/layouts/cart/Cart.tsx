import { data, NavLink, useNavigate } from "react-router-dom";
import MotHinhAnhCuaSach from "../product/components/MotHinhAnhCuaSach";
import { error } from "console";
import { useEffect, useState } from "react";
import { viewCart } from "../../api/SachTrongKho";
import dinhDangSo from "../utils/DinhDangSo";
interface ViewCart {
    maGioHangSach: number,
    maSach: number,
    soLuong: number,
    tenSach: string,
    giaBan: number,
    tongGia: number
}
const Cart: React.FC = () => {
    const [sachTrongGioHang, setSachTrongGioHang] = useState<ViewCart[]>([]);
    const [trangThai, setTrangThai] = useState(true);
    const [baoLoi, setBaoLoi] = useState("");
    const [danhSachSanPhamChon, setDanhSachSanPhamChon] = useState<number[] | null>([]);
    const [maDiaChiGiaoHang, setMaDiaChiGiaoHang] = useState<number | null>();
    const [maHinhThucThangToan, setMaHinhThucThangToan] = useState<number | null>();
    const [maHinhThucGiaoHang, setMaHinhThucGiaoHang] = useState<number | null>();
    const [datHang, setDatHang] = useState<boolean>(false);
    const [danhSachDonTrongGioDat, setDanhSachDonTrongGioDat] = useState<number | null>();
    const [reload , setReload] = useState<boolean>(false) ; 
    useEffect(() => {
        viewCart()
            .then(data => {
                setSachTrongGioHang(data);
                setTrangThai(false);
            })
            .catch(error => {
                console.error(error);
                setBaoLoi("Lỗi trong quá trình lấy sách từ giỏ hàng " + error);
            });
    }, [reload]);

    const handleCheckboxChange = (id: number, checked: boolean) => {
        setDanhSachSanPhamChon(prev =>
            (checked && danhSachSanPhamChon && prev)
                ? [...prev, id]
                : prev && prev.filter(x => x !== id)
        );
    };
    const handleDeleteBook = async () => {
        if (danhSachSanPhamChon == null || danhSachSanPhamChon.length == 0) {
            return;
        }
        const accessToken = localStorage.getItem("accessToken");
        await fetch("http://localhost:8080/cart/delete-book", {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(
                { danhSachSanPhamChon: danhSachSanPhamChon }
            )
        }).then(
            (respone) => {
                if (!respone.ok) {
                    throw new Error("Không xóa đc sách trong giỏ hàng!");
                }else {
                    alert("Xóa thành cồn khỏi giỏ hàng") ; 
                    setReload(!reload) ; 
                }
            }
        )
    }
    const navigate = useNavigate();
    const handleDatHang = async () => {
        if (!danhSachSanPhamChon || danhSachSanPhamChon.length == 0) {
            alert("vui long chọn sản phẩm để đặt hàng");
            return;
        }
        danhSachSanPhamChon && navigate("/checkout/chi-tiet-don", {
            state: {
                danhSachSanPhamChon
            }
        })

    }

    if (baoLoi) return <div>{baoLoi}</div>;
    if (trangThai) return <p>đang tải dữ liệu</p>;

    return (
        <div className="container mt-4">

            {/* Danh sách sản phẩm */}
            <div className="card shadow-sm">
                <div className="card-header fw-bold">
                    Giỏ hàng của bạn
                </div>

                <div className="card-body">
                    {sachTrongGioHang.length === 0 && (
                        <p className="text-center text-muted">
                            Giỏ hàng đang trống
                        </p>
                    )}

                    {sachTrongGioHang.map(sach => (
                        danhSachSanPhamChon && (
                            <div
                                key={sach.maGioHangSach}
                                className="row align-items-center mb-3 border-bottom pb-3"
                            >

                                {/* Checkbox */}
                                <div className="col-1 text-center">
                                    <input
                                        type="checkbox"
                                        checked={danhSachSanPhamChon.includes(sach.maGioHangSach)}
                                        onChange={(e) =>
                                            handleCheckboxChange(
                                                sach.maGioHangSach,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>

                                {/* Ảnh */}
                                <div className="col-3 text-center">
                                    <NavLink to={`/sach/${sach.maSach}`}>
                                        <MotHinhAnhCuaSach maSach={sach.maSach} />
                                    </NavLink>
                                </div>

                                {/* Thông tin */}
                                <div className="col-4">
                                    <p className="fw-bold mb-1">{sach.tenSach}</p>
                                    <p className="mb-1">Số lượng: {sach.soLuong}</p>
                                </div>

                                {/* Giá */}
                                <div className="col-4 text-end">
                                    <p className="mb-1">Giá: {dinhDangSo(sach.giaBan)} đ</p>
                                    <p className="fw-bold text-danger">
                                        Tổng: {dinhDangSo(sach.tongGia)} đ
                                    </p>
                                </div>
                            </div>
                        )
                    ))}
                </div>

                {/* Footer hành động */}
                <div className="card-footer d-flex justify-content-between align-items-center">

                    <div>
                        <button
                            className="btn btn-outline-danger me-2"
                            onClick={handleDeleteBook}
                        >
                            Xóa sản phẩm
                        </button>

                        <NavLink to="/don-hang">
                            <button className="btn btn-outline-success">
                                Đơn hàng của tôi
                            </button>
                        </NavLink>
                    </div>

                    <button
                        className="btn btn-primary px-4"
                        onClick={handleDatHang}
                    >
                        Đặt hàng
                    </button>

                </div>
            </div>
        </div>
    );

};

export default Cart; 